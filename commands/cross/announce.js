import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);


export class command {
    async run(interaction, options, subcommands) {
        switch (subcommands) {
            case info.options[0].name:
                return this.announce(interaction, options);
            case info.options[1].name:
                return this.setChannel(interaction, options);
            default:
                return interaction.editReply({
                    content: "This is awkward. You're not supposed to be here..."
                });
        }
    }

    jsonPath = process.cwd()+"/jsons/cross-announce.json";

    async announce(interaction, options) {
        if(process.env.user !== interaction.user.id) { return; }

        require.cache[require.resolve(this.jsonPath)] ? delete require.cache[require.resolve(this.jsonPath)] : undefined;
        const json = require(this.jsonPath);

        //Get message
        const message = options[0].value;

        //Loop to send messages and check permission
        for (let i = 0; i < json["serverList"].length; i++) {

            const guild = bot.client.guilds.cache.get(json["serverList"][i].server);

            const channelPermissions = PermissionChecker.CheckChannelAndPermissions(guild.members.me, json["serverList"][i].channel, [PermissionBits.SEND_MESSAGES]);
            if (channelPermissions.channel && !channelPermissions.missingPermissions) {
                channelPermissions.channel.send(message);
            }
        }

        interaction.editReply("Message has been sent!");
    }

    async setChannel(interaction, options) {
        const prefab = {
            server: undefined,
            channel: undefined
        }

        const missingPermissions = PermissionChecker.CheckMemberPermission(interaction.guild.members.me, options[0].channel, [PermissionBits.SEND_MESSAGES]);
        if (missingPermissions) return interaction.editReply("I can't chat there!");

        //Get channel
        const serverID = interaction.guildId;
        const channelID = options[0].channel.id;

        //Set prefab
        prefab.server = serverID;
        prefab.channel = channelID;

        //Saves new json
        require.cache[require.resolve(this.jsonPath)] ? delete require.cache[require.resolve(this.jsonPath)] : undefined;
        const json = require(this.jsonPath);

        // Check if server has other channel set, overwrite if this is the case
        const found = json["serverList"].findIndex(element => element.server === serverID);
        if (found){
            json["serverList"][found].channel = channelID;
        }
        else {
            json["serverList"].push(prefab);
        }

        fs.writeFileSync(this.jsonPath, JSON.stringify(json, null, "\t"));

        return interaction.editReply(found ? "Updated channel!" : "Channel has been set!");
    }
}

export const info = {
    name: "announce",
    category: "cross",
    description: "Announces a command to every ",
    ephemeral: 1,
    defaultMemberPermissions: [
        PermissionBits.ADMINISTRATOR
    ],
    botPermissions: [
        PermissionBits.SEND_MESSAGES
    ],
    options: [{
        type: CommandOptionTypes.SUB_COMMAND,
        name: "announce",
        description: "Announce a message to other Discord servers.",
        options: [{
            type: CommandOptionTypes.STRING,
            name: "message",
            description: "The message you want to announce to all servers.",
            required: true
        }]
    },{
        type: CommandOptionTypes.SUB_COMMAND,
        name: "set",
        description: "Set a channel to receive messages from the main Discord.",
        options: [{
            type: CommandOptionTypes.CHANNEL,
            name: "channel",
            description: "The channel you want to set.",
            required: true,
            channelTypes: [ChannelTypes.GUILD_TEXT]
        }]
    }]
}