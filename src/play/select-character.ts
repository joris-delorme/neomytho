import { ActionRowBuilder, ButtonInteraction, Message, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder } from "discord.js";
import { maxCharacters, maxQuestionsPerCharacters } from "../utils/constants";
import { makeCharacters } from "../utils/lib";
import { client, openai } from "../config";

let characters = makeCharacters()
export const imposteur = characters[Math.floor(Math.random()*characters.length)]

export async function SelectCharacter(job: IJob, interaction: ButtonInteraction) {

    const characterSelect = new StringSelectMenuBuilder()
        .setCustomId('select-character')
        .setPlaceholder('Choisi un personnage...')
        .setMinValues(0)
        .setMaxValues(1)

    characterSelect.addOptions(
        characters.map((character) => new StringSelectMenuOptionBuilder()
            .setValue(character.id)
            .setLabel(`${character.firstName}`)
        )
    )

    const row = new ActionRowBuilder().addComponents(characterSelect)

    const messageContent = {
        content: `En cherchant dans le bâtiment j'ai trouvé ${maxCharacters} ${job.name}, l'imposteur est l'un d'eux j'en suis sûr !!\n\nAide moi à le démasquer avant qu'il puisse s'enfuir...\n\nSélectionnes le ${job.name} à qui te veux parler ici:`,
        components: [row]
    }

    // @ts-ignore
    interaction.reply(messageContent)
}

export const response = async (currentJob: string, currentCharacter: ICharacter, message: Message) => {
    
    if (message.content.toLowerCase().includes("imposteur")) {
        //const imposteurNbr = 
    }

    const characterSelect = new StringSelectMenuBuilder()
        .setCustomId('select-character')
        .setPlaceholder('Choisi un personnage...')
        .setMinValues(0)
        .setMaxValues(1)

    characterSelect.addOptions(
        characters.map((character) => new StringSelectMenuOptionBuilder()
            .setValue(character.id)
            .setLabel(`${character.firstName}`)
            .setDefault(character.id === currentCharacter.id)
        )
    )

    const row = new ActionRowBuilder().addComponents(characterSelect)
    const character = characters.find(x => x.id === currentCharacter.id)!
    
    if (character?.questions >= maxQuestionsPerCharacters) {
        const messageContent = {
            content: `Tu as poser le maximum de questions à ${character.firstName}, choisi-en un autre:`,
            components: [row]
        }
        //@ts-ignore
        message.reply(messageContent)
        return
    } else {
        characters[Number(character.id)].questions += 1
    }
    
    message.channel.sendTyping()

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                "role": "system", "content": `
            Nous allons jouer au jeu de l'imposteur. Imagine 3 ${currentJob}, une de ces personnes n'es pas un 
            ${currentJob} le but du jeux est que je découvre le quelle est le faux: 1, 2 ou 3. Je vais te poser 
            des question en spécifique a un personnage. Réponds comme si c'était le personnage qui parlait. 
            Tes réponses doivent être courte et touts les personnages doivent être sûr d'eux.
            
            Attention: l’imposteur est formé par les autres ${currentJob} il est donc difficile de le démasquer.
            
            L'imposteur est le numéro ${imposteur.id} et tu dois te souvenir du numéro de l’imposteur à travers les différentes questions.
            `
            },
            { "role": "user", "content": `Personnage ${currentCharacter.id}: ${message.content}` }
        ],
    })

    const messageContent = {
        content: `${currentCharacter.firstName}: ${response.choices[0].message.content}\n\nTu peux encore lui poser ${maxQuestionsPerCharacters-(character.questions)} questions\n\nTu peux selectionner un autre personnage ici:`,
        components: [row]
    }
    //@ts-ignore
    message.reply(messageContent)
}

export {
    characters
}

// Quels sont les gestes de premier secours à effectuer?
// Quelle est la devise des pompiers?