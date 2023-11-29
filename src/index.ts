/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                           IMPORTS                           *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {
    ActivityType,
    ButtonInteraction,
    CacheType,
    Client,
    CommandInteraction,
    GatewayIntentBits,
    GuildMember,
    Interaction,
    InteractionType,
} from "discord.js";

import moment from "moment";
import "moment-timezone";

import { deployCommands } from "./interactions/deploy-commands";
import { buttons, commands } from "./interactions/interactions";
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

client.once("ready", async () => {
    // Set default timezone and language
    moment.tz.setDefault(config.TIMEZONE);
    moment.locale("fr");

    // Set activity
    client.user?.setActivity({
        name: "port 443",
        type: ActivityType.Listening,
    });

    // Deploy commands
    await deployCommands();

    console.log("Discord bot is ready !");
});

client.on("guildMemberAdd", async (member: GuildMember): Promise<void> => {});

client.on(
    "interactionCreate",
    async (interaction: Interaction<CacheType>): Promise<void> => {
        switch (interaction.type) {
            case InteractionType.ApplicationCommand:
                handleCommand(interaction);
                break;
            case InteractionType.MessageComponent:
                if (interaction.isButton()) handleButton(interaction);
                break;
            default:
                console.log("Unhandled interaction type");
                break;
        }
    }
);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                          FUNCTIONS                          *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Handle button interactions
 * @param interaction The interaction to handle
 */
function handleButton(interaction: ButtonInteraction<CacheType>): void {
    const { customId } = interaction;

    if (customId in buttons) {
        buttons[customId as keyof typeof buttons].execute(interaction);
    }
}

/**
 * Handle command interactions
 * @param interaction The interaction to handle
 */
function handleCommand(interaction: CommandInteraction<CacheType>): void {
    const { commandName } = interaction;

    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
}
