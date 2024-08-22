/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                           IMPORTS                           *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import { ButtonInteraction, GuildMember, TextChannel } from "discord.js";

import { channelIds } from "../../settings/channels";

import "../../utils/member-extensions";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                          PROPERTIES                         *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const rejectMemberAdminId = "rejectMemberAdmin";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                           EXECUTE                           *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const execute = async (interaction: ButtonInteraction) => {
    // Load all members
    await interaction.guild?.members.fetch();

    // Get informations
    const memberId = interaction.message.embeds[0].fields[1].value;
    const member = interaction.guild?.members.cache.get(memberId);
    const owner = interaction.member as GuildMember;

    // Get initial owner
    const regex = /<@(\d+)>/;
    const initialOwnerId = regex.exec(interaction.message.content)?.[1];
    const initialOwner = interaction.guild?.members.cache.get(initialOwnerId!);

    // Check if interaction's owner is responsable or admin
    if (!owner.isAdmin()) {
        await interaction.reply({
            content:
                "Tu n'es pas administrateur, tu n'es donc pas autorisé(e) à expulser ce membre",
            ephemeral: true,
        });

        return;
    }

    // Delete previous message
    await interaction.message.delete();

    if (!member) return;

    // Kick member
    await member.kick();

    // Send log to admin channel
    const logChannel = interaction.guild?.channels.cache.get(
        channelIds.NEW_MEMBER_VALIDATED
    ) as TextChannel;

    await logChannel.send({
        content: `❌ ${interaction.user} a expulsé \`${member.user.username}\` (initialement refusé(e) par ${initialOwner})`,
    });
};
