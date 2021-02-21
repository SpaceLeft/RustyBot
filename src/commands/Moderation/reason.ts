import Command from '../../structures/Command'
import Case from '../../structures/Case'
import { IMessage } from '@types'
import { TextChannel } from 'discord.js'

export default class extends Command {
    constructor() {
        super(__filename, {
            help: {
                content: 'Updates a modlog reason',
                examples: ['644975690005086229', 'User#0000']
            },
            args: [{
                name: 'case',
                type: 'number',
                required: true
            }, {
                name: 'reason',
                type: 'text',
                required: true
            }],
            userPermissions: ['BAN_MEMBERS'],
            botPermissions: ['READ_MESSAGE_HISTORY']
        })
    }
    async run(message: IMessage, args: string[]): Promise<string> {

        const selected = parseInt(args[0])

        if (!selected || isNaN(selected)) throw 'Please specify a valid case ID.'

        if (!args[1]) throw 'Please specify a reason.'

        const reason = args.slice(1).join(' ')

        const channel = message.guild.channels.cache.get(message.guild.settings.channels.mod)

        if (!channel) throw `Modlogs channel not found. Please do \`${message.prefix}config modlog <channel>\` to set it!`

        const log = message.guild.settings.cases[selected - 1]

        if (!log) throw 'That case could not be found, please try another ID.'

        const messages = await (channel as TextChannel).messages.fetch({
            limit: 100
        })

        const regex = new RegExp('`\\[\\d{1,2}:\\d{1,2}:\\d{1,2}\\]` `\\[' + selected + '\\]` [\\s\\S]+\n`\\[Reason\\]` [\\s\\S]+')

        const msg = messages.find(m => m.author.id == message.client.user.id && regex.test(m.content))

        try {
            if (msg && msg.editable) {
                const content = msg.content.split('\n').slice(0, 1)
                content.push('`[Reason]` ' + reason)
                await msg.edit(content.join('\n'))
            } else {
                const [ user, mod ] = await Promise.all([message.client.users.fetch(log.user), message.client.users.fetch(log.moderator)])
                await new Case(message.guild)
                    .setModerator(mod)
                    .setUser(user.id, user.tag)
                    .setType(log.type)
                    .setReason(reason)
                    .setCase(selected)
                    .send()
            }
        } catch {
            throw 'Failed to update that case'
        }

        const oldReason = log.reason || 'No Reason Specified.'

        message.guild.settings.cases[selected - 1].reason = reason

        await message.guild.update({
            cases: message.guild.settings.cases
        })

        return `Case \`${selected}\` has been updated.\n` + '```diff\n' + `+ ${reason}\n- ${oldReason}` + '```'
    }
}