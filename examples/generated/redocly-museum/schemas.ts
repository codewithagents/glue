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

export const TicketTypeSchema = z.enum(['event', 'general'])

export const DateSchema = z.string()

export const EmailSchema = z.string().email()

export const TicketMessageSchema = z.string()

export const TicketIdSchema = z.string().uuid()

export const TicketConfirmationSchema = z.string()

export const TicketCodeImageSchema = z.string()

export const EventIdSchema = z.string().uuid()

export const EventNameSchema = z.string()

export const EventLocationSchema = z.string()

export const EventDescriptionSchema = z.string()

export const EventPriceSchema = z.number()

export const ErrorSchema = z.object({
  type: z.string().optional(),
  title: z.string().optional()
}).passthrough()

export const MuseumDailyHoursSchema = z.object({
  date: DateSchema,
  timeOpen: z.string().regex(new RegExp("^([01]\\d|2[0-3]):?([0-5]\\d)$")),
  timeClose: z.string().regex(new RegExp("^([01]\\d|2[0-3]):?([0-5]\\d)$"))
}).passthrough()

export const EventDatesSchema = z.array(DateSchema)

export const TicketSchema = z.object({
  ticketId: TicketIdSchema.optional(),
  ticketDate: DateSchema,
  ticketType: TicketTypeSchema,
  eventId: EventIdSchema.optional()
}).passthrough()

export const MuseumHoursSchema = z.array(MuseumDailyHoursSchema)

export const SpecialEventFieldsSchema = z.object({
  name: EventNameSchema.optional(),
  location: EventLocationSchema.optional(),
  eventDescription: EventDescriptionSchema.optional(),
  dates: EventDatesSchema.optional(),
  price: EventPriceSchema.optional()
}).passthrough()

export const SpecialEventSchema = z.object({
  eventId: EventIdSchema.optional(),
  name: EventNameSchema,
  location: EventLocationSchema,
  eventDescription: EventDescriptionSchema,
  dates: EventDatesSchema,
  price: EventPriceSchema
}).passthrough()

export const BuyMuseumTicketsSchema = z.object({
  email: EmailSchema.optional()
}).passthrough().and(TicketSchema)

export const MuseumTicketsConfirmationSchema = TicketSchema.and(z.object({
  message: TicketMessageSchema,
  confirmationCode: TicketConfirmationSchema
}).passthrough())

export const SpecialEventCollectionSchema = z.array(SpecialEventSchema)
