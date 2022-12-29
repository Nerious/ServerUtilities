import { Scanner } from "../Scanner.js";

export class Events {
    scanner
    events

    constructor() {
        this.scanner = new Scanner(process.cwd()+"/events/", "event");
        this.GetAllEvents().then(() => this.RegisterEvents());
        global.Events = this;
    }

    async GetAllEvents() {
        return this.events = await this.scanner.ScanAll();
    }

    async RegisterEvents() {
        this.events.forEach( (value, cat) => {
            for (let i = 0; i < value.length; i++) Register(`../../events/${cat}/${value[i]}`);

            async function Register(path) {
                const { event, info } = await import(path);
                const tempEvent = new event();
                bot.client.on(info.name, (...args) => tempEvent.run(...args));
            }
        })
    }
}