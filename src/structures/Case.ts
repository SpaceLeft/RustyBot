import { ICase, IGuild } from '@types'
import { Util, Client, GuildChannel, TextChannel } from 'discord.js'

interface User {
	id: string
	tag: string
	avatar?: string
}

class Case {

	public client: Client
	public type?: string
	public user?: User
	public moderator?: User
	public reason?: string
	public case: number
	public timestamp: number

	constructor(public guild: IGuild) {
	    this.client = guild.client
	}

	setType(type: string): this {
	    this.type = type
	    return this
	}
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	setUser(id: string, tag: string): this {
	    this.user = {
	        id,
	        tag
	    }
	    return this
	}
	setModerator({
	    id,
	    tag,
	    avatar
	}: {
		id: string,
		tag: string,
		avatar?: string
	}): this {
	    this.moderator = {
	        id: id,
	        tag: tag,
	        avatar: avatar
	    }
	    return this
	}

	setReason(reason: string | string[]): this {
	    if (Array.isArray(reason)) reason = reason.join(' ')
	    this.reason = Util.escapeMarkdown(reason)
	    return this
	}
	setCase(_case: number): this {
	    this.case = _case
	    return this
	}
	async send(): Promise<void> {

	    const channel: GuildChannel | null = this.guild.channels.cache.get(this.guild.settings.channels.mod) ?? await this.client.channels.fetch(this.guild.settings.channels.mod).catch(() => null)

	    if (!channel) {
	        await this.guild.update({
	            $set: {
	                'channels.mod': null
	            }
	        })
	        return
	    }

	    if (!this.case) {
	        this.case = this.guild.settings.cases.length + 1
	        await this.guild.update({
	            $push: {
	                cases: this.toJSON()
	            }
	        })
	    }

	    this.timestamp = Date.now()

	    if (channel.permissionsFor(channel.guild.me)?.has(['SEND_MESSAGES', 'VIEW_CHANNEL'])) {

	        const {
	            time,
	            emoji,
	            moderator,
	            user,
	            reason,
	            type
	        } = this.format();

	        (channel as TextChannel).send(
	            `\`[${time}]\` \`[${this.case}]\` ${emoji}` +
				` **${moderator}** ${type} **${user}** (ID: \`${this.user.id}\`)\n` +
				`\`[Reason]\` ${reason}`
	        ).catch(() => null)
	    }
	}
	format(): {
		time: string;
		emoji: string;
		moderator: string;
		user: string;
		reason: string;
		type: string;
	 } {
	    return {
	        time: new Date(this.timestamp).toISOString().substr(11, 8),
	        emoji: Case.emoji(this.type),
	        moderator: Util.escapeMarkdown(this.moderator.tag),
	        user: Util.escapeMarkdown(this.user.tag),
	        reason: this.reason,
	        type: this.type
	    }
	}
	toJSON(): ICase {
	    return {
	        type: this.type,
	        user: this.user.id,
	        moderator: this.moderator.id,
	        reason: this.reason,
	        case: this.case,
	        timestamp: this.timestamp
	    }
	}
	static emoji(type: string): string {
	    switch (type) {
	    case 'banned':
	        return '🔨'
	    case 'unbanned':
	        return '🔧'
	    case 'muted':
	    case 'tempmuted':
	        return '🤐'
	    case 'unmuted':
	        return '🔊'
	    case 'warned':
	        return '🚩'
	    case 'kicked':
	        return '👢'
	    default:
	        return ' '
	    }
	}
}

export default Case