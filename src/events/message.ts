import { IMessage } from '@types'
import { createHash } from 'crypto'
import { Collection, MessageEmbed } from 'discord.js'
import Command from 'src/structures/Command'

const escapeRegex = (str) => typeof str === 'string' ? str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : ''


export default class {
    async run(message: IMessage): Promise<any> {
        const client = message.client
        const config = client.config

        if (message.author.bot || !message.guild) return

        if (config.mode === 'dev' && message.author.id !== config.ownerID) return

        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return

        if (!message.member) await message.guild.members.fetch(message.author.id)

        if (!message.guild.isCached()) await message.guild.fetchSettings()

        message.prefix = message.guild.settings.prefix

        if (config.mode === 'dev') message.prefix = '!'

        const prefixRegex = new RegExp(`^(${client.user.username}|<@!?${client.user.id}>|${escapeRegex(message.prefix)})\\s*`, 'i')

        if (!prefixRegex.test(message.content)) return

        const [, matchedPrefix] = message.content.match(prefixRegex)

        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()

        if (!commandName) return

        const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName))


        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            if (message.guild.settings.ignored.channels.includes(message.channel.id) || message.guild.settings.ignored.roles.some((role) => message.member.roles.cache.has(role))) return
            if (command && message.guild.settings.ignored.commands.includes(command.name)) return
        }


        if (!command) return

        if (this.checkCooldown(message, command)) return

        const say = (content) => new Promise((resolve) => message.say(content).then(resolve).catch(() => resolve(null)))
        const reply = (content) => new Promise((resolve) => message.reply(content).then(resolve).catch(() => resolve(null)))

        if (command.ownerOnly && message.author.id !== config.ownerID) {
            return reply('Only for bot owner.')
        }

        if (!message.channel.permissionsFor(message.member)?.has(command.userPermissions)) {
            if (command.userPermissions.includes('ADMINISTRATOR') || !message.member.roles.cache.some(r => message.guild.settings.roles.mod.includes(r.id))) {
                return reply(`You don't have access to \`${message.prefix}${commandName}\``)
            }
        }

        if (!message.channel.permissionsFor(message.guild.me)?.has(command.botPermissions)) {
            const missing = message.channel.permissionsFor(message.guild.me).missing(command.botPermissions).map(p => `- ${client.utils.capitalize(p.replace(/_/g, ' ').toLowerCase())}`).join('\n')
            return say('I need the following permissions to run this command:\n' + '```diff\n' + missing + '```')
        }

        const voice = message.member.voice.channel

        if (command.category === 'Games') {
            if (message.client.games.has(message.author.id)) return reply(`You are currently in a game! Use \`${message.prefix}leave\` to leave ur current game`)
            message.client.games.add(message.author.id)
        }

        if (command.inVoiceChannel && !voice)
            return reply('You need to be in a voice channel for this command!')

        if (command.sameVoiceChannel && voice.id !== message.guild.me.voice.channelID)
            return reply('You\'re not in the same voice channel as me!')

        if (command.playing && !message.guild.getPlayer())
            return say('Nothing is playing right now!')

        if (command.botPermissions.includes('CONNECT') && !voice.joinable)
            return reply('I don\'t have permission to join your voice channel.')

        if (command.botPermissions.includes('SPEAK') && !voice.speakable)
            return reply('I don\'t have permission to speak in your voice channel.')


        if (command.args.some((arg, index) => {
            if (arg.required && !args[index]) {
                say(command.getMissing(message.prefix, index))
                return true
            }
            return false
        })) return

        if (command.typing) message.channel.startTyping()

        try {
            const output = await command.run(message, args)
            if (this.isFriendlyOutput(output)) {
                say(output)
            }
        } catch (error) {
            if (this.isFriendlyOutput(error)) {
                say('`[ERROR]`\n```diff\n- ' + error.toString() + '```')
            } else {
                client.logger.error(error)
                const errorCode = createHash('sha1').update(error.toString()).digest('hex')
                say('`[ERROR]`\n```diff\n' + `- There was an error trying to execute that command!\n+ CODE: ${errorCode}` + '```')
            }
        } finally {
            if (command.typing) message.channel.stopTyping()
        }
    }
    checkCooldown(message: IMessage, command: Command): boolean {
        if (!message.client.cooldown.has(command.name)) message.client.cooldown.set(command.name, new Collection())

        const start = Date.now()
        const timestamps = message.client.cooldown.get(command.name)

        if (timestamps.has(message.author.id)) {
            const {
                time,
                last
            } = timestamps.get(message.author.id)

            if (start - last > 3000) {
                message.reply('Please wait a few seconds... to be able to run this command again!').then(m => (m as IMessage).del(7000))
                timestamps.set(message.author.id, {
                    time: time,
                    last: start
                })
            }

            if (start < (time + command.cooldown)) return true
        }

        timestamps.set(message.author.id, {
            time: start,
            last: start - 4000
        })

        setTimeout(() => timestamps.delete(message.author.id), command.cooldown)
        return false
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    isFriendlyOutput(str: any): boolean {
        return (str && (typeof str === 'string' || str instanceof MessageEmbed))
    }
}