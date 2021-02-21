import { IMessage } from '@types'
import Command from '../../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['resume'],
            help: 'Pauses/resumes the player',
            inVoiceChannel: true,
            sameVoiceChannel: true,
            playing: true
        })
    }
    run(message: IMessage): string {
        const player = message.guild.getPlayer()

        player.pause(!player.paused)

        return `Player is now **${!player.paused ? 'resumed' : 'paused'}**.`
    }
}