/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Case from '../structures/Case'

export default class {
    async run(oldMember, newMember) {

        if ([oldMember, newMember, oldMember.guild, newMember.guild].some(value => !value)) return

        if (oldMember.roles.cache.size !== newMember.roles.cache.size) this.handleModLog(oldMember, newMember)


        if (!oldMember.guild.hasLog()) return

        const embed = {
            title: null,
            author: {
                name: oldMember.user.tag,
                icon_url: oldMember.user.displayAvatarURL({ dynamic: true })
            },
            description: null,
            color: 0x3498db,
            fields: [],
            timestamp: new Date(),
            footer: {
                text: `ID: ${oldMember.id}`
            }
        }

        if (oldMember.nickname !== newMember.nickname) {
            embed.title = 'Nickname change'
            embed.fields.push({
                name: 'Old: ',
                value: oldMember.nickname || 'None'
            }, {
                name: 'New: ',
                value: newMember.nickname || 'None'
            })
            embed.color = 0x3498db
        } else if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
            if (newMember.roles.cache.size > oldMember.roles.cache.size) {
                const role = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id)).first()
                embed.title = 'Role added'
                embed.color = 0x2ecc71
                embed.description = role.toString()
            } else {
                const role = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id)).first()
                embed.title = 'Role removed'
                embed.color = 0xe74c3c
                embed.description = role.name
            }
        } else return

        await oldMember.guild.log(embed)
    }
    async handleModLog(oldMember, newMember) {
        if (!oldMember.client.cache.guilds.has(oldMember.guild.id)) return

        if (!oldMember.guild.me?.permissions?.has('VIEW_AUDIT_LOG')) return

        oldMember.guild.settings = oldMember.client.cache.guilds.get(oldMember.guild.id)

        const isMuted = newMember.roles.cache.size > oldMember.roles.cache.size

        const role = (isMuted ? newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id)) : oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id))).first()

        if (!role || !/^muted$/i.test(role.name)) return

        if ((isMuted && !newMember.roles.cache.has(role.id)) || (!isMuted && newMember.roles.cache.has(role.id))) return

        const log = await oldMember.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_ROLE_UPDATE',
        }).then(audit => audit.entries.first()).catch(() => null)

        if (!log) return

        const {
            executor: moderator,
            target: user,
            reason
        } = log

        if (!user || oldMember.id !== user.id) return

        await new Case(oldMember.guild)
            .setUser(oldMember.id, oldMember.user.tag)
            .setType(isMuted ? 'muted' : 'unmuted')
            .setModerator(moderator || {
                id: '0',
                avatar: '0',
                tag: 'Unknown#0000'
            })
            .setReason(reason || 'No Reason')
            .send()
    }
}