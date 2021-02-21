/* eslint-disable no-mixed-spaces-and-tabs */
import { ICommand, IArgs, ICommandHelp, ICommandOptions, IMessage } from '@types'
import { MessageEmbed, PermissionString } from 'discord.js'

class Command implements ICommand {

	public path: string;
	public name: string;
	public category: string;
	public hide: boolean;
	public aliases: string[];
	public args: IArgs[];
	public inVoiceChannel: boolean;
	public sameVoiceChannel: boolean;
	public playing: boolean;
	public help: ICommandHelp;
	public typing: boolean;
	public ownerOnly: boolean;
	public cooldown: number;
	public userPermissions: PermissionString[];
	public botPermissions: PermissionString[];

	constructor(path: string, {
	    aliases = [],
	    args = [],
	    help = {},
	    ownerOnly = false,
	    userPermissions = ['SEND_MESSAGES'],
	    botPermissions = ['SEND_MESSAGES'],
	    typing = false,
	    cooldown = 4,
	    sameVoiceChannel = false,
	    playing = false,
	    inVoiceChannel = false,
	    hide = false
	}: ICommandOptions) {
	    if (!Array.isArray(args) && typeof args === 'object') args = [args]

	    this.path = path

	    const file = path.split(/[\\/]/)

	    this.name = file.pop().slice(0, -3)
	    this.category = file.pop()
	    this.hide = hide
	    this.aliases = aliases
	    this.cooldown = cooldown * 1000
	    this.args = args.map((arg) => Object.assign(arg, {
	        review: arg.required === true ? `<${arg.name}>` : `[${arg.name}]`
	    }))


	    this.inVoiceChannel = inVoiceChannel
	    this.sameVoiceChannel = sameVoiceChannel
	    this.playing = playing


	    if (this.category == 'commands') this.category = 'Other'

	    this.help = Object.assign({
	        content: 'No description available.',
	        usage: this.args.map(arg => arg.review).join(' ') ?? '',
	        examples: [],
	        fields: []
	    }, typeof help === 'string' ? {
	        content: help
	    } : help)

	    this.userPermissions = userPermissions
	    this.botPermissions = botPermissions
	    this.ownerOnly = ownerOnly
	    this.typing = typing
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public run(message: IMessage, args?: string[]): Promise<void | MessageEmbed | string> | string | MessageEmbed | void { console.log('Empty Command, location: ' + this.path) }
	public getMissing(prefix: string, index: number): string {
	    const command = prefix + this.name + ' '

	    const body = command +
			this.args.map((arg) => arg.review).join(' ') + '\n' + ' '.repeat(command.length) +
			this.args.map((arg, i) => (i === index ? '^' : ' ').repeat(arg.name.length + 2)).join(' ')

	    return '```fix\n' + `${body}\n${this.args[index].name} is a required argument that is missing.` + '```'
	}
}


export default Command