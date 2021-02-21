import { IMessage } from '@types'
import { fetchMessage } from '../utils'

export default async (message: IMessage, args: string[]): Promise<string> => {
    if (!args[0]) return message.client.utils.formatMissing(['message_id'], 0, `${message.prefix}rr fix`)


    const data = message.guild.settings.reactions_roles.filter(r => r.message_id === args[0])

    if (data.length <= 0) throw 'That message does not have any registered reaction roles.'

    const msg = await fetchMessage(message.client, data[0].message_id, data[0].channel_id)

    if (!msg) throw 'That message does not have any registered reaction roles.'

    await data.forEach(r => msg.react(r.reaction).catch(() => null))

    return 'All done!'
}