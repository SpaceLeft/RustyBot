import { MessageEmbed } from 'discord.js'

export default class {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async run(role): Promise<void> {
        if (!role.guild) return
        if (!role.guild.hasLog()) return

        const embed = new MessageEmbed({
            title: 'Role deleted',
            color: 0xe74c3c,
            timestamp: new Date(),
            description: [
                `**Name:** \`${role.name}\``,
                `**Color:** \`${role.hexColor}\``,
                `**Mentionable:** \`${role.mentionable ? 'Yes' : 'No'}\``,
                `**Displayed separately:** \`${role.hoist ? 'Yes' : 'No'}\``,
                `**Position:** \`${role.rawPosition}\``
            ].join('\n'),
            footer: {
                text: `ID: ${role.id}`
            }
        })

        await role.guild.log(embed)
    }
}