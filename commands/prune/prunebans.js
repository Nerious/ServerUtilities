import { toFormatMilliseconds } from "numberformatter";

export class command {
    cache = [];
    async run(interaction) {
        if (interaction.guildId in this.cache) return interaction.editReply("Already running...");

        let bans = await interaction.guild.bans.fetch();

        if (bans.size === 0) return interaction.editReply("No bans found.")

        this.cache.push(interaction.guildId);

        const loopAmount = Math.floor(bans.size / 5);

        if (loopAmount > 0) await interaction.editReply(`I'm pruning all bans. This will take ${bans.size === 1000? "more than":"approximately"}: ${toFormatMilliseconds(loopAmount * 3000, true)}`);

        let index = 0

        await toLoop();

        async function toLoop() {
            setTimeout(async() => {
                let i = bans.size - index > 5 ? 5 : bans.size - index;
                for (i; i--;) {
                    interaction.guild.bans.remove(bans.at(index).user.id).catch(err=>err);
                    index++;
                }
                if (index < bans.size) await toLoop();
                else {
                    index = 0;
                    bans = await interaction.guild.bans.fetch();
                    if (bans.size === 0) {
                        return interaction.editReply("All bans have been cleared");
                    }
                    await toLoop();
                }
            }, loopAmount > 0? 3000:0)
        }
    }
}

export const info = {
    name: "prunebans",
    category: "prune",
    description: "Removes all bans from the ban list",
    ephemeral: 1,
    defaultMemberPermissions: [
        PermissionBits.ADMINISTRATOR
    ],
    botPermissions: [
        PermissionBits.BAN_MEMBERS
    ]
}