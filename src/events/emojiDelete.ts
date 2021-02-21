import { MessageEmbed } from 'discord.js'

export default class {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async run(emoji): Promise<void> {
        if (!emoji.guild) return
        if (!emoji.guild.hasLog()) return

        const embed = new MessageEmbed({
            title: 'Emoji deleted',
            color: 0xe74c3c,
            timestamp: new Date(),
            thumbnail: {
                url: emoji.url
            },
            footer: {
                text: `ID: ${emoji.id}`
            }
        })

        await emoji.guild.log(embed)
    }
}