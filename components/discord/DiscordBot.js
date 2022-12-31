import { Client, Partials, EmbedBuilder } from "discord.js";
import { SlashCommands } from "./SlashCommands.js";
import { Events } from "./Events.js";
import { PermissionChecker } from "./PermissionChecker.js";
import { DiscordEnums } from "./DiscordEnums.js";

export class DiscordBot {
    client
    ownerID

    /**
     * Create the Discord bot.
     * @param {string} token Set the token to create the bot with.
     */
    constructor(token, ) {
        new DiscordEnums();
        this.ownerID = [ 252837942664364033, 148866919674413056 ];
        this.#Create();
        this.#Login(token);
    }

    #Create(){
        this.client = new Client({
            disableMentions: "everyone",
            intents: [
                IntentBits.GUILD_BANS,
                IntentBits.GUILDS,
                IntentBits.GUILD_EMOJIS_AND_STICKERS,
                IntentBits.GUILD_MEMBERS,
                IntentBits.GUILD_MESSAGES,
                IntentBits.GUILD_MESSAGE_REACTIONS,
                IntentBits.GUILD_INVITES
            ],
            partials: [
                Partials.User,
                Partials.GuildMember,
                Partials.Channel,
                Partials.Message,
                Partials.Reaction
            ]
        })
        global.bot = this;
        global.EmbedBuilder = EmbedBuilder;
    }

    #Login(token) {
        this.client.login(token).catch(err => {
            console.log(`The client couldn't log in. \n\nReason: ${err}\n`, import.meta.url);
            process.exit(502);
        });

        new Events();
        new PermissionChecker();
    }

    createSlashCommandsClass() {
        new SlashCommands();
    }
}