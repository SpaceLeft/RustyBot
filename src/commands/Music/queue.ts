import Command from '../../structures/Command'
import { Util } from 'discord.js'
import { IMessage } from '@types'


export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['q'],
            help: 'Shows all the enqueued tracks',
            args: {
                name: 'page',
                type: 'number'
            },
            playing: true,
        })
    }
    run(message: IMessage, args: string[]): string {
        const player = message.client.music.get(message.guild.id)
        const queue = player.queue


        let text = '```css\n' + `Queue of ${Util.escapeMarkdown(message.guild.name)}` + '```\n\n'

        const multiple = 10
        const page = args[0] && Number(args[0]) ? Number(args[0]) : 1

        const end = page * multiple
        const start = end - multiple

        const tracks = queue.slice(start, end)

        if (queue.current) text += 'Current:\n```fix\n' + `${Util.escapeMarkdown(queue.current.title)}\n\n` + '```\n'

        text += 'Queue:\n'

        if (!tracks.length) text += `No tracks in ${page > 1 ? `page ${page}` : 'the queue'}.`
        else text += ('```json\n' + tracks.map((track, i) => `${start + (i+1)} - ${Util.escapeMarkdown(track.title).slice(0, 60)}`).join('\n') + '```')


        const maxPages = Math.ceil(queue.length / multiple)

        text += `\n\nPage ${page > maxPages ? maxPages : page} of ${maxPages}`

        return text
    }
}