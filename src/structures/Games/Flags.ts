import { GuildMember } from 'discord.js'
import countries from '../../../JSON/country-codes.json'
const codes = Object.keys(countries)

interface Flag {
	name: string,
	code: string
}

class FlagsGame {
	public players: GuildMember[];
	public flags: Flag[];
	public country: Flag;

	constructor(users: GuildMember[]) {
	    this.players = users
	    this.setup()
	}
	setup(): void {
	    while (this.flags.length !== 5) {
	        const code = codes[Math.floor(Math.random() * codes.length)]
	        if (!this.flags.some(c => c.code == code)) this.flags.push({
	            name: countries[code],
	            code
	        })
	    }
	    this.flags.sort(() => 0.5 - Math.random())
	    this.country = this.flags[Math.floor(Math.random() * this.flags.length)]
	}
	getFlags(): Flag[] {
	    return this.flags
	}
	getCountry(): Flag {
	    return this.country
	}
	toString(): string {
	    let text = `\n\n${this.flags.map((f, i) => `${i + 1}. \`${f.name}\``).join('\n')}\n\n- You have 30 seconds to answer!\n`

	    if (this.players.length !== 1) text = this.players.map(m => `**${m.displayName}**`).join(' VS ') + text

	    return text
	}
}

export default FlagsGame