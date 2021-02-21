export default class {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async run(oldState, newState): Promise<void> {
        this.handleMusicPlayer(oldState, newState)

        if (!oldState.guild.hasLog()) return

        const voiceChannelLeft = !!oldState.channelID && !newState.channelID
        const voiceChannelMoved = !!oldState.channelID && !!newState.channelID && oldState.channelID !== newState.channelID
        const voiceChannelJoined = !oldState.channelID && !!newState.channelID

        const embed = {
            title: '',
            description: '',
            author: {
                name: (oldState || newState).member.user.tag,
                icon_url: (oldState || newState).member.user.displayAvatarURL({ dynamic: true })
            },
            color: 0x3498db,
            timestamp: new Date(),
            footer: {
                text: `ID: ${(oldState || newState).id}`
            }
        }

        if (voiceChannelJoined) {
            embed.title = 'Member joined voice channel'
            embed.description = `**${newState.member.user.tag}** joined #${newState.channel.name}`
        } else if (voiceChannelLeft) {
            embed.title = 'Member left voice channel'
            embed.description = `**${oldState.member.user.tag}** left #${oldState.channel.name}`
        } else if (voiceChannelMoved) {
            embed.title = 'Member changed voice channel'
            embed.description = `**${newState.member.user.tag}** from #${oldState.channel.name} to #${newState.channel.name}`
        } else return

        await (oldState || newState).guild.log(embed)
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async handleMusicPlayer(oldVoice, newVoice): Promise<void> {
        const client = oldVoice.client
        const player = oldVoice.guild.getPlayer()

        if (!player) return
        if (!newVoice.guild.me.voice.channelID) player.destroy()
        if (oldVoice.id == client.user.id) return
        if (!oldVoice.guild.me.voice.channelID) return
        if (oldVoice.guild.me.voice.channel.id !== oldVoice.channelID) return

		
        if (oldVoice.guild.me.voice.channel.members.size !== 1) return 
               
        const vcName = oldVoice.guild.me.voice.channel.name,
            channel = client.channels.cache.get(player.textChannel)

        let msg

        if (channel) msg = await channel.send(`Leaving **${vcName}** in ${60000 / 1000} seconds because I was left alone.`).catch(() => null)

        await client.wait(60000)

        const vcMembers = oldVoice.guild.me.voice.channel.members.size

        if (!vcMembers || vcMembers === 1) {
            const newPlayer = newVoice.guild.getPlayer()
            if (newPlayer) player.destroy()
            else oldVoice.guild.voice.channel.leave()
            if (msg && msg.editable) msg.edit(`I left **${vcName}** because I was left alone.`).catch(() => null)
        } else {
            if (msg && msg.deletable) msg.delete().catch(() => null)
        }
    }
}