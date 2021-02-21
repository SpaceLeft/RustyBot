import Command from '../../structures/Command'
import { IMessage } from '@types'
import { inspect } from 'util'

export default class extends Command {
    constructor() {
        super(__filename, {
            ownerOnly: true
        })
    }
    async run(message: IMessage, args: string[]): Promise<void> {
        const code = args.join(' ')
        const result = new Promise(resolve => resolve(eval(code)))
        result.then(output => {
            if (typeof output !== 'string') output = inspect(output, {
                depth: 0
            })
            message.say(output, {
                code: 'js',
                split: true
            })
        }).catch(err => {
            err = err.toString().replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
            message.say(err, {
                code: 'fix',
                split: true
            })
        })
    }
}