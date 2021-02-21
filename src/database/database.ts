import mongoose from 'mongoose'
import GuildModel from './models/Guild'
import config from '../../config'
import Logger from '../structures/Logger'

export default {
    async start(logger: Logger): Promise<void> {
        mongoose.set('useFindAndModify', false)
        await mongoose.connect(config.mongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }).catch((err) => {
            logger.error(err)
            process.exit(1)
        })
        logger.log('Connected to the Mongodb database.')
    },
    guild: GuildModel
}