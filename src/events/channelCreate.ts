import { MessageEmbed } from 'discord.js'

export default class {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async run(channel): Promise<void> {
        if (!channel.guild) return
        if (!channel.guild.hasLog()) return


        const embed = new MessageEmbed({
            title: `${channel.client.utils.capitalize(channel.type)} channel created`,
            color: 0x2ecc71,
            fields: [{
                name: 'Channel: ',
                value: `${channel.type !== 'text' ? `\`${channel.name}\`` : channel.toString()}`
            }],
            timestamp: new Date(),
            footer: {
                text: `ID: ${channel.id}`
            }
        })

        await channel.guild.log(embed)
    }
}