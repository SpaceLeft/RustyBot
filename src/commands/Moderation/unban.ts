import Command from '../../structures/Command'
import Case from '../../structures/Case'
import { IMessage } from '@types'

export default class extends Command {
    constructor() {
        super(__filename, {
            help: {
                content: 'Unban a user from the server',
                examples: ['644975690005086229', 'User#0000']
            },
            args: {
                name: 'ID',
                type: 'text',
                required: true
            },
            userPermissions: ['BAN_MEMBERS'],
            botPermissions: ['BAN_MEMBERS']
        })
    }
    async run(message: IMessage, args: string[]): Promise<string> {
        let user

        if (/^\d{17,19}$/.test(args[0])) {
            user = await message.client.users.fetch(args[0]).catch(() => null)
        }

        if (!user) throw 'Invalid user provided, please try again'

        const banned = await message.guild.fetchBans()

        if (!banned.some((m) => m.user.id == user.id)) throw `${user.tag} is not banned!`

        const reason = args[1] ? args.slice(1).join(' ') : 'No Reason'

        try {

            await message.guild.members.unban(user, `Unbanned by: ${message.author.tag}\nReason: ${reason}`)

            if (message.guild.settings.channels.mod) {
                await new Case(message.guild)
                    .setModerator(message.author)
                    .setReason(reason)
                    .setUser(user.id, user.tag)
                    .setType('unbanned')
                    .send()
            }

            return `**${user.tag}** has just been unbanned from **${message.guild.name}**!`
        } catch {
            throw 'I can\'t unban him :/'
        }
    }
}