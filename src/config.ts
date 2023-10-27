import { Client, IntentsBitField } from "discord.js";
import dotenv from "dotenv";
import { OpenAI } from "openai"

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, OPENAI_API_KEY, DISCORD_GUILDS_ID, DISCORD_CHANNEL_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !OPENAI_API_KEY || !DISCORD_GUILDS_ID || !DISCORD_CHANNEL_ID) {
  throw new Error("Missing environment variables");
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
})

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]
})

client.login(DISCORD_TOKEN)

const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  DISCORD_GUILDS_ID,
  DISCORD_CHANNEL_ID
}

export {
  openai,
  config,
  client
}
