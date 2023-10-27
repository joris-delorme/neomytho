import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, TextChannel } from "discord.js";
import { client, config } from "./config"
import { welcomeMessage } from "./play/welcome-message";
import { chooseJob } from "./play/choose-job";
import { jobs } from "./utils/constants";
import { SelectCharacter, characters, imposteur, response } from "./play/select-character";

let currentJob: IJob;
let currentCharacter: ICharacter;
let isEnd = false

client.on('ready', async (c) => {
  console.log(`${c.user.username} bot is ready! 🤖`)

  const channel = client.channels.cache.get(config.DISCORD_CHANNEL_ID) as TextChannel
  if (!channel || !(channel instanceof TextChannel)) return console.log(`Channel id:${config.DISCORD_CHANNEL_ID} not found...`)
  console.log(channel.guild.id)

  const reactionWelcomeMsg = await (await welcomeMessage(channel)).awaitMessageComponent() as ButtonInteraction

  const interactionId = reactionWelcomeMsg.customId as "play" | "leaderboard" | "rules"

  if (interactionId === "play") {
    const jobReaction = await (await chooseJob(reactionWelcomeMsg)).awaitMessageComponent() as ButtonInteraction
    const job = jobs.find(j => j.id === jobReaction.customId)!
    SelectCharacter(job, jobReaction)
    currentJob = job
  }
})

client.on('interactionCreate', (interaction) => {
  if (!interaction.isStringSelectMenu()) return
  const character = characters.find(x => x.id === interaction.values[0])
  if (!character) return
  interaction.reply(`Tu parles désormais à  ${character?.firstName}, poses lui une question:`)
  currentCharacter = character
})

client.on('messageCreate', (message) => {
  if (client.user && !isEnd && currentJob && currentCharacter && message.author.id !== client.user.id) response(currentJob.name, currentCharacter, message)
})


client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const row = new ActionRowBuilder()
  row.addComponents(
    characters.map(job => new ButtonBuilder()
      .setCustomId(job.id)
      .setLabel(job.firstName)
      .setStyle(ButtonStyle.Primary))
  )
  const messageObject: any = {
    content: `As-tu deviné qui est l'imposteur ?`,
    components: [row]
  }

  console.log(imposteur.firstName)

  const res = await (await interaction.reply(messageObject)).awaitMessageComponent() as ButtonInteraction
  if (res.component.label === imposteur.firstName) res.reply("Bien joué tu as démasqué l'imposteur !!")
  else res.reply("Ce n'est pas l'imposteur... Tu es perdu.")

  isEnd = true
})

// 