import { IMessage } from '@types'
import { Role } from 'discord.js'
import Command from '../../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            help: {
                content: 'Unmute a member.',
                examples: [
                    '@User',
                    '@User Say hi!'
                ]
            },
            args: [{
                name: 'user',
                type: 'user',
                required: true
            }, {
                name: 'reason',
                type: 'text'
            }],
            userPermissions: ['MANAGE_MESSAGES', 'MUTE_MEMBERS'],
            botPermissions: ['MANAGE_CHANNELS', 'VIEW_AUDIT_LOG', 'MANAGE_ROLES']
        })
    }
    async run(message: IMessage, args: string[]): Promise<string> {
        const toUnmute = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null)

        if (!toUnmute) throw 'Invalid user provided, please try again'

        if (toUnmute.id == message.author.id) throw 'You can\'t unmute yourself'


        if (message.author.id !== message.guild.ownerID && message.member.roles.highest.comparePositionTo(toUnmute.roles.highest) <= 0) {
            throw `You are unable to unmute "${toUnmute.user.tag}"`
        }

        const reason = args[1] ? args.slice(1).join(' ') : 'No Reason'

        const role = await this.getMuteRole(message)

        if (!role) throw 'I cannot find/create mute role'

        if (!toUnmute.roles.cache.has(role.id)) throw `"${toUnmute.user.tag}" is not muted.`

        try {

            await toUnmute.roles.remove(role, `Unmuted by: ${message.author.tag}\nReason: ${reason}`)

            const ID = `${toUnmute.id}${message.guild.id}`

            const data = message.client.cache.guilds.find(g => g.mutes.some(m => m.ID == ID))

            if (data) {
                await message.guild.update({
                    mutes: data.mutes.filter(m => m.ID !== ID)
                })
                message.client.cache.mutes.delete(ID)
            }

            return `Unmuted **${toUnmute.user.tag}**`
        } catch {
            throw 'Something bad happened while unmute this member.'
        }
    }
    async getMuteRole(message: IMessage): Promise<Role | null> {
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