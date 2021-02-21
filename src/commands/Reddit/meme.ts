import { IMessage } from '@types'
import { MessageEmbed } from 'discord.js'
import Command from '../../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['memes'],
            help: 'Quickly sends a meme from r/meme',
            botPermissions: ['EMBED_LINKS'],
            typing: true
        })
    }
    async run(message: IMessage): Promise<string|MessageEmbed> {
        const post = await message.client.reddit.search('meme')
        return post?.toEmbed() || 'Try again...'
    }
}