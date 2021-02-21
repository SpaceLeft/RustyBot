import { IMessage } from '@types'

export default async (message: IMessage): Promise<string> => {
    const role = message.mentions.roles.filter((r) => r.guild.id == message.guild.id).first()

    if (!role) throw 'Please specify a valid role.'

    const isAdded = !message.guild.settings.roles.mod.includes(role.id)

    await message.guild.update({
        $set: {
            'roles.mod': [...new Set([...message.guild.settings.roles.mod, role.id])]
        }
    })

    return `${isAdded ? 'Added' : 'Removed'} \`${role.name}\`!`
}