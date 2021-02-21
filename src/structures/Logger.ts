/* eslint-disable @typescript-eslint/no-explicit-any */
import { captureException } from '@sentry/node'
import { WebhookClient } from 'discord.js'
import chalk from 'chalk'

const getTime = () => new Date().toISOString().substr(11, 8)
const log = console.log
const {
    red,
    blue,
    yellow,
    bgYellow,
    bgRed,
    bgBlue
} = chalk.bold

class Logger {
	public hook: WebhookClient
	constructor(hook?: WebhookClient) {
	    this.hook = hook
	}
	sendHook(type: string, message: any[]): void {
	    if (this.hook) this.hook.send(`**${getTime()}** \`[${type.toUpperCase()}]\` \`\`\`css\n${message.join(' ')}\`\`\``).catch(() => null)
	}
	log(...message: any[]): this {
	    log(`${getTime()} ${bgBlue('[LOG]')} ${blue(message.join(' '))}`)
	    this.sendHook('log', message)
	    return this
	}
	error(...message: any[]): this {
	    log(`${getTime()} ${bgRed('[ERROR]')} ${red(message.join(' '))}`)
	    message.forEach((e): any => captureException(typeof e === 'string' ? e : JSON.stringify(e)))
	    this.sendHook('error', message)
	    return this
	}
	warn(...message: any[]): this {
	    log(`${getTime()} ${bgYellow('[WARN]')} ${yellow(message.join(' '))}`)
	    this.sendHook('warn', message)
	    return this
	}
}

export default Logger