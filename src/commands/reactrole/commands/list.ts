import { IMessage } from '@types'

export default async (message: IMessage): Promise<void> => {
    const data = message.guild.settings.reactions_roles.filter(val => val && val.message_id && val.reaction_review)

    if (data.length <= 0) throw 'You do not have any reaction roles.'

    const embed = {
        color: 3447003,
        fields: []
    }

    for (const msg_id of new Set(data.map(r => r.message_id))) {
        embed.fields.push({
            name: msg_id,
            value: data.filter(r => r.message_id === msg_id).map(r => `${r.reaction_review} <@&${r.role_id}>`).join('\n'),
            inline: true
        })
    }

    message.say({ embed })
}