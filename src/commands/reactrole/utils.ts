import { IMessage } from '@types'
import { Client, Message, TextChannel } from 'discord.js'
import emojiREGEX from 'emoji-regex'

const COLORS = {
    DEFAULT: 0x000000,
    WHITE: 0xffffff,
    AQUA: 0x1abc9c,
    GREEN: 0x2ecc71,
    BLUE: 0x3498db,
    YELLOW: 0xffff00,
    PURPLE: 0x9b59b6,
    LUMINOUS_VIVID_PINK: 0xe91e63,
    GOLD: 0xf1c40f,
    ORANGE: 0xe67e22,
    RED: 0xe74c3c,
    GREY: 0x95a5a6,
    NAVY: 0x34495e,
    DARK_AQUA: 0x11806a,
    DARK_GREEN: 0x1f8b4c,
    DARK_BLUE: 0x206694,
    DARK_PURPLE: 0x71368a,
    DARK_VIVID_PINK: 0xad1457,
    DARK_GOLD: 0xc27c0e,
    DARK_ORANGE: 0xa84300,
    DARK_RED: 0x992d22,
    DARK_GREY: 0x979c9f,
    DARKER_GREY: 0x7f8c8d,
    LIGHT_GREY: 0xbcc0c0,
    DARK_NAVY: 0x2c3e50,
    BLURPLE: 0x7289da,
    GREYPLE: 0x99aab5,
    DARK_BUT_NOT_BLACK: 0x2c2f33,
    NOT_QUITE_BLACK: 0x23272a,
}


async function ask(message: IMessage, text: string, time = 60000): Promise<string | null> {
    message.say(text)

    try {
        const collected = await message.channel.awaitMessages((m) => m.author.id == message.author.id, {
            time: time,
            max: 1,
            errors: ['time']
        })

        if (!collected || !collected.first()) throw 'You took too long, bye!'

        return collected.first().content
    } catch {
        throw 'You took too long, bye!'
    }
}

async function fetchMessage(client: Client, messageID: string, channelID: string): Promise<Message | null> {
    try {
        const channel = await client.channels.fetch(channelID)
        const message = await (channel as TextChannel).messages.fetch(messageID)
        return message
    } catch {
        return null
    }
}


function parseColor(input: string): number {
    if (!input || input === 'DEFAULT') return 0
    if (input === 'RANDOM') return Math.floor(Math.random() * (0xffffff + 1))

    const color = COLORS[input.toUpperCase()] || parseInt(input.replace('#', ''), 16)

    if (isNaN(color)) throw 'That is not a valid hex code.'

    return color
}

function parseEmoji(text: string | null): {
    animated: boolean;
    name: string;
    id: string;
    review: string;
} {
    if (typeof text !== 'string' || !text.trim()) return null
    if (emojiREGEX().test(text)) return {
        animated: false,
        name: text.match(emojiREGEX())[0],
        id: null,
        review: text
    }
    if (text.includes('%')) text = decodeURIComponent(text)
    if (!text.includes(':')) return null
    const m = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/)
    if (!m) return null
    return {
        animated: Boolean(m[1]),
        name: m[2],
        id: m[3] || null,
        review: text
    }
}

function splitOnce(str: string, char: string): string[] {
    const [first, ...rest] = str.split(char)
    return [first, rest.length > 0 ? rest.join(char) : null]
}

export {
    ask,
    fetchMessage,
    parseColor,
    parseEmoji,
    splitOnce
}