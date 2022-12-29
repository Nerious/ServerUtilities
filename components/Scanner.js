import { existsSync, readdirSync } from "fs";

export class Scanner {
    #dir
    #intention
    #scannedFiles

    constructor(dir, intention) {
        this.#dir = dir
        this.#intention = intention
        this.#scannedFiles = new Map();
    }

    /**
     * Scan all js files
     */
    async ScanAll() {
        console.log(`Scanning all ${this.#intention}.`);

        const categories = readdirSync(this.#dir).filter(category => !category.includes("."));

        if(categories.length <= 0) {
            bot.client.destroy();
            console.log("Whoops something went wrong here! You don't have any categories in your bot.", import.meta.url);
            return process.exit(2);
        }

        for (const category of categories) await this.ScanCategory(category);

        console.log(`Finished scanning all ${this.#intention}s!`);

        return this.#scannedFiles
    }

    /**
     * Scan a folder (category) for js files.
     * @param {string} category Set the folder (category) name you want to check.
     */
    async ScanCategory(category) {
        console.log(`Scanning category: "${category}"!`);

        if (!existsSync(this.#dir + category)) return console.log(`Category: "${category}" doesn't exist.`, import.meta.url);

        const commands = readdirSync(this.#dir + category).filter(file => file.endsWith(".js") && !file.startsWith("."));

        this.#scannedFiles.set(category, commands);

        if(commands.length <= 0) return console.log(`Category: "${category}" does not have any ${this.#intention}s. Check this if needed!`, import.meta.url);
    }
}