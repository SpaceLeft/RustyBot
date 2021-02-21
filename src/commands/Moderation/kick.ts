import Command from '../../structures/Command'
import Case from '../../structures/Case'
import { IMessage } from '@types'

export default class extends Command {
    constructor() {
        super(__filename, {
            help: {
                content: 'Kick a user from the server',
                examples: ['@User Spamming', '@User']
            },
            args: [{
                name: 'member',
                type: 'member',
                required: true
            }, {
                name: 'reason',
                type: 'text'
            }],
            userPermissions: ['KICK_MEMBERS'],
            botPermissions: ['KICK_MEMBERS']
        })
    }
    async run(message: IMessage, args: string[]): Promise<string | void> {
        const toKick = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null)

        if (!toKick) throw 'Invalid user provided, please try again'

        if (toKick.id == message.author.id) throw 'You can\'t kick yourself'

        if (toKick.id == message.client.user.id) throw 'Really?'

        if (!toKick.kickable) throw `I'm unable to kick "${toKick.user.tag}"`

        if (message.author.id !== message.guild.ownerID && message.member.roles.highest.comparePositionTo(toKick.roles.highest) <= 0) {
            throw `You are unable to kick "${toKick.user.tag}"`
        }

        const reason = args[1] ? args.slice(1).join(' ') : 'No Reason'

        try {
            await toKick.kick(`Kicked by: ${message.author.tag}\nReason: ${reason}`)
            message.say(`**${toKick.user.tag}** has been kicked for \`${reason}\``)
            if (message.guild.settings.channels.mod) {
                await new Case(message.guild)
                    .setModerator(message.author)
                    .setReason(reason)
                    .setUser(toKick.user.id, toKick.user.tag)
                    .setType('kicked')
                    .send()
            }
        } catch {
            return 'I can\'t kick him :/'
        }
    }
}