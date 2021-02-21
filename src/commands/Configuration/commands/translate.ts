import { IMessage } from '@types'

export default async (message: IMessage): Promise<string> => {
    const isEnabled = message.guild.settings.plugins.translate

    await message.guild.update({
        $set: {
            'plugins.translate': !isEnabled
        }
    })

    return !isEnabled ? 'Auto-translate is **ENABLED**\n__Usage__: https://i.ibb.co/CmKWBML/ezgif-1-46dcc1b24116.gif' : 'Auto-translate is **DISABLED**'
}