import fs from "fs";

export class command {
    async run(interaction, options, subcommands) {
        switch (subcommands) {
            case info.options[0].name + info.options[0].options[0].name:
                return this.announce(interaction, options);
            case info.options[0].name + info.options[0].options[1].name:
                return this.setChannel();
            default:
                return interaction.editReply({
                    content: "This is awkward. You're not supposed to be here..."
                });
        }
    }

    jsonPath = process.cwd()+"/jsons/cross-announce.json";

    async announce(interaction, options) {
        const json = require.cache[require.resolve(this.jsonPath)] || require(this.jsonPath);

        //Get message

        //Loop to send messages and check permission
        for (let i = 0; i < json["serverList"].length; i++) {

        }
    }

    async setChannel(interaction, options) {
        const prefab = {
            server: undefined,
            channel: undefined
        }

        //Get channel

        //Set prefab

        //Saves new json
        const json = require.cache[require.resolve(this.jsonPath)] || require(this.jsonPath);

        json["serverList"].push(prefab);

        fs.writeFileSync(this.jsonPath, JSON.stringify(json, null, "\t"));

        delete require.cache[require.resolve(this.jsonPath)];
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