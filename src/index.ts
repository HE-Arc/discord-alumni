import { Client, GatewayIntentBits } from "discord.js";
import { config } from "./settings/config";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                        INITIALIZATION                       *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ],
});

client.login(config.DISCORD_BOT_TOKEN);

/* * * * * * * * * * * * * * * *\
|*            EVENTS           *|
\* * * * * * * * * * * * * * * */

client.once("ready", () => {
    console.log("Discord bot is ready !");
});
