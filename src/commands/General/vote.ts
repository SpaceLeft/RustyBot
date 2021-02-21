import { IMessage } from '@types'
import Command from '../../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['voting'],
            help: 'Get a link to vote on Top.gg.'
        })
    }
    run(message: IMessage): string {
        return `https://top.gg/bot/${message.client.user.id}`
    }
}