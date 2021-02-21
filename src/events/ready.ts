import { IGuild } from '@types'
import fetch from 'node-fetch'
import Client from 'src/structures/Client'
import checkUnmuted from '../helpers/checkUnmuted'


export default class {
    constructor(public client: Client) {}
    async run(): Promise<void> {
        const client = this.client

        client.logger.log('OK!', client.user.tag)
        client.logger.log('MODE: ' + client.config.mode)

        client.music.load(client)


        checkUnmuted(client)

        client.setInterval(() => {
            const newStatus = client.config.status[Math.floor(Math.random() * client.config.status.length)]
            client.user.setActivity(newStatus, {
                type: 'WATCHING'
            })
            this.postStatus(client.config['top.gg'])
        }, 60000 * 5)

        await this.loadCache()
    }
    postStatus(token: string): void {
        fetch('https://top.gg/api/bots/stats', {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                server_count: this.client.guilds.cache.size
            })
        }).then((res) => {
            console.log(`Posted stats to top.gg with status code: ${res.status}`)
        }).catch(e => this.client.logger.error(e))
    }
    async loadCache(): Promise<void> {
        const client = this.client

        for (const guild of client.guilds.cache.array().map(g=> g as IGuild)) {
            await guild.fetchSettings()
            if (guild.settings.log.enabled) client.cache.logs.set(guild.id, guild.settings.log)
            for (const mute of guild.settings.mutes) client.cache.mutes.set(mute.ID, mute)
        }
    }
}