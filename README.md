# Discord Bot

This project is a Discord bot for the ISC Alumni server of the HE-Arc. It helps managing members and events.

## Environment used

-   Node.js v22.6.0
-   NPM v10.8.2

## Required environment variables

In a `.env` file, you need to set the following variables:

-   `DISCORD_BOT_TOKEN`: The token of the Discord bot
-   `DISCORD_CLIENT_ID`: The ID of the Discord bot
-   `DISCORD_GUILD_ID`: The ID of the Discord server

## Running in development

```bash
npm run dev
```

## Running in production

```bash
npm run build
npm run start
```
