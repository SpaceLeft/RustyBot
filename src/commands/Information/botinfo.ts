import Command from '../../structures/Command'
import * as os from 'os'
import { IMessage } from '@types'
import  moment from 'moment'
require('moment-duration-format')


export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['info', 'bot'],
            help: 'Displays information about the bot.'
        })
    }
    async run(message: IMessage): Promise<string> {
        const client = message.client

        let text = ''

        const {
            usage,
            total,
            free
        } = this.getMemoryStatus()

        text += '`[About]`\n' +
            '```css\n' + 'I\'m a bot' + '```\n'

        text += '`[General]`\n' +
            '```md\n' + `* Commands: ${client.commands.size}\n* Servers: ${client.guilds.cache.size.toLocaleString('en')}\n* Users: ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString('en')}` + '```\n'

        text += '`[Memory]`\n' +
            '```diff\n' + `+ Total: ${total}\n- Used: ${usage}\n+ Free: ${free}` + '```\n'

        text += '`[Uptime]`\n' +
            '```\n' + moment.duration(client.uptime).format('M [months], W [weeks], D [days], H [hrs], m [mins], s [secs]') + '```'

        return `Here some info about **${client.user.username}**\n\n` + text
    }
    getMemoryStatus(): {
        usage: string;
        total: string;
        free: string;
        } {
        const usage = process.memoryUsage().heapUsed / 1048576,
            total = os.totalmem() / 1048576,
            free = total - usage

        return {
            usage: toMemoryString(usage),
            total: toMemoryString(total),
            free: toMemoryString(free)
        }
    }
}

function toMemoryString(b: number): string {
    if (b >= 1024) return (b / 1024).toFixed(2) + 'GB'
    return b.toFixed(2) + 'MB'
}