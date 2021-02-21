import { IMessage } from '@types'
import Command from '../../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            help: 'Starts the song from the beginning.',
            inVoiceChannel: true,
            sameVoiceChannel: true,
            playing: true
        })
    }
    run(message: IMessage): string {
        message.guild.getPlayer().seek(0)
        return 'Replayed song...'
    }
}