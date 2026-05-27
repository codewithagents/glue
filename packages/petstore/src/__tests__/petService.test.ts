import { describe, it, expect, beforeEach } from 'vitest'
import { petService, resetPets } from '../server/petService.js'

beforeEach(() => {
  resetPets()
})

describe('listPets', () => {
  it('returns empty array initially', async () => {
    const pets = await petService.listPets()
    expect(pets).toEqual([])
  })

  it('returns all created pets', async () => {
    await petService.createPet({ name: 'Fluffy', species: 'cat' })
    await petService.createPet({ name: 'Rex', species: 'dog' })
    const pets = await petService.listPets()
    expect(pets).toHaveLength(2)
  })

  it('filters by species case-insensitively', async () => {
    await petService.createPet({ name: 'Fluffy', species: 'cat' })
    await petService.createPet({ name: 'Rex', species: 'dog' })
    const cats = await petService.listPets({ species: 'CAT' })
    expect(cats).toHaveLength(1)
    expect(cats[0].name).toBe('Fluffy')
  })
})

describe('createPet', () => {
  it('adds a pet and returns it with an id', async () => {
    const pet = await petService.createPet({ name: 'Whiskers', species: 'cat' })
    expect(pet.id).toBeTruthy()
    expect(pet.name).toBe('Whiskers')
    expect(pet.species).toBe('cat')
  })
})

describe('getPet', () => {
  it('returns a pet by id', async () => {
    const created = await petService.createPet({ name: 'Buddy', species: 'dog' })
    const fetched = await petService.getPet(created.id)
    expect(fetched).toEqual(created)
  })

  it('throws when id not found', async () => {
    await expect(petService.getPet('non-existent-id')).rejects.toThrow()
  })
})

describe('deletePet', () => {
  it('removes a pet', async () => {
    const pet = await petService.createPet({ name: 'Goldie', species: 'fish' })
    await petService.deletePet(pet.id)
    const pets = await petService.listPets()
    expect(pets).toHaveLength(0)
  })
})

describe('resetPets', () => {
  it('clears all state', async () => {
    await petService.createPet({ name: 'Fluffy', species: 'cat' })
    await petService.createPet({ name: 'Rex', species: 'dog' })
    resetPets()
    const pets = await petService.listPets()
    expect(pets).toEqual([])
  })
})
