/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export default class {
    async run(reaction, user): Promise<void> {
        if (user.bot || !reaction.message || !reaction.message.guild) return

        const message = reaction.message
        const permissions = message.channel.permissionsFor(message.guild.me)

        if (!permissions || !permissions.has(['MANAGE_ROLES', 'MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'])) return

        const {
            reactions_roles
        } = message.guild.settings

        const data = reactions_roles.find(r => r.message_id == message.id && r.reaction == (reaction.emoji.id || reaction.emoji.name))

        if (!data) return

        const member = message.guild.members.cache.get(user.id) || await message.guild.members.fetch(user.id).catch(() => null)

        if (!member) return

        const {
            role_id,
            type
        } = data

        if (type !== 'verify') await member.roles.remove(role_id).catch(() => null)
    }
}