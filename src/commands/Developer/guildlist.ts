import { IMessage } from '@types'
import { MessageEmbed } from 'discord.js'
import Command from '../../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['gl'],
            ownerOnly: true
        })
    }
    async run(message: IMessage): Promise<void> {
        let pages, max = 0, i = 0

        pages = message.client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .array()
            .map((g, i) => `${i+1}. ${g.name} | ${g.memberCount} - (${g.id})`)

        pages = message.client.utils.chunkArray(pages, 10)
        max = pages.length - 1

        const embed = new MessageEmbed()
            .setTitle('Guild list!')
            .setColor('BLUE')
            .setDescription('```' + pages[i].join('\n') + '```')


        const m = await message.say(embed)

        for (const emoji of ['⏮️', '◀️', '▶️', '⏭️']) await m.react(emoji)

        const filter = (reaction, user) => ['⏮️', '◀️', '▶️', '⏭️'].includes(reaction.emoji.name) && user.id === message.author.id

        const collector = m.createReactionCollector(filter, {
            time: 60000 * 10
        })

        collector
            .on('end', () => m.reactions.removeAll().catch(() => null))
            .on('collect', async ({
                emoji,
                users
            }, user) => {
                users.remove(user).catch(() => null)
                switch (emoji.name) {
                case '◀️':
                case '⏮️':
                    if (i === 0) return
                    i--
                    if (emoji.name == '⏮️') i = 0
                    break
                case '▶️':
                case '⏭️':
                    if (i === max) return
                    i++
                    if (emoji.name == '⏭️') i = max
                    break
                }
                if (m.editable) m.edit(embed.setDescription('```' + pages[i].join('\n') + '```'))
            })
    }
}