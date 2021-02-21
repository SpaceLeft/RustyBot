import { MessageEmbed } from 'discord.js'

export default class {
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async run(channel): Promise<void> {
        if (!channel.guild) return
        if (!channel.guild.hasLog()) return

        const embed = new MessageEmbed({
            title: `${channel.client.utils.capitalize(channel.type)} channel deleted`,
            color: 0xe74c3c,
            fields: [{
                name: 'Channel: ',
                value: `\`${channel.name}\``
            }],
            timestamp: new Date(),
            footer: {
                text: `ID: ${channel.id}`
            }
        })

        await channel.guild.log(embed)
    }
}