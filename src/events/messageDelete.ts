import { IMessage } from '@types'
import { MessageEmbed, Util } from 'discord.js'


export default class {
    async run(message: IMessage): Promise<void> {
        if ([message, message.guild, message.author].some(value => !value)) return
        if (message.author.id == message.client.user.id) return
        if (message.author.bot) return
        if (!message.guild.hasLog()) return

        let content = ''

        if (message.content) content += Util.escapeMarkdown(message.content).slice(0, 2038)
        if (message.attachments.first()) {
            content += message.attachments.map((a) => a.url).join(', ')
        }



        const embed = new MessageEmbed({
            title: `Message deleted in #${message.channel.name}`,
            author: {
                name: message.author.tag,
                icon_url: message.author.displayAvatarURL({ dynamic: true })
            },
            description: content,
            color: 0xe74c3c,
            timestamp: new Date(),
            footer: {
                text: `ID: ${message.id}`
            }
        })

        await message.guild.log(embed)
    }
}