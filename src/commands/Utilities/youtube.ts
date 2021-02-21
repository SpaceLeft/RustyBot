import { IMessage } from '@types'
import { URLSearchParams } from 'url'
import fetch from 'node-fetch'
import Command from '../../structures/Command'

const REACTIONS = ['◀️', '⏹️', '▶️', '❌']

export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['yt'],
            help: 'Search on youtube.',
            args: {
                name: 'query',
                type: 'text',
                required: true
            },
            botPermissions: ['EMBED_LINKS', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY']
        })
    }
    async run(message: IMessage, args: string[]): Promise<void> {
        const query = args.join(' ')

        const videos = await this.getVideos(query, message.client.config.google_api)
        const max = videos.length - 1

        let i = 0,
            video = videos[0]

        const msg = await message.channel.send(`Page: 1/${max + 1}\nhttps://www.youtube.com/watch?v=${video.id.videoId}`, {
            replyTo: message
        })

        for (const emoji of REACTIONS) await msg.react(emoji).catch(() => null)

        const filter = (reaction, user) => REACTIONS.includes(reaction.emoji.name) && user.id == message.author.id

        const collector = message.client.utils.createCollector({
            filter,
            time: 60000 * 5,
            async onCollect({
                users,
                emoji
            }) {
                users.remove(message.author).catch(() => null)
                switch (emoji.name) {
                case '◀️':
                    if (i === 0) return
                    i--
                    break
                case '⏹️':
                    collector.stop()
                    return
                case '▶️':
                    if (i === max) return
                    i++
                    break
                case '❌':
                    collector.stop()
                    msg.delete().catch(() => null)
                    return
                }
                video = videos[i]
                if (msg.editable) msg.edit(`Page: ${i + 1}/${max + 1}\nhttps://www.youtube.com/watch?v=${video.id.videoId}`).catch(() => null)
            },
            onEnd: () => msg.reactions.removeAll().catch(() => null)
        }, msg)
    }
    async getVideos(query: string, api_key: string): Promise<any[]> {

        const params = new URLSearchParams()

        Object.entries({
            key: api_key,
            maxResults: 25,
            q: query,
            part: 'snippet',
            type: 'video'
        }).forEach(([key, value]) => {
            params.append(key, value.toString())
        })

        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`)

        if (res.status == 200) {
            const data = await res.json()
            if (!data?.items[0]) throw 'Not found...'
            return data.items
        }

        throw 'The api returned an invalid response, try again later'
    }
}