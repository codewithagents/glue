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

export const ErrorSchema = z.object({
  message: z.string().optional(),
  status: z.number().min(100).max(599).optional(),
  timestamp: z.string().optional()
}).passthrough()

export const HolidaySchema: z.ZodType = z.lazy(() => z.object({
  date: z.string(),
  federal: z.union([z.literal(1), z.literal(0)]),
  id: z.number().min(1).max(32),
  nameEn: z.string(),
  nameFr: z.string(),
  observedDate: z.string(),
  optional: z.union([z.literal(1)]).optional(),
  provinces: z.array(ProvinceSchema).optional()
}).passthrough())

export const ProvinceSchema: z.ZodType = z.lazy(() => z.object({
  id: z.enum(["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"]),
  nameEn: z.string(),
  nameFr: z.string(),
  nextHoliday: HolidaySchema.optional(),
  optional: z.union([z.literal(1)]).optional(),
  provinces: z.array(HolidaySchema).optional(),
  sourceEn: z.string(),
  sourceLink: z.string().regex(new RegExp("https+"))
}).passthrough())
