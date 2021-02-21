import { IMessage } from '@types'
import fetch from 'node-fetch'
import Command from '../../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['shorten'],
            help: 'Shortens a URL',
            args: {
                name: 'url',
                required: true
            }
        })
    }
    async run(message: IMessage, args: string[]): Promise<void> {
        try {
            const output = await (await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(args.join(' '))}`)).text()
            message.reply(output)
        } catch {
            throw 'The api returned an invalid response, try again later'
        }
    }
}