import { IMessage } from '@types'
import { GuildChannel } from 'discord.js'
import { fetchMessage, parseEmoji } from '../utils'

const ARGS = ['channel', 'message_id', 'emoji', 'role']

export default async (message: IMessage, args: string[]): Promise<string> => {
    const formatMissing = message.client.utils.formatMissing
    const command = `${message.prefix}rr add`

    if (!args[0]) return formatMissing(ARGS, 1, command)

    args = args.filter(a => /^<#(\d{17,19})>$/.test(a) ? null : a).filter(value => value)


    const channelMentioned = message.mentions.channels.filter(c => c.guild.id == message.guild.id).first()

    const msg = await fetchMessage(message.client, args[0], channelMentioned ? channelMentioned.id : message.channel.id)

    if (!msg) throw `"\`${args[0]}\`" is not a valid message ID. Use Developer Mode to get the Copy ID option.`

    if (!(msg.channel as GuildChannel).permissionsFor(message.guild.me)?.has('MANAGE_MESSAGES')) return `I'm missing the permissions to react in ${msg.channel}!`

    if (!args[1]) return formatMissing(ARGS, 2, command)


    const emoji = parseEmoji(args[1])

    if (!emoji) throw 'That does not seem to be an emoji.'

    if (!args[2]) return formatMissing(ARGS, 3, command)

    const role = message.guild.roles.cache.find(r => {
        if (r.id === args[2]) return true
        if (r.name.toLowerCase() === args[2].toLowerCase()) return true
        if (/<@&(\d{17,19})>/.test(args[2]) && r.id == args[2].match(/<@&(\d{17,19})>/)[1]) return true
        return false
    })


    if (!role) throw `I couldn't find a role with the name \`${args[2]}\`.`

    if (role.managed) throw `The role \`${role.name}\` is managed and cannot be assigned.`

    try {
        await msg.react(emoji.id || emoji.name)
        await message.guild.update({
            $push: {
                reactions_roles: {
                    reaction: emoji.id || emoji.name,
                    reaction_review: emoji.review,
                    guild_id: message.guild.id,
                    message_id: msg.id,
                    channel_id: msg.channel.id,
                    role_id: role.id,
                    type: 'normal'
                }
            }
        })
        return `Added ${emoji.review} with the role \`${role.name}\`.`
    } catch {
        return 'Something bad happened :/'
    }
}