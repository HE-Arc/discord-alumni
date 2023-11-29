/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                           IMPORTS                           *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import { ButtonInteraction, GuildMember, TextChannel } from "discord.js";

import { channelIds } from "../../settings/channels";
import { roleIds } from "../../settings/roles";

import "../../utils/member-extensions";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                          PROPERTIES                         *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const acceptMemberAdminId = "acceptMemberAdmin";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                           EXECUTE                           *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const execute = async (interaction: ButtonInteraction) => {
    // Get informations
    const memberId = interaction.message.embeds[0].fields[1].value;
    const member = await interaction.guild?.members.fetch(memberId);
    const owner = interaction.member as GuildMember;

    // Get initial owner
    const regex = /<@(\d+)>/;
    const initialOwnerId = regex.exec(interaction.message.content)?.[1];
    const initialOwner = await interaction.guild?.members.fetch(
        initialOwnerId!
    );

    // Check if interaction's owner is responsable or admin
    if (!owner.isAdmin()) {
        await interaction.reply({
            content:
                "Tu n'es pas administrateur, tu n'es donc pas autorisé(e) à valider ce membre",
            ephemeral: true,
        });

        return;
    }

    // Delete previous message
    await interaction.message.delete();

    if (!member) return;

    // Remove waiting role from member
    await member.roles.remove(roleIds.WAITING_FOR_VALIDATION);

    // Send log to admin channel
    const logChannel = interaction.guild?.channels.cache.get(
        channelIds.NEW_MEMBER_VALIDATED
    ) as TextChannel;

    await logChannel.send({
        content: `✅ ${interaction.user} a accepté ${member} (initialement refusé(e) par ${initialOwner})`,
    });
};
