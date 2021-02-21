import Command from '../../structures/Command'


import add from './commands/add'
import fix from './commands/fix'
import type from './commands/type'
import make from './commands/make'
import list from './commands/list'
import purge from './commands/purge'

import { IMessage } from '@types'
import { MessageEmbed } from 'discord.js'


export default class extends Command {
    constructor() {
        super(__filename, {
            aliases: ['rr', 'reaction'],
            help: {
                content: 'Reaction based roles is an intuitive way to offer your members the ability to add and remove roles to themselves.',
                fields: [{
                    name: 'add [channel] <msg_id> <emoji> <role>',
                    value: 'Adds a single emoji-role pair to a message through its ID. This is really only'
                }, {
                    name: 'make',
                    value: 'Interactive setup to add reaction roles (This is most likely the command you want to use if you\'re getting started with reaction roles)'
                }, {
                    name: 'unique <msg>',
                    value: 'Marks a message as \'unique\' meaning a member can only claim one role from this message at a time, this works per message. Automatically removes the old reactions for you'
                }, {
                    name: 'verify <msg>',
                    value: 'Marks a message as \'verify\' making it so that you can only pick up roles.'
                }, {
                    name: 'fix <msg>',
                    value: 'Accidentally (or intentionally) cleared all reactions? use this command to have the bot add the reactions missing'
                }, {
                    name: 'normal <msg>',
                    value: 'Marks a message as normal removing any weird special cases.'
                }, {
                    name: 'list',
                    value: 'Shows the emoji-role pairs and their associated message id'
                }, {
                    name: 'purge [id]',
                    value: 'Clears all reaction roles in the server or from a message if one is supplied.'
                }]
            },
            userPermissions: ['MANAGE_ROLES'],
            botPermissions: ['READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'MANAGE_MESSAGES', 'ADD_REACTIONS']
        })
        this.name = 'reactrole'
        this.category = 'Other'
    }
    async run(message: IMessage, args: string[]): Promise<void|string|MessageEmbed> {
        if (!args[0]) return await message.client.commands.get('help').run(message, ['rr'])

        switch (args.shift().toLowerCase()) {
        case 'add':
        case 'create':
            return await add(message, args)
        case 'make':
        case 'setup':
            return await make(message)
        case 'unique':
            return await type(message, args, 'unique')
        case 'verify':
            return await type(message, args, 'verify')
        case 'fix':
            return await fix(message, args)
        case 'normal':
            return await type(message, args, 'normal')
        case 'list':
            return await list(message)
        case 'purge':
        case 'clear':
            return await purge(message, args)
        default:
            return await message.client.commands.get('help').run(message, ['rr'])
        }
    }
}