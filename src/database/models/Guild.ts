import * as mongoose from 'mongoose'
import config from '../../../config'

export default mongoose.model('Guild', new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        default: config.prefix
    },
    reactions_roles: {
        type: Array,
        default: []
    },
    plugins: {
        type: Object,
        default: {
            translate: false,
        }
    },
    ignored: {
        type: Object,
        default: {
            channels: [],
            commands: [],
            roles: []
        }
    },
    log: {
        type: Object,
        default: {
            enabled: false,
            id: null,
            token: null,
            channel: null
        }
    },
    roles: {
        type: Object,
        default: {
            muted: null,
            mod: []
        }
    },
    channels: {
        type: Object,
        default: {
            mod: null
        }
    },
    cases: {
        type: Array,
        default: []
    },
    mutes: {
        type: Array,
        default: []
    }
}))