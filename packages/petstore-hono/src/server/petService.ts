import { randomUUID } from 'node:crypto'
import type { PetstoreService } from '../../generated/service.js'
import type { Pet } from '../../generated/models.js'

const pets = new Map<string, Pet>()

export const petService: PetstoreService = {
  async listPets(params) {
    const all = Array.from(pets.values())
    if (params?.species) {
      return all.filter((p) => p.species.toLowerCase() === params.species!.toLowerCase())
    }
    return all
  },
  async createPet(body) {
    const pet: Pet = { id: randomUUID(), ...body }
    pets.set(pet.id, pet)
    return pet
  },
  async getPet(id) {
    const pet = pets.get(id)
    if (!pet) throw new Error(`Pet ${id} not found`)
    return pet
  },
  async deletePet(id) {
    pets.delete(id)
  },
}

/** Reset all pets — only used in dev/test environments */
export function resetPets(): void {
  pets.clear()
}
