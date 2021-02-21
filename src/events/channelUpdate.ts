import { MessageEmbed } from 'discord.js'

export default class {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async run(oldChannel, newChannel): Promise<void> {
        if ([oldChannel, newChannel, oldChannel.guild, newChannel.guild].some(value => !value)) return
        if (!oldChannel.guild.hasLog()) return


        const embed = {
            title: `${oldChannel.client.utils.capitalize(oldChannel.type)} channel updated`,
            color: 0x3498db,
            fields: [],
            timestamp: new Date(),
            footer: {
                text: `ID: ${oldChannel.id}`
            }
        }


        const removedOverwrite = oldChannel.permissionOverwrites.find(perm => !newChannel.permissionOverwrites.has(perm.id))
        const addedOverwrite = newChannel.permissionOverwrites.find(perm => !oldChannel.permissionOverwrites.has(perm.id))
        const updatedOverwrite = oldChannel.permissionOverwrites.filter(x => {
            if (newChannel.permissionOverwrites.find(y => y.allow.equals(x.allow) && newChannel.permissionOverwrites.find(y => y.deny.equals(x.deny)))) return false
            return true
        }).concat(newChannel.permissionOverwrites.filter(x => {
            if (oldChannel.permissionOverwrites.find(y => y.allow.equals(x.allow) && oldChannel.permissionOverwrites.find(y => y.deny.equals(x.deny)))) return false
            return true
        })).map(({
            allow,
            deny,
            id,
            type
        }) => `**Overwrites for <@${type == 'role' ? '&' : ''}${id}> in ${oldChannel} updated.**\n\n${allow.toArray().map(p => `**${this.formatPermission(p, oldChannel)}** ➜ ✅`).join('\n')}\n\n${deny.toArray().map(p => `**${this.formatPermission(p, oldChannel)}** ➜ ❌`).join('\n')}`)[0]


        if (oldChannel.name !== newChannel.name) {
            embed.fields.push({
                name: 'Before',
                value: '**Name: **' + oldChannel.name
            }, {
                name: 'After',
                value: '**Name: **' + newChannel.name
            })
        } else if (oldChannel.topic !== newChannel.topic) {
            embed.fields.push({
                name: 'Before',
                value: '**Topic: **' + (oldChannel.topic || 'None')
            }, {
                name: 'After',
                value: '**Topic: **' + (newChannel.topic || 'None')
            })
        } else if (oldChannel.nsfw !== newChannel.nsfw) {
            embed.fields.push({
                name: 'Before',
                value: '**NSFW: **' + (oldChannel.nsfw ? 'Yes' : 'No')
            }, {
                name: 'After',
                value: '**NSFW: **' + (newChannel.nsfw ? 'Yes' : 'No')
            })
        } else if (oldChannel.rawPosition !== newChannel.rawPosition) {
            embed.fields.push({
                name: 'Before',
                value: '**Position: **' + oldChannel.rawPosition
            }, {
                name: 'After',
                value: '**Position: **' + newChannel.rawPosition
            })
        } else if (oldChannel.bitrate !== newChannel.bitrate) {
            embed.fields.push({
                name: 'Before',
                value: '**Bitrate: **' + oldChannel.bitrate + 'kbps'
            }, {
                name: 'After',
                value: '**Bitrate: **' + newChannel.bitrate + 'kbps'
            })
        } else if (removedOverwrite) {
            embed.fields.push({
                name: 'Overwrite Removed',
                value: `<@${removedOverwrite.type == 'role' ? '&' : ''}${removedOverwrite.id}>\n${removedOverwrite.allow.toArray().map(p => `**${this.formatPermission(p, oldChannel)}** ➜ ✅`).join('\n')}\n\n${removedOverwrite.deny.toArray().map(p => `**${this.formatPermission(p, oldChannel)}** ➜ ❌`).join('\n')}`
            })
        } else if (addedOverwrite) {
            embed.fields.push({
                name: 'Overwrite Added',
                value: `<@${addedOverwrite.type == 'role' ? '&' : ''}${addedOverwrite.id}>\n${addedOverwrite.allow.toArray().map(p => `**${this.formatPermission(p, oldChannel)}** ➜ ✅`).join('\n')}\n\n${addedOverwrite.deny.toArray().map(p => `**${this.formatPermission(p, oldChannel)}** ➜ ❌`).join('\n')}`
            })
        } else if (updatedOverwrite && updatedOverwrite.length > 0) {
            embed.fields.push({
                name: 'Overwrite Updated',
                value: updatedOverwrite
            })
        } else return


        await oldChannel.guild.log(new MessageEmbed(embed))
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    formatPermission(perm: string, channel): string {
        return channel.client.utils.capitalize(perm.replace(/_/g, ' ').toLowerCase())
    }
}