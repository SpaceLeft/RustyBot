import { IMessage } from '@types'
import Command from '../../structures/Command'
import Twenty48 from '../../structures/Games/Twenty48'
const REACTIONS = {
    '⬅️': 'left',
    '⬆️': 'up',
    '⬇️': 'down',
    '➡️': 'right',
    '❌': 'exit'
}


export default class extends Command {
    constructor() {
        super(__filename, {
            help: 'Plays Twenty48 Game!',
            aliases: ['2048'],
            botPermissions: ['USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY']
        })
    }
    async run(message: IMessage): Promise<void> {
        const game = new Twenty48()

        const msg = await message.reply('Loading... :arrows_counterclockwise:')

        for (const emoji of Object.keys(REACTIONS)) await msg.react(emoji)

        await msg.edit(`${game}`)

        const filter = (reaction, user) => user.id === message.author.id && Object.keys(REACTIONS).includes(reaction.emoji.name)

        const collector = message.client.utils.createCollector({
            filter,
            time: 60000 * 15,
            idle: 60000,
            async onCollect({
                emoji,
                users
            }) {
                if (!message.client.games.has(message.author.id)) {
                    return collector.stop()
                }

                users.remove(message.author).catch(() => null)

                if (emoji.name == '❌') {
                    collector.stop()
                    msg.edit(game.getStats())
                    return
                }

                const temp = [...game.grid]

                game.grid = game[REACTIONS[emoji.name]](game.grid)

                if (!game.isLoss() && !message.client.utils.arraysEqual(game.grid, temp)) {
                    game.moves++
                    game.spawn_random()
                }

                let res

                if (game.isLoss()) {
                    collector.stop()
                    res = `You Lose!\n${game.getStats()}`
                } else if (game.isWin()) {
                    collector.stop()
                    res = `You Win!\n${game.getStats()}`
                } else {
                    res = game.toString()
                }
                await msg.edit(res).catch(() => null)
            },
            onEnd() {
                message.client.games.delete(message.author.id)
                msg.reactions.removeAll().catch(() => null)
            }
        }, msg)
    }
}