import { IMessage } from '@types'

export default async (message: IMessage, args: string[]): Promise<string> => {

    if (!args[0]) return `My prefix on this guild is: \`${message.prefix}\``

    const prefix = args[0]

    if (prefix.length > 5) throw 'The prefix shouldn\'t exceed 5 characters!'

    await message.guild.update({
        prefix: prefix
    })

    return `OK, it's changed to: \`${prefix}\``
}