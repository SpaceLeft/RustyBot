import Client from './Client'
import { Manager } from 'erela.js'
import { TextChannel } from 'discord.js'
import Spotify from 'erela.js-spotify'


class Music extends Manager {
    constructor(client: Client) {
        super({
            plugins: [
                new Spotify(client.config.spotify)
            ],
            autoPlay: true,
            nodes: client.config.nodes,
            send: (id, payload) => {
                const guild = client.guilds.cache.get(id)
                if (guild && guild.available) guild.shard.send(payload)
            }
        })
    }
    load(client: Client): void {
        super.init(client.user.id)
        this
            .on('nodeError', (_, error) => {
                client.logger.error(error)
            })
            .on('trackStart', (player, track) => {
                const channel = client.channels.cache.get(player.textChannel)
                if (channel) (channel as TextChannel).send(`Now playing: \`${track.title}\``).catch(() => null)
            })
            .on('queueEnd', (player) => {
                const channel = client.channels.cache.get(player.textChannel)
                if (channel) (channel as TextChannel).send('Queue has ended.').catch(() => null)
                player.destroy()
            })
    }
}

export default Music