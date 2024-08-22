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

export const acceptMemberResponsableId = "acceptMemberResponsable";

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
    const promotionYear = parseInt(
        interaction.message.embeds[0].fields[2].value
    );

    // Check if interaction's owner is responsable or admin
    if (
        !(owner.isResponsable() && owner.promotionYear() === promotionYear) &&
        !owner.isAdmin()
    ) {
        await interaction.reply({
            content: `Tu n'es pas responsable de la volée ${promotionYear}, tu n'es donc pas autorisé(e) à valider ce membre. Si tu penses qu'il s'agit d'une erreur, contacte un administrateur`,
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
        content: `✅ ${interaction.user} a accepté ${member}`,
    });
};
