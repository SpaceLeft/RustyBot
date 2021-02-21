import Command from '../../structures/Command'
import ms from 'ms'
import { IMessage } from '@types'

export default class extends Command {
    constructor() {
        super(__filename, {
            help: 'Seeks to a specified time in the song',
            args: {
                name: 'time',
                required: true
            },
            inVoiceChannel: true,
            sameVoiceChannel: true,
            playing: true
        })
    }
    run(message: IMessage, args: string[]): string {
        const player = message.guild.getPlayer()

        const {
            duration
        } = player.queue.current

        const time = ms(args.join(' '))

        if (time > duration || time <= 0) throw 'Your seek time is out of range of the current song\'s duration'

        player.seek(time)

        return `Successfully seeked to: \`${new Date(time).toISOString().slice(11, 19)}\``
    }
}