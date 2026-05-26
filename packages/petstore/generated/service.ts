// This file is auto-generated. Do not edit manually.

import type { CreatePetRequest, Pet } from './models.js'

export interface PetstoreService {
  /** GET /pets */
  listPets(params?: { species?: string }): Promise<Pet[]>
  /** POST /pets */
  createPet(body: CreatePetRequest): Promise<Pet>
  /** GET /pets/{id} */
  getPet(id: string): Promise<Pet>
  /** DELETE /pets/{id} */
  deletePet(id: string): Promise<void>
}
