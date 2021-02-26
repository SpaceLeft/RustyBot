import {
    Client as DiscordClient,
    WebhookClient as Webhook,
    Collection
} from 'discord.js'

import Command from './Command'
import config from '../../config'
import Reddit from './Reddit'
import Music from './Music'
import Logger from './Logger'
import db from '../database/database'
import utils from '../helpers/utils'
import { IGuildSettings, IMute, IHook } from '@types'
import { promisify } from 'util'


class Client extends DiscordClient {

    public config = config;
    public prefix = config.prefix
    public utils = utils;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public cooldown = new Collection<string, any>();
    public commands = new Collection<string, Command>();
    public aliases = new Collection<string, string>();
    public games = new Set<string>();
    public hook = new Webhook(config.webhook.id, config.webhook.token);
    public logger = new Logger(this.hook);
    public reddit = new Reddit();
    public music = new Music(this);
    public db = db;
    public cache = {
        guilds: new Collection<string, IGuildSettings>(),
        mutes: new Collection<string, IMute>(),
        logs: new Collection<string, IHook>()
    };
    public wait = promisify(setTimeout);

    async start(): Promise<void> {

        for (const file of utils.readdir(__dirname, '../commands/')) {
            const _Command = (await import(file)).default
            if (_Command?.prototype instanceof Command) {
                const command = new _Command()
                this.commands.set(command.name, command)
                command.aliases.forEach(alias => this.aliases.set(alias, command.name))
            }
        }

        for (const file of utils.readdir(__dirname, '../events/')) {
            const Event = (await import(file)).default
            const event = new Event(this)
            this.on(file.split(/[\\/]/).pop().slice(0, -3), (...args) => event.run(...args))
        }

        this
            .on('disconnect', () => this.logger.warn('Bot is disconnecting...'))
            .on('reconnecting', () => this.logger.log('Bot reconnecting...'))
            .on('error', err => this.logger.error(err))
            .on('warn', info => this.logger.warn(info))
            .on('raw', d => this.music.updateVoiceState(d))

        super.login(config.token)
    }
}

export default Client
