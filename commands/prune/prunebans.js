import { toFormatMilliseconds } from "numberformatter";

export class command {
    constructor() {
        bot.cache.set("prunebans", [])
    }

    async run(interaction, options) {
        if (bot.cache.get("prunebans").find(guild => guild === interaction.guildId)) return interaction.editReply("Already running...");

        let bans = await interaction.guild.bans.fetch();

        if (bans.size === 0) return interaction.editReply("No bans found.")

        bot.cache.get("prunebans").push(interaction.guildId);

        const loopAmount = Math.floor(bans.size / 5);

        if (loopAmount > 0) await interaction.editReply(`I'm pruning all bans. This will take ${bans.size === 1000? "more than":"approximately"}: ${toFormatMilliseconds(loopAmount * 3000, true)}`);

        let index = 0;
        let amountOfRefetch = 0;
        let sendNewMessage = false;

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
                        if (options[0]?.value) await interaction.channel.send(`${interaction.user} All bans have been cleared`);
                        else if (!sendNewMessage) await interaction.editReply("All bans have been cleared");
                        return bot.cache.get("prunebans").splice(bot.cache.get("prunebans").indexOf(interaction.guildId), 1);
                    }

                    amountOfRefetch++;
                    if (amountOfRefetch === 1) sendNewMessage = bans.size > 400
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
    ],
    options: [{
        type: CommandOptionTypes.BOOLEAN,
        name: "send_end_message",
        description: "Sends new message in this channel when process is completed. Recommended if you have over 1k bans.",
        required: false
    }]
}