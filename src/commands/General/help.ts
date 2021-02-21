import { ICommandHelp, IMessage } from '@types'
import Command from '../../structures/Command'

const REACTIONS = ['⏮️', '◀️', '▶️', '⏭️', '❌']

export default class extends Command {
    constructor() {
        super(__filename, {
            help: 'Show help menu!',
            args: {
                name: 'command'
            },
            botPermissions: ['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']
        })
    }
    async run(message: IMessage, args: string[]): Promise<string|void> {
        if (!args[0]) return this.generateHelp(message)

        const commandName = args[0].toLowerCase()

        const command = message.client.commands.get(commandName) || message.client.commands.get(message.client.aliases.get(commandName))

        if (!command) throw 'Command not found'

        await this.generateHelpCommand(message, args, command)
    }
    generateHelp(message: IMessage): string {
        const permissions = message.member.permissions.toArray().map(p => p.toString())
        const prefix = message.prefix

        let text = ''

        for (const category of new Set(message.client.commands.map(c => c.category))) {

            const commands = message.client.commands
                .filter(c => c.category === category && !c.hide)
                .filter(c => !c.ownerOnly || !c.userPermissions.every(p => permissions.includes(p)))

            if (commands.size >= 1) {
                text += '**' + category + ':**\n'
                text += '```fix\n'
                text += commands.map(cmd => cmd.name).join(', ') + '```\n\n'
            }
        }
        return text + `\nTo view details for a command, do \`${prefix}help <command>\``
    }
    async generateHelpCommand(message: IMessage, args: string[], {
        name,
        aliases,
        help
    }: {
        name: string;
        aliases: string[];
        help: ICommandHelp
    }): Promise<void> {
        const client = message.client
        const prefix = message.prefix


        const {
            examples,
            fields,
            content,
            usage
        } = help

        let text = ''


        if (args[1] && fields.map(f => f.name.split(' ')[0].toLowerCase()).includes(args[1].toLowerCase())) {

            const field = fields.find(f => f.name.split(' ')[0].toLowerCase() == args[1].toLowerCase())

            message.say(`\`${prefix}${name} ${field.name}\`\n` + '```diff\n- ' + field.value + '```')

        } else if (fields.length >= 1) {

            const pages = client.utils.chunkArray(fields, 4),
                max = pages.length - 1

            let i = 0

            text += `Page 1/${pages.length} (${fields.length} commands)\n\n`

            text += 'Description:\n```fix\n' + content + '```'

            text += '\n\n'

            pages[i].forEach(field => {
                text += `\`${prefix}${name} ${field.name}\``
                text += '\n'
                text += '```diff\n- ' + field.value + '```'
                text += '\n'
            })

            text += `\nUse: \`${prefix}help <command>\` for more info on a command.`

            const msg = await message.say(text)

            for (const emoji of REACTIONS) await msg.react(emoji).catch(() => null)

            const filter = (reaction, user) => REACTIONS.includes(reaction.emoji.name) && user.id === message.author.id

            const collector = client.utils.createCollector({
                filter,
                time: 60000 * 5,
                idle: 60000,
                async onCollect({
                    users,
                    emoji
                }) {
                    users.remove(message.author).catch(() => null)

                    switch (emoji.name) {
                    case '◀️':
                    case '⏮️':
                        if (i === 0) return
                        i--
                        if (emoji.name == '⏮️') i = 0
                        break
                    case '⏭️':
                    case '▶️':
                        if (i === max) return
                        i++
                        if (emoji.name == '⏭️') i = max
                        break
                    case '❌':
                        collector.stop()
                        msg.delete().catch(() => null)
                        break
                    }

                    if (!msg.editable) return

                    text = `Page 1/${pages.length} (${fields.length} commands)\n\n` + 'Description:\n```fix\n' + content + '```\n\n'

                    pages[i].forEach(field => {
                        text += `\`${prefix}${name} ${field.name}\`\n`
                        text += '```diff\n- ' + field.value + '```\n'
                    })

                    text += `\nUse: \`${prefix}help <command>\` for more info on a command.`

                    msg.edit(text).catch(() => null)
                },
                onEnd: () => msg.reactions.removeAll().catch(() => null)
            }, msg)
        } else {

            text += `\`${prefix}${name} ${usage}\`` + '\n\nDescription:\n```fix\n' + content + '```\n\n'

            if (examples.length >= 1) text += 'Examples:\n```diff\n' + examples.map(ex => `- ${prefix}${name} ${ex}`).join('\n') + '```\n\n'

            if (aliases.length >= 1) text += 'Aliases:\n```fix\n' + aliases.map(a => prefix + a).join(', ') + '```'

            message.say(text)
        }
    }
}