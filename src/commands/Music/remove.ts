import Command from '../../structures/Command'
import { Util } from 'discord.js'
import { IMessage } from '@types'


export default class extends Command {
    constructor() {
        super(__filename, {
            help: 'Removes a song from the queue',
            args: {
                name: 'song-number|all',
                type: 'number',
                required: true
            },
            inVoiceChannel: true,
            sameVoiceChannel: true,
            playing: true
        })
    }
    run(message: IMessage, args: string[]): string {
        const player = message.guild.getPlayer()


        if (args[0] && /all/i.test(args[0])) {
            player.queue.clear()
            return 'Successfully cleared the queue!'
        }


        const track = parseInt(args[0])

        if (!track || isNaN(track)) throw 'Please specify a track to remove'

        if (!player.queue.size || track > player.queue.size) throw `There is no track "${track}" in the queue`

        const removedTrack = player.queue.remove(track - 1)
        
        return `Successfully removed \`${Util.escapeMarkdown(removedTrack[0].title)}\` from the queue`
    }
}