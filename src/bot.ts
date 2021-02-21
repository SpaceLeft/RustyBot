import './extensions/Guild'
import './extensions/Message'
import './extensions/User'

import Client from './structures/Client'

const client = new Client({
    restTimeOffset: 50,
    allowedMentions: {
        parse: ['users'],
        repliedUser: false
    },
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_VOICE_STATES'],
    partials: ['MESSAGE', 'REACTION'],
    presence: {
        activity: {
            name: 'loading screen...',
            type: 'WATCHING'
        }
    }
});


(async (startAt) => {
    try {
        await client.db.start(client.logger)
        await client.start()
        client.logger.log(`Loaded in ${Date.now() - startAt}ms`)
    } catch (error) {
        client.logger.error(error)
    }
})(Date.now())


process
    .on('uncaughtException', (error) => client.logger.error(error))
    .on('unhandledRejection', (error) => client.logger.error(error))
    .on('warning', (info) => client.logger.warn(info))