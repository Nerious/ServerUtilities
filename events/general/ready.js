export class event {
    async run() {
        await SlashCommands.RegisterAllCommands();
    }
}

export const info = {
    name: "ready",
    category: "general"
}