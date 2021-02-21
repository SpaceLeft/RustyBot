import { IMessage } from '@types'

export default async (message: IMessage, args: string[]): Promise<void | string> => {
    const data = message.guild.settings.reactions_roles

    if (args[0]) {
        const toDelete = data.filter(r => r.message_id == args[0])

        if (!toDelete || toDelete.length <= 0) throw 'That message does not have any registered reaction roles.'

        await message.guild.update({
            reactions_roles: data.filter(r => r.message_id !== args[0])
        })

        return `${toDelete.length} reaction roles removed from that message.`
    }

    const m = await message.say('This will remove ALL reaction roles, are you sure?')

    await m.react('✅')
    await m.react('❌')


    const filter = (reaction, user) => user.id === message.author.id && ['✅', '❌'].includes(reaction.emoji.name)

    m.awaitReactions(filter, {
        max: 1,
        time: 30000,
        errors: ['time']
    }).then(async collected => {
        m.reactions.removeAll().catch(() => null)

        const emoji = collected.first().emoji.name

        if (emoji == '❌' && m.editable) return m.edit('Your reaction roles are where you left them')

        message.say(`${[...new Set(data.map((r) => r.message_id))].length} reaction roles removed`)

        await message.guild.update({
            reactions_roles: []
        })
    }).catch(() => message.say('You took too long.'))
}