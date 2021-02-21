import { MessageEmbed } from 'discord.js'

export default class {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async run(oldEmoji, newEmoji): Promise<void> {
        if (!oldEmoji.guild) return
        if (!oldEmoji.guild.hasLog()) return


        const embed = {
            title: 'Emoji updated',
            color: 0x3498db,
            timestamp: new Date(),
            fields: [],
            thumbnail: {
                url: oldEmoji.url
            },
            footer: {
                text: `ID: ${oldEmoji.id}`
            }
        }

        if (oldEmoji.name !== newEmoji.name) {
            embed.fields.push({
                name: 'Before',
                value: '**Name: **' + oldEmoji.name,
                inline: false
            }, {
                name: 'After',
                value: '**Name: **' + newEmoji.name,
                inline: false
            })
        } else return


        await oldEmoji.guild.log(new MessageEmbed(embed))
    }
}