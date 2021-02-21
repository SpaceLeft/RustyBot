import { IGuild } from '@types'
import Client from '../structures/Client'

export default (client: Client): void => {
    client.setInterval((): void => {
        client.cache.mutes.filter(m => Date.now() >= m.time).each(async (mute) => {
            const guild = client.guilds.cache.has(mute.guild_id) ? (client.guilds.cache.get(mute.guild_id) as IGuild) : null

            if (!guild || !guild.available) {
                client.cache.mutes.delete(mute.ID)
                return
            }

            const data = client.cache.guilds.find(s => s.mutes.some(m => m.ID == mute.ID))

            if (data) {
                await guild.update({
                    mutes: data.mutes.filter(m => m.ID !== mute.ID)
                })
                client.cache.mutes.delete(mute.ID)
            }

            const m = guild.members.cache.get(mute.user_id) || await guild.members.fetch(mute.user_id).catch(() => null)

            if (m && m.roles.cache.has(mute.role_id)) await m.roles.remove(mute.role_id, 'Temporary Mute Completed').catch(() => null)

        })
    }, 15000)
}