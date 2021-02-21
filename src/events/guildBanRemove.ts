import { IGuild } from '@types'
import { MessageEmbed, User } from 'discord.js'
import moment from 'moment'

export default class {
    async run(guild: IGuild, user: User): Promise<void> {
        if (!guild.hasLog()) return

        const embed = new MessageEmbed({
            title: 'Member unbanned',
            author: {
                name: user.tag,
                icon_url: user.displayAvatarURL({ dynamic: true })
            },
            color: 0x2ecc71,
            description: `Created at: ${moment(user.createdTimestamp).fromNow()}`,
            timestamp: new Date(),
            footer: {
                text: `ID: ${user.id}`
            }
        })

        await guild.log(embed)
    }
}