/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                           IMPORTS                           *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    GuildMember,
    TextChannel,
} from "discord.js";

import moment from "moment";

import { channelIds } from "../../settings/channels";
import { roleIds } from "../../settings/roles";

import { acceptMemberAdminId } from "./accept-member-admin";
import { rejectMemberAdminId } from "./reject-member-admin";

import "../../utils/member-extensions";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                          PROPERTIES                         *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const rejectMemberResponsableId = "rejectMemberResponsable";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                           EXECUTE                           *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const execute = async (interaction: ButtonInteraction) => {
    // Get informations
    const memberId = interaction.message.embeds[0].fields[1].value;
    const member = await interaction.guild?.members.fetch(memberId);
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
            content: `Tu n'es pas responsable de la volée ${promotionYear}, tu n'es donc pas autorisé(e) à rejeter ce membre`,
            ephemeral: true,
        });

        return;
    }

    // Delete previous message
    await interaction.message.delete();

    if (!member) return;

    // Construct embed and buttons
    const accept = new ButtonBuilder()
        .setCustomId(acceptMemberAdminId)
        .setLabel("Accepter")
        .setStyle(ButtonStyle.Success);

    const reject = new ButtonBuilder()
        .setCustomId(rejectMemberAdminId)
        .setLabel("Expulser")
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        accept,
        reject
    );

    const embed = new EmbedBuilder()
        .setTitle("Nouvel arrivant")
        .setDescription("Un nouvel arrivant est en attente de validation")
        .setThumbnail(member.user.displayAvatarURL())
        .setColor("Random")
        .addFields(
            {
                name: "Nom d'utilisateur",
                value: member.user.displayName,
                inline: false,
            },
            {
                name: "ID",
                value: member.id,
                inline: true,
            },
            {
                name: "Volée",
                value: promotionYear?.toString() ?? "Inconnue",
                inline: true,
            },
            {
                name: "Date",
                value: moment(member.joinedAt).format(
                    "dddd Do MMMM YYYY, hh:mm:ss"
                ),
                inline: false,
            }
        )
        .setFooter({
            text: "© HE-Arc Alumni",
            iconURL: interaction.guild?.iconURL()!,
        });

    // Get admin channel
    const adminChannel = interaction.guild?.channels.cache.get(
        channelIds.NEW_MEMBER_ADMIN_VALIDATION
    ) as TextChannel;

    await adminChannel.send({
        content: `❌ ${owner} a refusé la demande\n<@&${roleIds.ADMINISTRATOR}> Si vous refusez, la personne sera expulsée du serveur`,
        embeds: [embed],
        components: [row],
    });
};
