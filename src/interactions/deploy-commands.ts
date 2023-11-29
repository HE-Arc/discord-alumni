import { REST, Routes } from "discord.js";

import { commands } from "./interactions";

import { config } from "../settings/config";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                        INITIALIZATION                       *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const rest = new REST({ version: "10" }).setToken(config.DISCORD_BOT_TOKEN);

const commandsData = Object.values(commands).map((command) => command.data);

/* * * * * * * * * * * * * * * *\
|*            DEPLOY           *|
\* * * * * * * * * * * * * * * */

export async function deployCommands() {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationGuildCommands(
                config.DISCORD_CLIENT_ID,
                config.DISCORD_GUILD_ID
            ),
            {
                body: commandsData,
            }
        );

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
}
