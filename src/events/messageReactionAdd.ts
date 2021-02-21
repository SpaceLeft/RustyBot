/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import translate from '@iamtraction/google-translate'
import codes from '../../JSON/languages-codes.json'


export default class {
    async run(reaction, user): Promise<void> {
        if (user.bot || !reaction.message || !reaction.message.guild) return

        const message = reaction.message
        const permissions = message.channel.permissionsFor(message.guild.me)

        if (!permissions || !permissions.has(['MANAGE_ROLES', 'MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'])) return

        const language = codes.find(l => l.flags.includes(reaction.emoji.name))
        const {
            reactions_roles
        } = message.guild.settings

        if (!reactions_roles.some(r => r.message_id == message.id) && language && message.guild.settings.plugins.translate && message.channel.permissionsFor(user).has('SEND_MESSAGES')) {

            if (!permissions.has('EMBED_LINKS')) return

            let text = ''

            if (message.content) text += message.content

            if (message.embeds[0] && message.embeds[0].description) text += message.embeds[0].description

            text = text.slice(0, 2000)

            if (!text || !text.trim()) return


            message.channel.startTyping()


            reaction.users.remove(user).catch(() => null)

            let translated

            try {
                translated = await translate(text, {
                    to: language.code
                })
            } catch {
                message.channel.stopTyping()
                return
            }

            message.channel.stopTyping()

            if (translated) {
                message.say(`${user}`, {
                    embed: {
                        author: {
                            name: 'Google Translate',
                            iconURL: 'https://i.imgur.com/1JS81kv.png'
                        },
                        description: [
                            `${translated.text}\n`,
                            `Translation from ***${translated.from.language.iso}*** to ***${language.name}***`
                        ].join('\n'),
                        fields: [{
                            name: 'Original message',
                            value: `[Jump](${message.url})`,
                        }],
                        color: 37577,
                        footer: {
                            text: 'Powered by Google translate',
                            icon_url: user.avatarURL({ dynamic: true })
                        }
                    }
                }).then((m) => {
                    m.react('🗑️')
                    m.awaitReactions((_reaction, _user) => _user.id == user.id && _reaction.emoji.name == '🗑️', {
                        max: 1,
                        time: 60000,
                        errors: ['time']
                    })
                        .then(() => m.delete().catch(() => null))
                        .catch(() => m.reactions.removeAll().catch(() => null))
                })
            }
            return
        }

        const data = reactions_roles.filter(r => r.message_id == message.id)
        const _ = data.find((r) => r.reaction == (reaction.emoji.id || reaction.emoji.name))

        if (!_) return

        const member = message.guild.members.cache.get(user.id) || await message.guild.members.fetch(user.id).catch(() => null)

        if (!member) return


        const roles = data.map((r) => r.role_id)
        const {
            type,
            role_id
        } = _

        await member.roles.add(role_id).catch(() => null)


        if (type === 'verify') {
            await reaction.users.remove(user).catch(() => null)
        } else if (type === 'unique') {
            const roles_to_remove = member.roles.cache.filter((role) => role.id !== role_id && roles.includes(role.id))

            if (roles_to_remove.size > 0) await member.roles.remove(roles_to_remove, 'Unique Reaction Roles').catch(() => null)

            message.reactions.cache
                .filter((_reaction) => reaction.emoji.identifier !== _reaction.emoji.identifier)
                .each((_reaction) => _reaction.users.remove(user).catch(() => null))
        }
    }
}