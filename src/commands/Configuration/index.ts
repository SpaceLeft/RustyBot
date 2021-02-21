import Command from '../../structures/Command'
import { GuildChannel, MessageEmbed, Util } from 'discord.js'

import prefix from './commands/prefix'
import ignore from './commands/ignore'
import translate from './commands/translate'
import log from './commands/log'
import mod from './commands/mod'
import modLog from './commands/modlog'
import { IMessage } from '@types'


export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['settings'],
            help: {
                content: 'Show/edit guild settings.',
                examples: [
                    'prefix !',
                    'ignore #channel',
                    'translate',
                    'log #channel'
                ],
                fields: [{
                    name: 'prefix [prefix]',
                    value: 'Set the server prefix!'
                }, {
                    name: 'mod <role>',
                    value: 'Add/delete roles to be a mod!'
                }, {
                    name: 'ignore <channel|command|role>...',
                    value: 'Ignore any (role, command, channel) for using the bot!!'
                }, {
                    name: 'auto-translate',
                    value: 'Toggle auto-translate in the server.'
                }, {
                    name: 'log <channel>',
                    value: 'Toggle logging in the server'
                }, {
                    name: 'modlog <channel>',
                    value: 'Sets channel to log moderation actions'
                }],
            },
            userPermissions: ['ADMINISTRATOR'],
            botPermissions: ['MANAGE_CHANNELS', 'EMBED_LINKS']
        })
        this.name = 'config'
    }
    async run(message: IMessage, args: string[]): Promise<string|void|MessageEmbed> {
        if (!args[0]) {

            const m = await message.say('Fetching...')

            await message.client.wait(250)

            let text = '```diff\n- Server Settings```\n'

            const {
                plugins,
                ignored,
                log,
                roles,
                channels
            } = message.guild.settings

            const log_channel = log.enabled ? (
                (message.client.channels.cache.get(log.channel) as GuildChannel)?.name || 'Unknown'
            ) : 'Disabled'

            const modlog_channel = channels.mod ? (
                (message.client.channels.cache.get(channels.mod) as GuildChannel)?.name || 'Unknown'
            ) : 'Disabled'


            const info = {
                prefix: Util.escapeMarkdown(message.prefix),
                log_channel,
                modlog_channel,
                translate: plugins.translate,
                ignored_IDs: ignored,
                mod_roles: roles.mod
            }

            text += '```json\n' + JSON.stringify(info, null, '\t') + '```\n'

            text += `Do: \`${message.prefix}help config\` for more info.`

            m.edit(text)
            return
        }

        switch (args.shift().toLowerCase()) {
        case 'prefix':
        case 'set-prefix':
        case 'setprefix':
            return await prefix(message, args)
        case 'ignore':
        case 'disable':
        case 'enable':
            return await ignore(message, args)
        case 'translate':
        case 'auto-translate':
            return await translate(message)
        case 'log':
        case 'logs':
        case 'logging':
        case 'set-log':
        case 'set-logging':
            return await log(message, args)
        case 'mod':
        case 'modrole':
        case 'mod-role':
        case 'set-mod':
        case 'set-modrole':
            return await mod(message)
        case 'set-modlog':
        case 'modlog':
        case 'mod-log':
        case 'mod-logging':
            return await modLog(message, args)
        default:
            return `Command not found!\nRun: \`${message.prefix}help config\` for more info..`
        }
    }
}