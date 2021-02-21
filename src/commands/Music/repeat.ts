import { IMessage } from '@types'
import Command from '../../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['loop'],
            help: 'Toggles the repeat mode.',
            inVoiceChannel: true,
            sameVoiceChannel: true,
            playing: true
        })
    }
    run(message: IMessage, args: string[]): string {
        const player = message.guild.getPlayer()

        if (args[0] && /queue/i.test(args[0])) {
            player.setQueueRepeat(!player.queueRepeat)
            return `**${player.queueRepeat ? 'Enabled' : 'Disabled'}** queue repeat.`
        }

        player.setTrackRepeat(!player.trackRepeat)

        return `**${player.trackRepeat ? 'Enabled' : 'Disabled'}** track repeat.`
    }
}