import dotenv from "dotenv";

dotenv.config();

const { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                        VERIFICATIONS                        *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

if (!DISCORD_BOT_TOKEN) {
    throw new Error("DISCORD_BOT_TOKEN is not defined");
}

if (!DISCORD_CLIENT_ID) {
    throw new Error("DISCORD_CLIENT_ID is not defined");
}

if (!DISCORD_GUILD_ID) {
    throw new Error("DISCORD_GUILD_ID is not defined");
}

/* * * * * * * * * * * * * * * *\
|*            EXPORT           *|
\* * * * * * * * * * * * * * * */

export const config = {
    DISCORD_BOT_TOKEN: DISCORD_BOT_TOKEN,
    DISCORD_CLIENT_ID: DISCORD_CLIENT_ID,
    DISCORD_GUILD_ID: DISCORD_GUILD_ID,
    TIMEZONE: "Europe/Berlin",
};
