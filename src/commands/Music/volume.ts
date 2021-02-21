import { IMessage } from '@types'
import Command from '../../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['vol'],
            help: 'Sets the player\'s volume',
            args: {
                name: 'volume',
                type: 'number'
            },
            inVoiceChannel: true,
            sameVoiceChannel: true,
            playing: true
        })
    }
    async run(message: IMessage, args: string[]): Promise<string> {
        const player = message.guild.getPlayer()

        if (!args[0]) return `Current volume: **${player.volume}%**`

        const volume = parseInt(args[0])

        if (isNaN(volume) || volume <= 0 || volume > 250) throw 'You may set the volume 1-250'

        await player.setVolume(volume)

        return `Set volume to **${volume}%**`
    }
}