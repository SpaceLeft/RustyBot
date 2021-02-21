import { IMessage } from '@types'
import Command from '../../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            help: 'Shuffles the queue',
            inVoiceChannel: true,
            sameVoiceChannel: true,
            playing: true
        })
    }
    run(message: IMessage): string {
        message.guild.getPlayer().queue.shuffle()
        return 'The queue is now shuffled.'
    }
}