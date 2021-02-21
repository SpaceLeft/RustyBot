import { IMessage } from '@types'
import Command from '../../structures/Command'

const IMAGES = [
    'https://tenor.com/view/side-eye-peeking-in-looking-around-searching-gif-12255493',
    'https://tenor.com/view/angry-black-snake-moan-samuel-l-jackson-look-blood-boils-gif-5633328',
    'https://tenor.com/view/blank-stare-justin-timberlake-meh-gif-5436831',
    'https://tenor.com/view/friday-ice-cube-wtf-what-the-fuck-confused-gif-4180958'
]

export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['18', '+18'],
            botPermissions: ['EMBED_LINKS']
        })
    }
    run(message: IMessage): void {
        message.reply('This is *`7`ram* ._.\n' + IMAGES[Math.floor(Math.random() * IMAGES.length)])
    }
}
