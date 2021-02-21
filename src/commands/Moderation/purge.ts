import Command from '../../structures/Command'
import { Util } from 'discord.js'
import { IMessage } from '@types'


export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['clear'],
            help: {
                content: 'Clear messages',
                examples: [
                    '10',
                    '10 @User',
                    '50 @User1, @User2, etc...',
                    '100 mentions',
                    '30 images',
                    '20 embeds',
                    '5 bots',
                    '3 humans',
                    '2 roles',
                    '5 me'
                ]
            },
            args: [{
                name: 'amount',
                type: 'number',
                required: true
            }, {
                name: 'filter',
                type: 'text'
            }],
            userPermissions: ['MANAGE_MESSAGES'],
            botPermissions: ['MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_CHANNELS']
        })
    }
    async run(message: IMessage, args: string[]): Promise<void> {
        if (args[0].toLowerCase() === 'all') {

            message.say('All the channel messages will be deleted! To confirm type `-confirm`')

            message.channel.awaitMessages((m) => m.author.id == message.author.id && m.content.toLowerCase() == '-confirm', {
                max: 1,
                time: 20000,
                errors: ['time']
            }).then(async (): Promise<void> => {

                const newChannel = await message.channel.clone()

                await message.channel.delete()

                newChannel.setPosition(message.channel.position)

                newChannel.send('Channel cleared!')

            }).catch(() => message.say('Time\'s up! Please send the command again'))
            return
        }


        const amount = parseInt(args[0])

        if (!amount || isNaN(amount) || amount < 1) throw 'You must specify a number of messages to delete!'

        await message.delete().catch(() => null)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let messages: any = await message.channel.messages.fetch({
            limit: 100
        })

        const FILTERS = {
            mentions: (m): boolean => /(\d{17,19})/i.test(m.content),
            users: (m): boolean => [...message.mentions.users.map(u => u.id)].includes(m.author.id),
            roles: (m): boolean => [...message.mentions.roles.map(u => u.id)].includes(m.author.id),
            bots: (m): boolean => m.author.bot,
            humans: (m): boolean => !m.author.bot,
            embeds: (m): boolean => Boolean(m.embeds[0]),
            images: (m): boolean => Boolean(m.attachments[0]),
            me: (m): boolean => m.author.id == message.author.id
        }
        

        messages = messages
            .filter(msg => msg.id !== message.id)
            .sort((a, b) => b.createdTimestamp - a.createdTimestamp)
            .array()
            .slice(0, amount)

        messages = FILTERS?.[args[1]?.toLowerCase()] ? messages.filter(FILTERS[args[1].toLowerCase()]) : messages
        
        if (message.mentions.users.first()) messages = messages.filter(FILTERS.users)
        if (message.mentions.roles.first()) messages = messages.filter(FILTERS.roles)

        messages = messages.filter((m) => !m.pinned)

        message.channel.bulkDelete(messages, true).then((msgs) => {
            const users: string[] = message.client.utils.trimArray([...new Set(msgs.map(m => Util.escapeMarkdown(m.author.tag) + `: ${msgs.filter(_m => _m.author.id == m.author.id).size}`))])
            message.say(`**${msgs.size}** were messages deleted!\n\n${users.map(u => `**${u}**`).join('\n')}`).then(m => m.del(3000))
        }).catch(() => message.say('Failed to purge messages.'))
    }
}