import Command from '../../structures/Command'
import { Util } from 'discord.js'
import { IMessage } from '@types'

export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['np'],
            playing: true,
            help: 'Shows information about current playing track'
        })
    }
    run(message: IMessage): string {

        const player = message.guild.getPlayer()
        let text = ''

        const {
            title,
            duration
        } = player.queue.current

        const end = duration > 6.048e+8 ? '🔴 LIVE' : new Date(duration).toISOString().slice(11, 19)
        const _duration = new Date(player.position).toISOString().slice(11, 19)
        const progress = this.createBar(duration > 6.048e+8 ? player.position : duration, player.position, 15)[0]

        text += '```fix\n' + `${Util.escapeMarkdown(title)}` + '```\n'

        text += `\`${_duration}\` [__${progress}__] \`${end}\``

        return text
    }
    createBar(total: number, current: number, size = 40, line = '▬', slider = '🔘'): Array<string|number> {
        if (current > total) {
            const bar = line.repeat(size + 2)
            const percentage = (current / total) * 100
            return [bar, percentage]
        } else {
            const percentage = current / total
            const progress = Math.round((size * percentage))
            const emptyProgress = size - progress
            const progressText = line.repeat(progress).replace(/.$/, slider)
            const emptyProgressText = line.repeat(emptyProgress)
            const bar = progressText + emptyProgressText
            const calculated = percentage * 100
            return [bar, calculated]
        }
    }
}