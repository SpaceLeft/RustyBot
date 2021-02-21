import { IMessage } from '@types'

export default async (message: IMessage, args: string[]): Promise<string> => {

    const channels = message.mentions.channels.filter((c) => c.type === 'text' && c.guild.id === message.guild.id).map(c => c.id)
    const roles = message.mentions.roles.filter((r) => r.guild.id == message.guild.id).map(r => r.id)
    const commands = message.client.commands.filter((cmd) => args.some(a => a.toLowerCase() == cmd.name)).map(cmd => cmd.name)


    const isEmpty = channels.length <= 0 && roles.length <= 0 && commands.length <= 0


    if (isEmpty) throw 'Please specify a valid (channel/command/role)!'


    const obj = {
        channels: filterArray('channels', message.guild.settings.ignored, {
            channels
        }),
        roles: filterArray('roles', message.guild.settings.ignored, {
            roles
        }),
        commands: filterArray('commands', message.guild.settings.ignored, {
            commands
        }),
    }

    await message.guild.update({
        ignored: obj
    })

    const a = [...obj.channels.map(c => `<#${c}>`), ...obj.roles.map(r => `<@&${r}>`), ...obj.commands.map(c => `\`${c}\``)]
    const b = [...message.guild.settings.ignored.channels.map(c => `<#${c}>`), ...message.guild.settings.ignored.roles.map(r => `<@&${r}>`), ...message.guild.settings.ignored.commands.map(c => `\`${c}\``)]
    const added = a.filter(x => !b.includes(x))
    const removed = b.filter(x => !a.includes(x))

    let text = ''

    if (added.length > 0) text += '**Added: **\n' + added.map(x => `\`+\` ${x}`).join('\n') + '\n\n'
    if (removed.length > 0) text += '**Removed: **\n' + removed.map(x => `\`-\` ${x}`).join('\n') + '\n'

    text += '\n'

    text += `Do: \`${message.prefix}config\` to view the full menu!`

    return text
}


function filterArray(key: string, a, b): string[] {
    let newList = [...new Set([...a[key], ...b[key]])]
    a[key]
        .filter((x) => b[key].includes(x))
        .forEach((x) => newList = newList.filter((key) => key !== x))
    return newList
}