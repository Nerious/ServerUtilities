export class event {
    async run() {
        bot.createSlashCommandsClass();
        await SlashCommands.RegisterAllCommands();
    }
}

export const info = {
    name: "ready",
    category: "general"
}