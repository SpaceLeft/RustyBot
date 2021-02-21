import Command from '../../structures/Command'
import { Util } from 'discord.js'
import moment from 'moment'
import { IMessage } from '@types'

export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['user', 'ui'],
            help: 'Displays information about a provided user or the message author.',
            args: {
                name: 'user',
                type: 'user'
            }
        })
    }
    async run(message: IMessage, args: string[]): Promise<string> {
        let user

        if (!args[0]) user = message.author
        if (!user) user = message.mentions.users.first() || message.client.users.cache.get(args[0])
        if (!user && /^\d{17,19}$/.test(args[0])) user = await message.client.users.fetch(args[0]).catch(() => null)

        if (!user) throw 'I can\'t find him...'

        const member = message.mentions.members.get(user.id) || await message.guild.members.fetch(user.id).catch(() => null)

        let text = ''

        text += '`[User]`\n' + '```md\n' + [
            `Username: ${Util.escapeMarkdown(user.username)}`,
            `ID: ${user.id}`,
            `Created At: ${moment(user.createdTimestamp).format('LT')} ${moment(user.createdTimestamp).format('LL')} (${moment(user.createdTimestamp).fromNow()})`,
            `Game: ${Util.escapeMarkdown(user.presence.game || 'Not playing a game.')}`,
        ].map(item => '- ' + item).join('\n') + '```'

        if (member) {
            const roles = member.roles.cache
                .sort((a, b) => b.position - a.position)
                .map(role => Util.escapeMarkdown(role.name))
                .slice(0, -1)

            text += '\n`[Member]`\n' + '```md\n' + [
                `Highest Role: ${member.roles.highest.id == message.guild.id ? 'None' : Util.escapeMarkdown(member.roles.highest.name)}`,
                `Joined At: ${moment(member.joinedAt).format('LL LTS') + ' (' + moment(member.joinedAt).fromNow() + ')'}`
            ].map(item => '+ ' + item).join('\n') + '```\n'

            if (roles.length >= 1) text += '`[Roles]`\n' + '```json\n' + JSON.stringify(message.client.utils.trimArray(roles), null, 2) + '```\n'
        }

        return `Here some info about **${user.tag}**.\n\n` + text
    }
}