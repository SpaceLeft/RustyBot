import { IMessage } from '@types'
import Command from '../../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            ownerOnly: true
        })
    }
    async run(message: IMessage, args: string[]): Promise<string> {
        if (message.deletable) await message.delete().catch(() => null)
        return args?.join(' ') ?? 'Nothing'
    }
}