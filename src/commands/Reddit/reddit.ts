import { IMessage } from '@types'
import { MessageEmbed } from 'discord.js'
import Command from '../../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            help: 'Send random images from the subreddit you choose',
            botPermissions: ['EMBED_LINKS'],
            args: {
                name: 'subreddit'
            },
            typing: true
        })
    }
    async run(message: IMessage, args: string[]): Promise<string|MessageEmbed> {
        const sub = args[0]?.toLowerCase() || 'random'

        const post = await message.client.reddit.search(sub)

        if (post?.nsfw && !message.channel.nsfw) return 'No NSFW'

        return post?.toEmbed() || 'Not a subreddit'
    }
}