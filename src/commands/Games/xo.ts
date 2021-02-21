import { IMessage } from '@types'
import Command from '../../structures/Command'
import XO from '../../structures/Games/XO'
const REACTIONS = ['↖️', '⬆️', '↗️', '⬅️', '⏺️', '➡️', '↙️', '⬇️', '↘️']


export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['ttt'],
            help: 'Play Tic Tac Toe game',
            args: {
                name: 'users',
                type: 'user'
            },
            botPermissions: ['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']
        })
    }
    async run(message: IMessage): Promise<void> {
        const mention = message.mentions.users.filter((u) => u.id !== message.author.id && !u.bot).first()
        const players = [message.author.id, mention?.id ?? 'AI']

        const game = new XO(players)

        const msg = await message.say('🔄 Reactions are loading, please wait...')

        for (const emoji of REACTIONS) await msg.react(emoji)

        await msg.edit(`${game}`)

        const m = await message.say(`${message.author}, Select your move: `)

        const filter = (reaction, user) => players.includes(user.id) && REACTIONS.includes(reaction.emoji.name)

        const collector = message.client.utils.createCollector({
            filter,
            time: 60000 * 5,
            idle: 40000,
            async onCollect(reaction, user) {
                if (!message.client.games.has(message.author.id)) return collector.stop()

                reaction.users.remove(user).catch(() => null)

                if (!m.editable || !msg.editable) return

                const index = REACTIONS.indexOf(reaction.emoji.name)

                if (!game.canPlay(user.id, index)) return
				
                game.add(index)

                if (check(game, collector, msg, m, user)) return

                if (game.currentPlayer === 'AI') {
                    game.AI()
                    if (check(game, collector, msg, m, message.client.user)) return
                }

                await msg.edit(`${game}`)

                if (game.players[1] !== 'AI') await m.edit(`<@${game.currentPlayer}>, Select your move: `)
            },
            onEnd() {
                message.client.games.delete(message.author.id)
                msg.reactions.removeAll().catch(() => null)
            }
        }, msg)
    }
}

function check(game, collector, msg, m, user) {
    if (game.check()) {
        msg.edit(`${game}`)
        m.edit(`${user} has won the game! :tada:`)
        collector.stop()
        return true
    } else if (game.noWinner()) {
        msg.edit(`${game}`)
        m.edit('No one won the game, it\'s a tie! Let\'s try again?')
        collector.stop()
        return true
    }
    return false
}