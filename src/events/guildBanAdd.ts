import { IGuild } from '@types'
import { MessageEmbed, User } from 'discord.js'
import moment from 'moment'

export default class {
    async run(guild: IGuild, user: User): Promise<void> {
        if (!guild.hasLog()) return

        const embed = new MessageEmbed({
            title: 'Member banned',
            author: {
                name: user.tag,
                icon_url: user.displayAvatarURL({
                    dynamic: true
                })
            },
            color: 0xe74c3c,
            description: `Created at: ${moment(user.createdTimestamp).fromNow()}`,
            timestamp: new Date(),
            footer: {
                text: `ID: ${user.id}`
            }
        })

        await guild.log(embed)
    }
}