import { IMessage } from '@types'


export default async (message: IMessage, args: string[]): Promise<void> => {
    if (args[0] && args[0].toLowerCase() == 'stop') {
        message.react('✅').catch(() => message.say('Done!'))
        await message.guild.update({
            log: {
                enabled: false
            }
        })
        message.client.cache.logs.delete(message.guild.id)
        return
    }

    const channel = message.mentions.channels.filter((c) => c.type == 'text' && c.guild.id === message.guild.id).first()

    if (!channel) throw 'Please specify a valid channel!'

    channel.createWebhook(message.client.user.username, {
        avatar: message.client.user.avatarURL(),
        reason: `Created by ${message.author.tag}`
    }).then(({
        id,
        token
    }) => {
        message.react('✅').catch(() => message.say('Done!'))
        message.guild.update({
            log: {
                id,
                token,
                enabled: true,
                channel: channel.id
            }
        }).then(({
            log
        }) => message.client.cache.logs.set(message.guild.id, log))
    }).catch(() => message.say('Cannot create webhook for logging :/'))
}