import { IMessage } from '@types'
import Command from '../../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            help: 'Skips current song.',
            inVoiceChannel: true,
            sameVoiceChannel: true,
            playing: true
        })
    }
    run(message: IMessage): string {
        const player = message.guild.getPlayer()

        if (!player.queue.current) throw 'There is no music playing.'

        const {
            title
        } = player.queue.current

        player.stop()

        return `\`${title}\` was skipped.`
    }
}