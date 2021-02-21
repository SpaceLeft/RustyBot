import {
    Structures
} from 'discord.js'

Structures.extend('User', U => {
    class User extends U {
        constructor(client, data) {
            super(client, data)
        }
        dm(content, options) {
            return super.send(content, options)
        }
    }
    return User
})