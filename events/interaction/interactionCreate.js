import {EmbedBuilder} from "discord.js";

export class event {
    async run(interaction) {
        if (interaction.isCommand()) {
            if (interaction.command == null) return interaction.reply({
                embeds: [new EmbedBuilder().setTitle("Something went wrong!")],
                ephemeral: true
            });

            if (!interaction.command.info || !interaction.command.handler) return interaction.reply({
                embeds: [new EmbedBuilder().setTitle("Bot is still starting up!")],
                ephemeral: true
            });

            await interaction.deferReply({
                ephemeral: interaction.command.info?.ephemeral
            });

            if (interaction.command.info.category === "owner" && !bot.ownerID.find(id => id === interaction.user.id)) return undefined;

            const missingPermissions = PermissionChecker.CheckMemberPermission(interaction.guild.members.me, interaction.channel, interaction.command.info?.botPermissions)

            if (missingPermissions) return interaction.editReply({
                embeds: [new EmbedBuilder().setTitle(`I don't have the correct permission${missingPermissions.length > 1? "s" : ""}.\n\nMissing permission${missingPermissions.length > 1? "s" : ""}:\n${missingPermissions.join(",\n")}.`)]
            });

            return interaction.command.handler.run(interaction, interaction.options._hoistedOptions, [interaction.options._group, interaction.options._subcommand].join(""));
        }

        return undefined;
    }
}

export const info = {
    name: "interactionCreate",
    category: "interaction"
}