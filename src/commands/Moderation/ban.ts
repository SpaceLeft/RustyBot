import Command from '../../structures/Command'
import Case from '../../structures/Case'
import { IMessage } from '@types'

export default class extends Command {
    constructor() {
        super(__filename, {
            help: {
                content: 'Ban a user from the server',
                examples: ['@User Spamming', '@User']
            },
            args: [{
                name: 'member',
                type: 'member',
                required: true
            }, {
                name: 'reason',
                type: 'text',
            }],
            userPermissions: ['BAN_MEMBERS'],
            botPermissions: ['BAN_MEMBERS']
        })
    }
    async run(message: IMessage, args: string[]): Promise<string | void> {
        const toBan = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null)

        if (!toBan) throw 'Invalid user provided, please try again'

        if (toBan.id == message.author.id) throw 'You can\'t ban yourself.'

        if (toBan.id == message.client.user.id) throw 'Really?'

        if (!toBan.bannable) throw `I'm unable to ban "${toBan.user.tag}"`

        if (message.author.id !== message.guild.ownerID && message.member.roles.highest.comparePositionTo(toBan.roles.highest) <= 0) {
            throw `You are unable to ban "${toBan.user.tag}"`
        }

        const reason = args[1] ? args.slice(1).join(' ') : 'No Reason'

        try {
            await toBan.ban({
                reason: `Banned by: ${message.author.tag}\nReason: ${reason}`
            })

            message.say(`**${toBan.user.tag}** has been banned for \`${reason}\``)

            if (message.guild.settings.channels.mod) {
                await new Case(message.guild)
                    .setModerator(message.author)
                    .setReason(reason)
                    .setUser(toBan.user.id, toBan.user.tag)
                    .setType('banned')
                    .send()
            }
        } catch {
            return 'I can\'t ban him :/'
        }
    }
}