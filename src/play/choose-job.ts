import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, TextChannel } from "discord.js"
import { jobs } from "../utils/constants"

export async function chooseJob(interaction: ButtonInteraction) {
    const channel = interaction.channel as TextChannel
    const row = new ActionRowBuilder()
    row.addComponents(
        jobs.map(job => new ButtonBuilder()
            .setCustomId(job.id)
            .setLabel(job.name)
            .setEmoji(job.icon)
            .setStyle(ButtonStyle.Primary))
    )
    const messageObject: any = {
        content: `Salut ${interaction.user.displayName} merci de me proposer ton aide 🚀. Pour commencer :`,
        components: [row]
    }
    return channel.send(messageObject)
}