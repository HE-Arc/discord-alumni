/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                           IMPORTS                           *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {
    ActivityType,
    ButtonInteraction,
    CacheType,
    Client,
    Collection,
    CommandInteraction,
    GatewayIntentBits,
    GuildMember,
    Interaction,
    InteractionType,
    PartialGuildMember,
    Role,
} from "discord.js";

import moment from "moment";
import "moment-timezone";

import { deployCommands } from "./interactions/deploy-commands";
import { buttons, commands } from "./interactions/interactions";

import { events, eventsRolesChanged } from "./events/events";

import { config } from "./settings/config";
import { roleIds } from "./settings/roles";

import "./utils/array-extensions";

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

client.on("guildMemberAdd", async (member: GuildMember) => {
    // Simply add a specific role to the new member
    await member.roles.add(roleIds.NEW_MEMBER);
});

client.on(
    "guildMemberUpdate",
    async (
        oldMember: GuildMember | PartialGuildMember,
        newMember: GuildMember
    ): Promise<void> => {
        // Check if roles have been added
        if (oldMember.roles.cache.size < newMember.roles.cache.size) {
            const addedRoles = newMember.roles.cache.filter(
                (role) => !oldMember.roles.cache.has(role.id)
            );

            return rolesAdded(newMember, addedRoles);
        }

        // Check if roles has been added and removed at the same time
        if (oldMember.roles.cache.size === newMember.roles.cache.size) {
            const addedRoles = newMember.roles.cache.filter(
                (role) => !oldMember.roles.cache.has(role.id)
            );

            const removedRoles = oldMember.roles.cache.filter(
                (role) => !newMember.roles.cache.has(role.id)
            );

            if (addedRoles.size > 0 && removedRoles.size > 0)
                return rolesChanged(newMember, addedRoles, removedRoles);
        }
    }
);

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

/**
 * Handle roles added
 * @param member The member who got roles added
 * @param addedRoles The roles that have been added
 */
function rolesAdded(
    member: GuildMember,
    addedRoles: Collection<string, Role>
): void {
    addedRoles.forEach((role) => {
        if (events[role.id as keyof typeof events]) {
            events[role.id as keyof typeof events].execute(member);
        }
    });
}

/**
 * Handle roles added and removed at the same time
 * @param member The member who got roles added and removed
 * @param addedRoles The roles that have been added
 * @param removedRoles The roles that have been removed
 */
function rolesChanged(
    member: GuildMember,
    addedRoles: Collection<string, Role>,
    removedRoles: Collection<string, Role>
): void {
    const allCombination = [...addedRoles.values()].combine([
        ...removedRoles.values(),
    ]);

    allCombination.forEach((combination) => {
        eventsRolesChanged.forEach((event) => {
            event.execute(member, combination[1], combination[0]);
        });
    });
}
