import Command from '../../structures/Command'
import { Util } from 'discord.js'
import moment from 'moment'
import { IMessage } from '@types'


const regions = {
    brazil: 'Brazil',
    europe: 'Europe',
    hongkong: 'Hong Kong',
    india: 'India',
    japan: 'Japan',
    russia: 'Russia',
    singapore: 'Singapore',
    southafrica: 'South Africa',
    sydeny: 'Sydeny',
    'us-central': 'US Central',
    'us-east': 'US East',
    'us-west': 'US West',
    'us-south': 'US South'
}

export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['server', 'guild', 'guildinfo'],
            help: 'Displays information about the server that said message was run in.',
            args: {
                name: 'guild-id',
                type: 'ID'
            }
        })
    }

    async run(message: IMessage, args: string[]): Promise<string> {
        let guild

        if (!args[0]) guild = message.guild
        if (!guild && /^\d{17,19}$/.test(args[0])) guild = message.client.guilds.cache.get(args[0])

        if (!guild) throw 'I can\'t find that server.'

        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString())
        const channels = message.guild.channels.cache
        const emojis = message.guild.emojis.cache

        let text = ''

        text += '`[General]`\n'
        text += '```md\n' + [
            `Name: ${Util.escapeMarkdown(guild.name)}`,

            `ID: ${guild.id}`,

            `Owner: ${Util.escapeMarkdown(guild.owner?.user?.tag || 'Unknown#0000')} (ID: ${guild.ownerID})`,

            `Region: ${regions[guild.region]}`,

            `Created At: ${moment(guild.createdTimestamp).format('LT')} ${moment(guild.createdTimestamp).format('LL')} (${moment(guild.createdTimestamp).fromNow()})`

        ].map(item => '- ' + item).join('\n') +
            '```'

        text += '\n'

        text += '`[Statistics]`\n'

        text += '```json\n' +
            JSON.stringify({
                roles: roles.length,
                emojis: emojis.size,
                members: guild.memberCount.toLocaleString('en'),
                text_channels: channels.filter(c => c.type === 'text').size,
                voice_channels: channels.filter(c => c.type === 'voice').size,
                boost_count: Number(guild.premiumSubscriptionCount || '0')
            }, null, 2) +
            '```'


        text += '\n'

        return `Here some info about **${message.guild.name}**.\n\n` + text
    }
}