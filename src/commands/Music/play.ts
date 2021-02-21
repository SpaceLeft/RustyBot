import Command from '../../structures/Command'
import { Util } from 'discord.js'
import { IMessage } from '@types'



export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['p'],
            help: 'Plays a song',
            args: {
                name: 'query',
                type: 'text',
                required: true
            },
            typing: true,
            inVoiceChannel: true,
            botPermissions: ['CONNECT', 'SPEAK']
        })
    }
    async run(message: IMessage, args: string[]): Promise<string> {

        if (message.client.music.nodes.filter((n) => n.connected).size === 0) throw 'No Node Connected.'

        const client = message.client

        const voiceChannel = message.member.voice.channel
        const query = args.join(' ')

        let results

        try {

            results = await client.music.search(query, message.author)

            if (!results || ['NO_MATCHES', 'LOAD_FAILED'].includes(results.loadType)) throw ':/'

        } catch {
            throw 'I couldn\'t find anything...'
        }

        const player = client.music.create({
            guild: message.guild.id,
            voiceChannel: voiceChannel.id,
            textChannel: message.channel.id,
            selfDeafen: true
        })


        if (player.state === 'DISCONNECTED' && voiceChannel.full) {
            player.destroy()
            throw 'The voice channel is full!'
        }


        if (player.state !== 'CONNECTED') player.connect()


        switch (results.loadType) {
        case 'TRACK_LOADED':
        case 'SEARCH_RESULT':
            player.queue.add(results.tracks[0])
            if (!player.playing && !player.paused && !player.queue.size) player.play()
            return `Added \`${Util.escapeMarkdown(results.tracks[0].title || 'Unknown title')}\` to the queue.`
        case 'PLAYLIST_LOADED':
            player.queue.add(results.tracks)
            if (!player.playing && !player.paused && player.queue.totalSize === results.tracks.length) player.play()
            return `Added playlist \`${Util.escapeMarkdown(results.playlist.name || 'Unknown playlist name')}\` (${results.tracks.length} tracks) to the queue :sparkles:`
        }
    }
}