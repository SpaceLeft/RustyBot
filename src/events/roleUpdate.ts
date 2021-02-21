import { MessageEmbed } from 'discord.js'

export default class {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async run(oldRole, newRole): Promise<void> {
        if (!oldRole.guild) return
        if (!oldRole.guild.hasLog()) return

        const embed = {
            title: `Role "${oldRole.name}" updated`,
            color: 0x3498db,
            timestamp: new Date(),
            fields: [],
            footer: {
                text: `ID: ${oldRole.id}`
            }
        }

        if (oldRole.name !== newRole.name) {
            embed.fields.push({
                name: 'Before',
                value: '**Name: **' + oldRole.name
            }, {
                name: 'After',
                value: '**Name: **' + newRole.name
            })
        } else if (oldRole.color !== newRole.color) {
            embed.fields.push({
                name: 'Before',
                value: '**Color: **' + oldRole.hexColor
            }, {
                name: 'After',
                value: '**Color: **' + newRole.hexColor
            })
        } else if (oldRole.hoist !== newRole.hoist) {
            embed.fields.push({
                name: 'Before',
                value: '**Separated: **' + (oldRole.hoist ? 'Yes' : 'No')
            }, {
                name: 'After',
                value: '**Separated: **' + (newRole.hoist ? 'Yes' : 'No')
            })
        } else if (oldRole.mentionable !== newRole.mentionable) {
            embed.fields.push({
                name: 'Before',
                value: '**Mentionable: **' + (oldRole.mentionable ? 'Yes' : 'No')
            }, {
                name: 'After',
                value: '**Separated: **' + (newRole.mentionable ? 'Yes' : 'No')
            })
        } else if (!oldRole.permissions.equals(newRole.permissions.bitfield)) {
            const removed = newRole.permissions.missing(oldRole.permissions).map((r) => `❌ ${r}`)
            const added = oldRole.permissions.missing(newRole.permissions).map((r) => `✅ ${r}`)
            const permissions = [...added, ...removed].map(r => `\`${oldRole.client.utils.capitalize(r.replace(/_/g, ' ').toLowerCase())}\``)
            embed.fields.push({
                name: 'New permissions',
                value: permissions.join('\n')
            })
        } else return

        await oldRole.guild.log(new MessageEmbed(embed))
    }
}