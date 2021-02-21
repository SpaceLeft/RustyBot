import { IMessage } from '@types'
import tinyColor from 'tinycolor2'
import Command from '../../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['hex'],
            help: 'Get color info',
            args: {
                name: 'color'
            },
            botPermissions: ['ATTACH_FILES']
        })
    }
    run(message: IMessage, args: string[]): void {
        const color = tinyColor(args.join(' ') || ('#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')))

        if (!color.isValid()) throw 'Not a valid color.'

        const hex = color.toHexString(),
            rgb = color.toRgbString(),
            name = color.toName()

        message.say(`Name: \`${name || 'Unknown'}\`\nHEX: \`${hex}\` | RGB: \`${rgb}\``, {
            files: [{
                name: 'color.png',
                attachment: `https://singlecolorimage.com/get/${hex.slice(1)}/400x400`
            }]
        })
    }
}