import { IMessage } from '@types'

export default async (message: IMessage, args: string[]): Promise<void> => {

    if (args[0] && args[0].toLowerCase() == 'stop') {
        message.react('✅').catch(() => message.say('Done!'))
        await message.guild.update({
            $set: {
                'channels.mod': null
            }
        })
        return
    }

    const channel = message.mentions.channels.filter((c) => c.type === 'text' && c.guild.id === message.guild.id).first()

    if (!channel) throw 'Please specify a valid channel!'

    await message.guild.update({
        $set: {
            'channels.mod': channel.id
        }
    })

    message.react('✅').catch(() => message.say('Done!'))
}