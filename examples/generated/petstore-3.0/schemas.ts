// Bootstrapped by @codewithagents/openapi-gen — this file is yours.
// Add error messages, refinements, and business rules freely.
// Re-running the generator will NOT overwrite this file.
// Requires zod v4 (z.record takes two args, z.lazy for circular refs).
//
// Object schemas include .passthrough() so new optional server fields are
// preserved when the API evolves — without breaking existing consumers.
//
// Form wizard pattern: extend API schemas for UI-only fields.
// The generated client strips unknown keys before sending, so extra form
// fields (step, confirmCheckbox, etc.) are never leaked to the backend:
//
//   export const CreateOrderFormSchema = CreateOrderSchema.extend({
//     step: z.number(),
//     confirmTerms: z.boolean(),
//   })
//
// Use CreateOrderFormSchema for React Hook Form validation, then pass the
// full form values to the generated client — it strips to API fields only.

import { z } from 'zod'

export const OrderSchema = z.object({
  id: z.number().optional(),
  petId: z.number().optional(),
  quantity: z.number().optional(),
  shipDate: z.string().optional(),
  status: z.enum(["placed", "approved", "delivered"]).optional(),
  complete: z.boolean().optional()
}).passthrough()

export const CategorySchema = z.object({
  id: z.number().optional(),
  name: z.string().optional()
}).passthrough()

export const UserSchema = z.object({
  id: z.number().optional(),
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
  userStatus: z.number().optional()
}).passthrough()

export const TagSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional()
}).passthrough()

export const ApiResponseSchema = z.object({
  code: z.number().optional(),
  type: z.string().optional(),
  message: z.string().optional()
}).passthrough()

export const PetSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  category: CategorySchema.optional(),
  photoUrls: z.array(z.string()),
  tags: z.array(TagSchema).optional(),
  status: z.enum(["available", "pending", "sold"]).optional()
}).passthrough()
