import { IMessage, IReactionRole } from '@types'
import { MessageEmbed } from 'discord.js'
import {
    ask,
    parseEmoji,
    parseColor,
    splitOnce
} from '../utils'

export default async (message: IMessage): Promise<void> => {
    const embed = new MessageEmbed()

    let channel, reactions: IReactionRole[] = []

    channel = await ask(message, 'Hello. Which channel would you like the message to be in?')

    channel = message.guild.channels.cache.find((c) => {
        if (c.id == channel) return true
        if (c.name.toLowerCase() == channel.toLowerCase()) return true
        if (/<#(\d{17,19})>/.test(channel) && channel.match(/<#\d{17,19}>/)[1] == c.id) return true
        return false
    })

    if (!channel) throw 'Channel not found..'

    const content = await ask(message, 'What would you like the message to say? Use a | to separate the title from the description, like so\n```This is a title | this is the description```\nYou can also type `{roles}` to have it replaced with a list of each emoji and its associated role.', 60000 * 10)

    const [title, description] = splitOnce(content, '|')

    embed.setTitle(title)

    if (description) embed.setDescription(description)

    const color = await ask(message, 'Alright, I got a title and a description, would you like the message to have a color?')

    embed.setColor(parseColor(color))

    if (!channel.permissionsFor(message.guild.me)?.has('ADD_REACTIONS')) {
        throw `I'm missing the permissions to react in ${channel}!`
    }

    message.say('Next up we will add roles The format for adding roles is emoji then the name of the role.\nWhen you\'re done, type: `done`\n**Example:** ```:smile: league of legends```')

    const collector = message.channel.createMessageCollector(m => m.author.id === message.author.id, {
        time: 60000 * 10
    })


    collector
        .on('end', async (_, reason) => {
            if (reason == 'done') {

                if (embed.title == '{roles}') {
                    embed.setTitle('Self-assignable roles')
                    embed.setDescription(reactions.map(r => `${r.reaction_review} <@&${r.role_id}>`).join('\n'))
                }

                const m = await channel.send({ embed }).catch(() => null)

                if (!m) return

                for (const emoji of reactions.map(r => r.reaction)) await m.react(emoji).catch(() => null)

                reactions = reactions.map(obj => Object.assign(obj, {
                    message_id: m.id
                }))

                message.say({
                    embed: {
                        title: `${reactions.length} Reaction role Created`,
                        color: 3447003,
                        fields: [{
                            name: 'Limit',
                            value: `You have added \`${message.guild.settings.reactions_roles.length + 1}/250\` reaction roles so far.`
                        }, {
                            name: 'Message ID',
                            value: `\`${m.id}\``
                        }, {
                            name: 'Go to message',
                            value: `[Click me](${m.url})`
                        }]
                    }
                })

                await message.guild.update({
                    reactions_roles: [...message.guild.settings.reactions_roles, ...reactions]
                })
            }
        })
        .on('collect', async msg => {
            if (msg.content.toLowerCase() == 'done') {
                return collector.stop('done')
            } else if (msg.content.toLowerCase() == 'cancel') {
                collector.stop('cancel')
                return message.say('Canceling...')
            }

            let [emoji, role] = msg.content.replace(/\s+/g, ' ').split(/ +/)

            if (!role) return message.say('The syntax for adding roles is emoji then role, like `:angel: role_name`')

            emoji = parseEmoji(emoji)

            if (!emoji) return message.say('That does not seem to be an emoji. If you insist that it is, make sure you don\'t have any other bots deleting messages from either of us. **Type \'done\' to save and finish** or \'`cancel`\' to discard everything.')

            role = message.guild.roles.cache.find(r => {
                if (r.id === role) return true
                if (r.name.toLowerCase() === role.toLowerCase()) return true
                if (/<@&(\d{17,19})>/.test(role) && r.id == role.match(/<@&(\d{17,19})>/)[1]) return true
                return false
            })

            if (!role) return message.say(`I couldn't find a role with the name \`${role}\`. The format is \`:emoji: role\` and make sure the role actually exists.`)

            if (role.managed) return message.say(`The role \`${role.name}\` is managed and cannot be assigned.`)

            reactions.push({
                reaction: emoji.id || emoji.name,
                reaction_review: emoji.review,
                guild_id: message.guild.id,
                message_id: null,
                channel_id: channel.id,
                role_id: role.id,
                type: 'normal'
            })

            msg.react('✅')
        })
}