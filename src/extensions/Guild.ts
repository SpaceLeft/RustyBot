import {
    MessageEmbed,
    Structures
} from 'discord.js'

import Client from '../structures/Client'
import utils from '../helpers/utils'
import { IGuildSettings } from '@types'


Structures.extend('Guild', G => {
    class Guild extends G {
        public settings: IGuildSettings;
        
        getPlayer() {
            return (this.client as Client).music.get(this.id)
        }

        async fetchSettings() {
            const client = this.client as Client
            const cache = client.cache

            let data

            data = cache.guilds.get(this.id)

            if (!data) {
                data = await client.db.guild.findOne({
                    id: this.id,
                })

                if (!data) {
                    data = new client.db.guild({
                        id: this.id,
                    })
                    await data.save()
                }

                cache.guilds.set(this.id, data)
            }

            this.settings = (data as IGuildSettings)

            return this.settings
        }

        async update(query): Promise<IGuildSettings> {
            await this.fetchSettings()
            const newObj = await (this.client as Client).db.guild.findOneAndUpdate({
                id: this.id
            }, query, {
                new: true
            })
            this.settings = (newObj as IGuildSettings);
            (this.client as Client).cache.guilds.set(this.id, newObj as IGuildSettings)
            return (newObj as IGuildSettings)
        }

        hasLog(): boolean {
            return (this.client as Client).cache.logs.has(this.id)
        }

        async log(embed: MessageEmbed) {
            const hook = (this.client as Client).cache.logs.get(this.id)
            const body = {
                embeds: [embed],
                username: this.client.user.username,
                avatar_url: this.client.user.avatarURL(),
            }

            if (Object.values(hook).some(value => !value)) return

            const response = await utils.sendHook(hook, JSON.stringify(body))

            if ([200, 204].includes(response.status)) return

            try {
                const json = await response.json()
                if (response.status == 429 && json.retry_after) setTimeout(() => utils.sendHook(hook, JSON.stringify(body)).catch(() => null), json.retry_after)
                else if (json.code == 10015) await this.update({
                    $set: {
                        'log.enabled': false
                    }
                })
            } catch (e) {
                console.error(e)
            }
        }
        isCached(): boolean {
            return Boolean(this.settings)
        }
    }
    return Guild
})