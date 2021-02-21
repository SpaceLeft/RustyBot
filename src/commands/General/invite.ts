import Command from '../../structures/Command'
import { IMessage } from '@types'
import { MessageEmbed } from 'discord.js'

export default class extends Command {
    constructor() {
        super(__filename, {
            help: 'Get invite link to add the bot.'
        })
    }
    async run(message: IMessage): Promise<void> {
        const invite = this.inviteURL(808840415, message.client.user.id)

        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setDescription(`You can invite me by this [Link](${invite})!`)

        if (message.channel.permissionsFor(message.guild.me)?.has('EMBED_LINKS')) {
            message.say(embed)
        } else {
            message.author.send(embed)
                .then(() => message.reply('Check your DM\'s!'))
                .catch(() => message.say(`You can invite me by this link: <${invite}>`))
        }
    }
    inviteURL(permissions: number, id: string): string {
        return `https://discord.com/api/oauth2/authorize?client_id=${id}&permissions=${permissions}&scope=bot`
    }
}