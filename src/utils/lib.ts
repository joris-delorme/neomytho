import { maxCharacters } from "./constants"
import random_name from "node-random-name"

export function makeCharacters() {
    let characters: ICharacter[] = []
    for (let i = 0; i < maxCharacters; i++) {
        characters.push({
            id: `${i}`,
            questions: 0,
            firstName: random_name({ random: Math.random, first: true })
        })
    }
    return characters
}