import Command from '../../structures/Command'
import { Util } from 'discord.js'
import { IMessage } from '@types'


export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['jump'],
            help: 'Skips to a certain song in the queue',
            args: {
                name: 'song-position',
                type: 'number',
                required: true
            },
            inVoiceChannel: true,
            sameVoiceChannel: true,
            playing: true
        })
    }
    run(message: IMessage, args: string[]): string {

        const selected = parseInt(args[0])

        if (!selected || isNaN(selected)) throw 'Invalid number.'

        if (selected == 0) throw `Cannot skip to a song that is already playing. To skip the current playing song type: \`${message.prefix}skip\``

        const player = message.guild.getPlayer()

        if (selected > player.queue.length || (selected && !player.queue[selected - 1])) throw 'Song not found.'

        const {
            title
        } = player.queue[selected - 1]

        if (selected == 1) player.stop()

        player.queue.splice(0, selected - 1)
        player.stop()

        return `Skipped to **${Util.escapeMarkdown(title)}**.`
    }
}