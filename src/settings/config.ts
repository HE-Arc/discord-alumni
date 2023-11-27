import dotenv from "dotenv";

dotenv.config();

const { DISCORD_BOT_TOKEN } = process.env;

if (!DISCORD_BOT_TOKEN) {
    throw new Error("DISCORD_BOT_TOKEN is not defined");
}

export const config = {
    DISCORD_BOT_TOKEN: DISCORD_BOT_TOKEN,
};
