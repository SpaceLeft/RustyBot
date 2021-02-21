import { IMessage } from '@types'
import Command from '../../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            help: 'Stops current playing track',
            inVoiceChannel: true,
            sameVoiceChannel: true,
            playing: true
        })
    }
    run(message: IMessage): void {
        message.guild.getPlayer().destroy()
        message.react('👋').catch(() => message.say('Stopped!'))
    }
}