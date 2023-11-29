import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    EmbedBuilder,
    GuildMember,
    SlashCommandBuilder,
    TextChannel,
} from "discord.js";

import moment from "moment";

import { acceptMemberResponsableId } from "../buttons/accept-member-responsable";
import { rejectMemberResponsableId } from "../buttons/reject-member-responsable";

import { channelIds } from "../../settings/channels";
import { roleIds } from "../../settings/roles";

export const data = new SlashCommandBuilder()
    .setName("test")
    .setDescription("Simulates an arriving member (user)");

export const execute = async (interaction: CommandInteraction) => {
    // Send reply
    await interaction.reply({
        content: "New member simulation started",
        ephemeral: true,
    });

    // Get informations
    const member = interaction.member as GuildMember;
    const promotionYear = member.promotionYear();

    // Get responsables
    const allMembers = await member.guild.members.fetch();
    const responsables = allMembers
        .filter((m) => m.isResponsable())
        .filter((resp) => resp.promotionYear() === promotionYear)
        .map((resp) => resp.toString());

    // Construct embed and buttons
    const accept = new ButtonBuilder()
        .setCustomId(acceptMemberResponsableId)
        .setLabel("Accepter")
        .setStyle(ButtonStyle.Success);

    const reject = new ButtonBuilder()
        .setCustomId(rejectMemberResponsableId)
        .setLabel("Rejeter")
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

    // Get verification channel
    const channel = (await interaction.guild?.channels.fetch(
        channelIds.NEW_MEMBER_TO_VALIDATE
    )) as TextChannel;

    await channel.send({
        content:
            responsables.length > 0
                ? responsables.join(" ")
                : `<@&${roleIds.ADMINISTRATOR}> (aucun responsable de volée n'est établi pour la volée ${promotionYear})`,
        embeds: [embed],
        components: [row],
    });
};
