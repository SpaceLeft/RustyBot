/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message, Channel, ReactionCollector, MessageCollector } from 'discord.js'
import { join } from 'path'
import { readdirSync, statSync } from 'fs'
import fetch from 'node-fetch'

interface CollectorOption {
	time: number;
	idle?: number;
	filter(...args: any[]): boolean;
	onCollect(...args: any[]): Promise<any> | any;
	onEnd?(...args: any[]): Promise<any> | any;
}

export default {
    createCollector({
        time = 60000,
        idle,
        filter = () => true,
        onCollect,
        onEnd
    }: CollectorOption, messageOrChannel: Message | Channel): ReactionCollector | MessageCollector {

        if (!(messageOrChannel instanceof Message || messageOrChannel instanceof Channel)) throw new TypeError('Must be message or channel')

        const mode = messageOrChannel instanceof Message ? 'createReactionCollector' : 'createMessageCollector'

        const collector = messageOrChannel[mode](filter, {
            time,
            idle
        })

        collector.on('collect', onCollect)

        if (onEnd && typeof onEnd === 'function') {
            collector.on('end', onEnd)
        }

        return collector
    },
    readdir(...directory: string[]): string[] {
        const result = [];
        (function read(dir) {
            const files = readdirSync(dir)
            for (const file of files) {
                const filepath = join(dir, file)
                if (statSync(filepath).isDirectory()) read(filepath)
                else result.push(filepath)
            }
        }(join(...directory)))
        return result
    },
    capitalize(string: string): string {
        return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ')
    },
    formatMissing(array: string[], index: number, command = ''): string {
        const body = `${command} ` + array.map(item => `<${item}>`).join(' ') + '\n' + ' '.repeat(command.length + 1) + array.map((item, i) => (i == index ? '^' : ' ').repeat(item.length + 2)).join(' ')
        return '```fix\n' + `${body}\n${array[index]} is a required argument that is missing.` + '```'
    },
    trimArray(arr: any[], maxLen = 10): any[] {
        if (arr.length >= maxLen) {
            const len = arr.length - maxLen
            arr = arr.slice(0, maxLen)
            arr.push(len + ' more...')
        }
        return arr
    },
    chunkArray(arr: any[], size: number): any[] {
        const array = [...arr]
        return [...Array(Math.ceil(array.length / size))].map(() => array.splice(0, size))
    },
    arraysEqual(array1: any[], array2: any[]): boolean {
        return JSON.stringify(array1) === JSON.stringify(array2)
    },
    sendHook({
        token,
        id
    }: {
		token: string,
		id: string
	}, body: string): Promise<any> {
        return fetch(`https://discord.com/api/webhooks/${id}/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })
    }
}