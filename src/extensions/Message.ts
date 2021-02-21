import {
    Structures
} from 'discord.js'

Structures.extend('Message', M => {
    class Message extends M {
        constructor(client, data, channel) {
            super(client, data, channel)
        }
        del(time) {
            if (!this.deletable) return
            try {
                if (!time) {
                    super.delete()
                } else {
                    this.client.setTimeout(() => super.delete(), time)
                }
            } catch { /* GG */ }
        }
        say(content, options) {
            return this.channel.send(content, options)
        }
        reply(content) {
            return this.channel.send(content, {
                replyTo: this
            }).catch((err) => {
                if (err?.code == 160002) return this.channel.send(`${this.author}, ${content}`)
                return err
            })
        }
    }
    return Message
})