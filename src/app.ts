import { createServer } from 'http'
import * as Sentry from '@sentry/node'
import config from '../config'

createServer((_, res) => {
    res.write('Hello World!')
    res.end()
}).listen(process.env.PORT || 8080)


if (process.platform === 'win32') config.mode = 'dev'

Sentry.init({
    dsn: config.sentryDSN
})

import './bot'