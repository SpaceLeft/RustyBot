import Command from '../../structures/Command'
import { IMessage } from '@types'

export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['ava'],
            args: {
                name: 'user',
                type: 'user'
            },
            botPermissions: ['ATTACH_FILES']
        })
    }
    async run(message: IMessage, args: string[]): Promise<void> {
        if (args[0] && /^server|guild/i.test(args[0])) {
            if (!message.guild.icon) throw 'No icon for this server.'

            const icon = message.guild.iconURL({
                dynamic: true,
                size: 1024
            })
    
            message.say(`Avatar for **${message.guild.name}**`, {
                files: [{
                    attachment: icon
                }]
            })
            return
        }

        let user

        if (!args[0]) user = message.author

        if (!user) user = message.mentions.users.first()

        if (!user && /^\d{17,19}$/.test(args[0])) user = message.client.users.cache.get(args[0]) || await message.client.users.fetch(args[0]).catch(() => null)

        if (!user) throw 'I can\'t find him...'


        const avatar = user.displayAvatarURL({
            dynamic: true,
            size: 1024
        })

        message.say(`Avatar for **${user.tag}**`, {
            files: [{
                attachment: avatar
            }]
        })
    }
}