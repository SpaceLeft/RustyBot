import { IMessage } from '@types'
import Command from '../../structures/Command'
import FlagsGame from '../../structures/Games/Flags'

export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['flags'],
            help: 'Play country-flags game',
            args: {
                name: 'user',
                type: 'user'
            },
            botPermissions: ['ATTACH_FILES', 'READ_MESSAGE_HISTORY']
        })
    }
    async run(message: IMessage): Promise<void> {
        const players = [
            message.member,
            ...message.mentions.members.filter(m => !m.user.bot && m.id !== message.author.id).array()
        ]

        const game = new FlagsGame(players)

        const flags = game.getFlags(),
            country = game.getCountry()

        message.say(`${game}`, {
            files: [{
                name: 'flag.png',
                attachment: `https://flagcdn.com/w1280/${country.code.toLowerCase()}.png`
            }],
            replyTo: message
        })

        const filter = (m) => /^[1-5]$/.test(m.content) && players.some((player) => m.author.id === player.id)

        const collector = message.client.utils.createCollector({
            filter,
            time: 30000,
            onCollect(msg) {
                const number = parseInt(msg.content)
                if (flags[number - 1].code === country.code) {
                    collector.stop('win')
                    return msg.reply('You won the game! :tada:')
                }
                message.reply(players.length === 1 ? `**GG**, It's \`${country.name}\`` : '**No**')
                if (players.length === 1) collector.stop()
            },
            onEnd(_, reason) {
                message.client.games.delete(message.author.id)
                if (reason === 'time') message.say(`Nobody win. The country is \`${country.name}\``)
            }
        }, message.channel)
    }
}