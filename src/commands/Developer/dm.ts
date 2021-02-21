import { Message } from 'discord.js'
import Command from '../../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            ownerOnly: true
        })
    }
    async run(message: Message, args: string[]): Promise<void> {
        const user = await message.client.users.fetch(args[0]).catch(() => null)

        if (!user) throw 'I can\'t dm him :/'

        user.dm(args.slice(1).join(' ') || 'Nothing')
            .then(() => message.react('✅'))
            .catch(() => message.react('❌'))
    }
}