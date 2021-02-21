import { IGuild } from '@types'

export default class {
    run(guild: IGuild): void {
        guild.client.logger.log(`New Guild: ${guild.name} (ID: ${guild.id}) | ${guild.memberCount}`)
    }
}