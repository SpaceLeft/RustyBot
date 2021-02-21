import { IMessage } from '@types'
import { MessageEmbed, Util } from 'discord.js'


export default class {
    async run(oldMessage: IMessage, newMessage: IMessage): Promise<void> {
        if ([oldMessage, newMessage, oldMessage.guild, newMessage.guild, oldMessage.author].some(value => !value)) return
        if ([oldMessage, newMessage, newMessage.content, oldMessage.content].some(value => !value)) return

        if (oldMessage.content == newMessage.content) return
        if (oldMessage.author.id == oldMessage.client.user.id) return
        if (oldMessage.author.bot) return
        if (!oldMessage.guild.hasLog()) return

        const embed = new MessageEmbed({
            title: `Message edited in #${oldMessage.channel.name}`,
            author: {
                name: oldMessage.author.tag,
                icon_url: oldMessage.author.displayAvatarURL({
                    dynamic: true
                })
            },
            color: 0x3498db,
            fields: [{
                name: 'Old: ',
                value: Util.escapeMarkdown(oldMessage.content).slice(0, 1014)
            }, {
                name: 'New: ',
                value: Util.escapeMarkdown(newMessage.content).slice(0, 1014)
            }],
            timestamp: new Date(),
            footer: {
                text: `ID: ${oldMessage.id}`
            }
        })

        await oldMessage.guild.log(embed)
    }
}