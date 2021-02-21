import moment from 'moment'
import 'moment-duration-format'


export default class {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async run(member): Promise<void> {
        if (!member.guild) return
        if (!member.guild.hasLog()) return

        const embed = {
            title: 'Member left',
            author: {
                name: member.user.tag,
                icon_url: member.user.displayAvatarURL({
                    dynamic: true
                })
            },
            color: 0xe74c3c,
            description: `${member}\nJoined: ${moment.duration(Date.now() - member.joinedTimestamp).format('M [months], W [weeks], D [days], H [hrs], m [mins], s [secs]')}`,
            fields: [],
            timestamp: new Date(),
            footer: {
                text: `ID: ${member.id}`
            }
        }


        if (member.roles.cache.size > 1) {
            embed.fields.push({
                name: 'Roles: ',
                value: member.client.utils.trimArray(member.roles.cache
                    .sort((a, b) => b.position - a.position)
                    .map(role => role.toString())
                    .slice(0, -1)).join(', ')
            })
        }

        await member.guild.log(embed)
    }
}