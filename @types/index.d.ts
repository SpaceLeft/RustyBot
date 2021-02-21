import { APIMessage, APIMessageContentResolvable, Guild, Message, MessageAdditions, MessageEmbed, MessageOptions, NewsChannel, PermissionString, SplitOptions, StringResolvable, TextChannel } from 'discord.js'
import { NodeOptions, Player } from 'erela.js'
import { Document } from 'mongoose'
import Client from '../src/structures/Client'


export interface ICase {
    type: string;
    user: string;
    moderator: string;
    reason?: string;
    case: number;
    timestamp: number;
}

export interface IMute {
    ID: string;
    user_id: string;
    guild_id: string;
    role_id: string;
    time: number;
}

export interface IHook {
    token: string,
    id: string
}

export interface IGuildSettings extends Document {
    id: string;
    prefix: string;
    reactions_roles: IReactionRole[];
    plugins: {
        translate: boolean
    };
    ignored: {
        channels: string[],
        commands: string[],
        roles: string[]
    };
    log: {
        enabled: boolean,
        id: string | null,
        token: string | null,
        channel: string | null
    };
    roles: {
        muted: string | null,
        mod: string[]
    };
    channels: {
        mod: string | null
    };
    cases: ICase[];
    mutes: IMute[];
}

export interface IGuild extends Guild {
    fetchSettings(): Promise<IGuildSettings>;
    isCached(): boolean;
    hasLog(): boolean;
    log(embed: MessageEmbed): Promise<void>;
    update(...args: any[]): Promise<IGuildSettings>;
	getPlayer(): Player | null;
    client: Client;
	settings: IGuildSettings | null;
}

export interface IReactionRole {
    reaction: string;
    reaction_review: string;
    guild_id: string;
    message_id: string;
    channel_id: string;
    role_id: string;
    type: string;
}

export interface IMessage extends Message {
	prefix: string;
    client: Client;
    guild: IGuild;
    channel: ITextChannel | INewsChannel;
    del(time?: number): void;
    say(
        content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions,
    ): Promise<IMessage>;
    say(options: MessageOptions | APIMessage): Promise<IMessage | IMessage[]>;
    say(content: StringResolvable, options: MessageOptions): Promise<IMessage | IMessage[]>;
}



export interface ITextChannel extends TextChannel {
    client: Client;
    guild: IGuild;
    send(
        content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions,
    ): Promise<IMessage>;
    send(options: MessageOptions & { split: true | SplitOptions }): Promise<IMessage[]>;
    send(options: MessageOptions | APIMessage): Promise<IMessage | IMessage[]>;
    send(content: StringResolvable, options: (MessageOptions & { split?: false }) | MessageAdditions): Promise<IMessage>;
    send(content: StringResolvable, options: MessageOptions & { split: true | SplitOptions }): Promise<IMessage[]>;
    send(content: StringResolvable, options: MessageOptions): Promise<IMessage | IMessage[]>;
}
export interface INewsChannel extends NewsChannel {
    client: Client;
    guild: IGuild;
    send(
        content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions,
    ): Promise<IMessage>;
    send(options: MessageOptions & { split: true | SplitOptions }): Promise<IMessage[]>;
    send(options: MessageOptions | APIMessage): Promise<IMessage | IMessage[]>;
    send(content: StringResolvable, options: (MessageOptions & { split?: false }) | MessageAdditions): Promise<IMessage>;
    send(content: StringResolvable, options: MessageOptions & { split: true | SplitOptions }): Promise<IMessage[]>;
    send(content: StringResolvable, options: MessageOptions): Promise<IMessage | IMessage[]>;
}

export interface IConfig {
    mode: string
    token: string
    mongoDB: string
    prefix: string
    ownerID: string
    webhook: {
        id: string,
        token: string
    }
    spotify: {
        clientID: string,
        clientSecret: string
    }
    status: string[]
    'top.gg': string
    sentryDSN?: string
    google_api?: string
    nodes?: NodeOptions[]
}


export interface IArgs {
	name: string
	type?: string
	required?: boolean
	review?: string
}

type Field = {
    name: string,
    value: string
}


export interface ICommandHelp {
	content?: string
	usage?: string
	examples?: string[]
	fields?: Field[]
}


export interface ICommandOptions {
	aliases?: string[]
	args?: IArgs | IArgs[]
	help?: ICommandHelp | string
	ownerOnly?: boolean
	userPermissions?: PermissionString[]
	botPermissions?: PermissionString[]
	typing?: boolean
	cooldown?: number
	sameVoiceChannel?: boolean
	inVoiceChannel?: boolean
	playing?: boolean
	hide?: boolean
}

export interface ICommand {
	 path: string
	 name: string;
	 category: string;
	 hide: boolean;
	 aliases: string[];
	 args: IArgs[];
	 inVoiceChannel: boolean;
	 sameVoiceChannel: boolean;
	 playing: boolean;
	 help: ICommandHelp;
	 typing: boolean;
	 ownerOnly: boolean;
	 cooldown: number;
	 userPermissions: string[];
	 botPermissions: string[];
}