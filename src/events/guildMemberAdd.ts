import moment from 'moment'

export default class {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async run(member): Promise<void> {
        if (!member.guild) return
        if (member.client.cache.mutes.has(member.id + member.guild.id)) this.handleMute(member)
        if (!member.guild.hasLog()) return


        const embed = {
            title: 'Member joined',
            author: {
                name: member.user.tag,
                icon_url: member.user.displayAvatarURL({ dynamic: true })
            },
            color: 0x2ecc71,
            description: `${member} ${member.guild.memberCount.toLocaleString('en')}th to join!\nCreated: ${moment(member.user.createdTimestamp).fromNow()}`,
            timestamp: new Date(),
            footer: {
                text: `ID: ${member.id}`
            }
        }

        await member.guild.log(embed)
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async handleMute(member) {
        const {
            time,
            role_id
        } = member.client.cache.mutes.get(member.id + member.guild.id)

        if (Date.now() < time && member.guild.me.permissions.has('MANAGE_ROLES')) {
            await member.roles.add(role_id).catch(() => null)
        }
    }
}