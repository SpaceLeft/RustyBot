import { IMessage } from '@types'

export default async (message: IMessage, args: string[], type: string): Promise<string> => {
    if (!args[0]) return message.client.utils.formatMissing(['message_id'], 0, `${message.prefix}rr ${type}`)

    let data = message.guild.settings.reactions_roles.filter(r => r.message_id == args[0])

    if (data.length <= 0) throw 'That message does not have any registered reaction roles.'

    data = data.map(obj => Object.assign(obj, {
        type: type
    }))

    data = [...message.guild.settings.reactions_roles.filter(r => r.message_id !== args[0]), ...data]

    await message.guild.update({
        reactions_roles: data
    })

    return `That message is now marked as **${type}**`
}