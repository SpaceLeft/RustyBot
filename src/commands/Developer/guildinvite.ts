import { IMessage } from '@types'
import { Guild, Invite } from 'discord.js'
import Command from '../../structures/Command'


export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['gi'],
            ownerOnly: true
        })
    }
    async run(message: IMessage, args: string[]): Promise<void> {
        if (!args[0]) throw 'Give me a id/name of that guild.'

        const guild = this.getGuild(message, args.join(' '))

        if (!guild) throw 'Guild not found'

        const msg = await message.say('Creating invite...')

        const invite = await this.createGuildInvite(guild)

        msg.edit(invite?.toString() ?? 'Couldn\'t create an invite!')
    }
    async createGuildInvite(guild: Guild): Promise<Invite|null> {
        try {
            const channels = guild.channels.cache.filter((c) => c.type == 'text' && c.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'))

            const channel = channels.find((c) => ['welcome', 'general', 'chat'].some(n => c.name.toLowerCase().includes(n))) || channels.first()

            const invites = await channel.fetchInvites().catch(() => null)

            if (invites && invites.size) {
                return invites.first()
            } else {
                const invite = await channel.createInvite()
                return invite
            }
        } catch {
            return null
        }
    }
    getGuild(msg: IMessage, val: string): Guild | null {
        const guild = msg.client.guilds.cache.find((g) => g.id == val || g.name == val || g.name.replace(/\W+/g, '').toLowerCase() == val.replace(/\W+/g, '').toLowerCase())
        return guild
    }
}