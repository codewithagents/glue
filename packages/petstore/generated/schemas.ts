// Bootstrapped by @codewithagents/openapi-gen — this file is yours.
// Add error messages, refinements, and business rules freely.
// Re-running the generator will NOT overwrite this file.
// Requires zod v4 (z.record takes two args, z.lazy for circular refs).

import { z } from 'zod'

export const PetSchema = z.object({
  id: z.string(),
  name: z.string(),
  species: z.string(),
}).passthrough()

export const CreatePetRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  species: z.string().min(1, 'Species is required'),
})
