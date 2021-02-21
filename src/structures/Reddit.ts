import fetch from 'node-fetch'
import { MessageEmbed } from 'discord.js'

const cached = {}

class Post {
    public sub: string
    public title: string
    public description: string
    public url: string
    public image?: string
    public nsfw: boolean
    public comments: number
    public votes: number

    constructor(data) {
        this.sub = data.subreddit
        this.title = data.title
        this.description = data.selftext.slice(0, 1980)
        this.url = 'https://reddit.com' + data.permalink
        this.image = data.url
        this.nsfw = data.over_18
        this.comments = data.num_comments
        this.votes = data.ups
    }
    toString() {
        return `r/${this.sub} | ${this.title}`
    }
    toJSON() {
        return {
            sub: this.sub,
            title: this.title,
            description: this.description,
            url: this.url,
            image: this.image,
            nsfw: this.nsfw,
            comments: this.comments,
            votes: this.votes
        }
    }
    toEmbed() {
        return new MessageEmbed()
            .setAuthor(`r/${this.sub}`, 'https://cdn.discordapp.com/attachments/732309032240545883/756609606922535057/iDdntscPf-nfWKqzHRGFmhVxZm4hZgaKe5oyFws-yzA.png')
            .setColor(16729344)
            .setTitle(this.title)
            .setImage(this.image)
            .setDescription(this.description)
            .setURL(this.url)
            .setFooter(`⬆ ${this.votes} 🗨 ${this.comments}`)
    }
}

class Reddit {
    async search(sub: string): Promise<Post|null> {
        if (sub in cached && cached[sub].length > 0) {
            const i = Math.floor(Math.random() * cached[sub].length)
            const post = cached[sub][i]
            cached[sub].splice(i, 1)
            return post
        } else {
            const posts = await this.cachePosts(sub)
            if (!posts) return null
            const i = Math.floor(Math.random() * posts.length)
            return posts[i]
        }
    }
    async cachePosts(sub: string): Promise<Post[]|null> {
        try {
            const response = await (await fetch(`https://www.reddit.com/r/${sub}.json?limit=100`)).json()
            if (response.error == 404 || response.data.dist == 0) throw 'Not Found'
            const posts = response.data.children.filter((p) => !p.data.over_18 && url_contains_image(p.data.url)).map((p) => new Post(p.data))
            cached[sub] = posts
            console.log(`Cached: r/${sub} with ${cached[sub].length} post!`)
            return posts
        } catch {
            return null
        }
    }
}

function url_contains_image(url?: string) {
    if (!url) return false
    if (/(\.(jpg|jpeg|png|webp))$/i.test(url)) return true
    return (/\.gif$/i.test(url) && !['tenor', 'giphy', 'imgur'].some(x => url.includes(x)))
}

export default Reddit