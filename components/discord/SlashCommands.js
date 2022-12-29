import { Scanner } from "../Scanner.js";
import { deepStrictEqual } from "assert";

export class SlashCommands {
    scanner
    commands
    guild
    localSlashCommands

    constructor() {
        this.scanner = new Scanner(process.cwd()+"/commands/", "SlashCommand");
        //End temp
        this.GetAllCommands().then();
        global.SlashCommands = this;
    }

    async GetAllCommands() {
        this.localSlashCommands = bot.client.commands;
        return this.commands = await this.scanner.ScanAll();
    }

    async RegisterAllCommands() {
        const currentCommands = await this.localSlashCommands.fetch();
        await this.StillExists(currentCommands);
        this.commands.forEach((value, cat) => {
            for (let i = 0; i < value.length; i++) {
                this.Register(`../../commands/${cat}/${value[i]}`, currentCommands);
            }
        })
    }

    async StillExists(currentCommands) {
        const commandFiles = Array.from(this.commands.values()).flat();
        currentCommands.forEach((command)=> {
            if (!commandFiles.find(cmd => cmd === command.name+".js")) this.#UnregisterOnDiscord(command);
        })
    }

    async Register(path, currentCommands) {
        const { command, info } = await import(path);
        const tempCommand = new command();

        const exists = currentCommands.find(command => command.name === info.name.toLowerCase())

        checker: if (exists) {
            exists.options = JSON.parse(JSON.stringify({cmdsinfo: exists.options}))["cmdsinfo"];
            let optionsChanged;
            try { deepStrictEqual(exists.options.length > 0? exists.options:undefined, info.options) } catch (err) { optionsChanged = true }
            if (exists.description !== info.description || optionsChanged || exists.defaultMemberPermissions?.missing(info.defaultMemberPermissions)?.length > 0) break checker;
            exists.handler = tempCommand;
            return exists.info = info;
        }

        const createdCommand = await this.#RegisterOnDiscord(info);

        createdCommand.handler = tempCommand;
        return createdCommand.info = info;
    }

    async #RegisterOnDiscord(info) {
        return this.localSlashCommands.create({
            type: CommandTypes.CHAT_INPUT,
            name: info.name.toLowerCase(),
            description: info.description,
            options: info.options,
            defaultMemberPermissions: info.defaultMemberPermissions,
        });
    }

    async #UnregisterOnDiscord(command) {
        return this.localSlashCommands.delete(command);
    }
}