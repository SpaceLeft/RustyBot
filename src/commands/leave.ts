import { IMessage } from '@types'
import Command from '../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['exit'],
            hide: true
        })
    }
    async run(message: IMessage): Promise<string> {
        if (!message.client.games.has(message.author.id)) throw 'You not playing anything...'
        message.client.games.delete(message.author.id)
        return 'Exited the game.'
    }
}