import { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from "discord.js"

export async function welcomeMessage(channel: TextChannel) {

    const row = new ActionRowBuilder()

    row.addComponents(
      new ButtonBuilder()
        .setCustomId('play')
        .setLabel('Play')
        .setEmoji('🚀')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('leaderboard')
        .setLabel('Leader Board')
        .setEmoji('🏆')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('rules')
        .setLabel('Rules')
        .setEmoji('📐')
        .setStyle(ButtonStyle.Secondary)
    )
  
    const messageObject: any = {
      content: "**Bienvenue dans Néomytho 🔥!**\n\nJe te passe les présentations car on a du pain sur la planche !!!\n\nDes **imposteurs** se sont glissés dans les casernes de pompier, des écoles, des restaurants et j'en passe, il y en a tellement...\n\nJ'ai vraiment besoin de toi pour les démasquer et les expulser de Néopolis 🚀",
      components: [row]
    }
    return channel.send(messageObject)
}