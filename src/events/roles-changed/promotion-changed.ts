/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                           IMPORTS                           *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import { GuildMember, Role, TextChannel } from "discord.js";

import { channelIds } from "../../settings/channels";
import { roleIds } from "../../settings/roles";

import "../../utils/role-extensions";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                           EXECUTE                           *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const execute = async (
    member: GuildMember,
    oldRole: Role,
    newRole: Role
) => {
    // Check that both roles are promotion years
    if (!oldRole.isPromotionYear() || !newRole.isPromotionYear()) return;

    const oldPromotionYear = oldRole.promotionYear();
    const newPromotionYear = newRole.promotionYear();

    // Check that the promotion year has changed
    if (oldPromotionYear === newPromotionYear) return;

    // Check that the member is still under verification
    if (member.roles.cache.has(roleIds.WAITING_FOR_VALIDATION)) {
        return underRespVerification(member);
    }

    // Otherwise, block the change
    await member.roles.add(oldRole);
    await member.roles.remove(newRole);
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                          FUNCTIONS                          *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * The member is still under verification, update the admin validation message
 * @param member The member to check
 */
async function underAdminValidation(member: GuildMember) {
    // Get the promotion year
    const promotionYear = member.promotionYear();

    // Get the responsable channel
    const adminChannel = member.guild.channels.cache.get(
        channelIds.NEW_MEMBER_TO_VALIDATE
    ) as TextChannel;

    // Check that the channels exists
    if (!adminChannel) return;

    // Fetch the messages
    await adminChannel.messages.fetch();

    // Get the message from the channel
    const adminMessage = adminChannel.messages.cache.find((m) => {
        if (m.embeds.length === 0) return false;

        const embed = m.embeds[0];

        if (embed.fields.length < 3) return false;

        const fieldId = embed.fields[1];

        return fieldId.value === member.id;
    });

    // Check that the message exists
    if (!adminMessage) return;

    // Get the promotion field
    const field = adminMessage.embeds[0].fields[2];

    // Update the field
    field.value = promotionYear?.toString() ?? "Inconnue";

    // Update the message
    await adminMessage.edit({ embeds: [adminMessage.embeds[0]] });
}

/**
 * The member is still under verification, update the responsable verification message
 * @param member The member to check
 */
async function underRespVerification(member: GuildMember) {
    // Get the promotion year
    const promotionYear = member.promotionYear();

    // Get the responsable channel
    const respChannel = member.guild.channels.cache.get(
        channelIds.NEW_MEMBER_TO_VALIDATE
    ) as TextChannel;

    // Check that the channels exists
    if (!respChannel) return;

    // Fetch the messages
    await respChannel.messages.fetch();

    // Get the message from the channel
    const respMessage = respChannel.messages.cache.find((m) => {
        if (m.embeds.length === 0) return false;

        const embed = m.embeds[0];

        if (embed.fields.length < 3) return false;

        const fieldId = embed.fields[1];

        return fieldId.value === member.id;
    });

    // Check that the message exists, otherwise check for the admin validation message
    if (!respMessage) return underAdminValidation(member);

    // Get the promotion field
    const field = respMessage.embeds[0].fields[2];

    // Update the field
    field.value = promotionYear?.toString() ?? "Inconnue";

    // Get the responsables
    const allMembers = await member.guild.members.fetch();
    const responsables = allMembers
        .filter((m) => m.isResponsable())
        .filter((resp) => resp.promotionYear() === promotionYear)
        .map((resp) => resp.toString());

    // Update the message
    await respMessage.edit({ embeds: [respMessage.embeds[0]] });

    // Send a notification to the responsables
    await respMessage.channel.send({
        content:
            responsables.length > 0
                ? responsables.join(" ")
                : `<@&${roleIds.ADMINISTRATOR}> (aucun responsable de volée n'est établi pour la volée ${promotionYear})`,
        reply: { messageReference: respMessage.id },
    });
}
