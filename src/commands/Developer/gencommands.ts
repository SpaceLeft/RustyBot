import { IMessage } from '@types'
import Command from '../../structures/Command'

export default class extends Command {
    constructor() {
        super(__filename, {
            ownerOnly: true
        })
    }
    async run(message: IMessage): Promise<void> {
        let commandsList

        commandsList = [...new Set(message.client.commands.map(c => c.category))].map((category) => {
            const commands = message.client.commands.filter(c => c.category === category && !c.ownerOnly)
            if (commands.size >= 1) return `### ${category}\n\n${commands.map((command) => `* **${command.name}:** ${command.help.content}`).join('\n') + '\n'}`
        })

        commandsList = commandsList.filter(value => value)

        const text = `Total commands: ${message.client.commands.filter((a) => !a.ownerOnly).size}.\n\n${commandsList.join('\n')}`

        message.author.send({
            files: [{
                attachment: Buffer.from(text),
                name: 'commandlist.md',
            }]
        })
    }
}