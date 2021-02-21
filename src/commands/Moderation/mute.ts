import Command from '../../structures/Command'
import ms from 'ms'
import { IMessage, IMute } from '@types'
import { Role } from 'discord.js'

export default class extends Command {
    constructor() {
        super(__filename, {
            help: {
                content: 'Mutes a member.',
                examples: [
                    '@User 1m Spamming',
                    '@User 5h ads',
                    '@User 10d',
                ]
            },
            args: [{
                name: 'member',
                type: 'member',
                required: true
            }, {
                name: 'time',
                type: 'time',
                required: true
            }, {
                name: 'reason',
                type: 'text'
            }],
            userPermissions: ['MANAGE_MESSAGES', 'MUTE_MEMBERS'],
            botPermissions: ['MANAGE_CHANNELS', 'VIEW_AUDIT_LOG', 'MANAGE_ROLES']
        })
    }
    async run(message: IMessage, args: string[]): Promise<string|void> {
        const toMute = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null)

        if (!toMute) throw 'Invalid user provided, please try again'

        if (toMute.id == message.author.id) throw 'You can\'t mute yourself'

        if (toMute.id == message.client.user.id) throw 'Really?'

        if (message.author.id !== message.guild.ownerID && message.member.roles.highest.comparePositionTo(toMute.roles.highest) <= 0) {
            throw `You are unable to mute "${toMute.user.tag}"`
        }

        const time = ms(args[1] || 'x')

        if (!time || isNaN(time) || time < 0) throw `You need to include a mute length like \`${message.prefix}mute @TheMaestroo 1m\``

        const reason = args[2] ? args.slice(2).join(' ') : 'No Reason'

        const role = await this.getMuteRole(message)

        if (!role) throw 'I cannot find/create mute role'

        if (toMute.roles.cache.has(role.id)) throw `"${toMute.user.tag}" is already muted.`

        try {

            await toMute.roles.add(role, `Muted by: ${message.author.tag}\nReason: ${reason}`)

            const data = <IMute> {
                ID: toMute.id + message.guild.id,
                user_id: toMute.id,
                guild_id: message.guild.id,
                role_id: role.id,
                time: time + Date.now()
            }

            message.client.cache.mutes.set(data.ID, data)

            await message.guild.update({
                $push: {
                    mutes: data
                }
            })

            return `Muted **${toMute.user.tag}** until \`${ms(time, { long: true })}\``
        } catch (err) {
            message.client.logger.error(err)
            throw 'Something bad happened while mute this member.'
        }
    }
    async getMuteRole(message: IMessage): Promise<Role|null> {
        try {
            let role

            role = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted')

            if (role) return role

            role = await message.guild.roles.create({
                name: 'Muted',
                mentionable: false
            })

            return role
        } catch {
            return null
        }
    }
}