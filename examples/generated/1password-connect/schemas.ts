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

export const ErrorResponseSchema = z.object({
  status: z.number().optional(),
  message: z.string().optional()
}).passthrough()

export const FileSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  size: z.number().optional(),
  content_path: z.string().optional(),
  section: z.object({
  id: z.string().optional()
}).passthrough().optional(),
  content: z.string().optional()
}).passthrough()

export const VaultSchema = z.object({
  id: z.string().regex(new RegExp("^[\\da-z]{26}$")).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  attributeVersion: z.number().optional(),
  contentVersion: z.number().optional(),
  items: z.number().optional(),
  type: z.enum(['USER_CREATED', 'PERSONAL', 'EVERYONE', 'TRANSFER']).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
}).passthrough()

export const GeneratorRecipeSchema = z.object({
  length: z.number().min(1).max(64).optional(),
  characterSets: z.array(z.enum(['LETTERS', 'DIGITS', 'SYMBOLS'])).optional(),
  excludeCharacters: z.string().optional()
}).passthrough()

export const ItemSchema = z.object({
  id: z.string().regex(new RegExp("^[\\da-z]{26}$")).optional(),
  title: z.string().optional(),
  vault: z.object({
  id: z.string().regex(new RegExp("^[\\da-z]{26}$"))
}).passthrough(),
  category: z.enum(['LOGIN', 'PASSWORD', 'API_CREDENTIAL', 'SERVER', 'DATABASE', 'CREDIT_CARD', 'MEMBERSHIP', 'PASSPORT', 'SOFTWARE_LICENSE', 'OUTDOOR_LICENSE', 'SECURE_NOTE', 'WIRELESS_ROUTER', 'BANK_ACCOUNT', 'DRIVER_LICENSE', 'IDENTITY', 'REWARD_PROGRAM', 'DOCUMENT', 'EMAIL_ACCOUNT', 'SOCIAL_SECURITY_NUMBER', 'MEDICAL_RECORD', 'SSH_KEY', 'CUSTOM']),
  urls: z.array(z.object({
  label: z.string().optional(),
  primary: z.boolean().optional(),
  href: z.string().url()
}).passthrough()).optional(),
  favorite: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  version: z.number().optional(),
  state: z.enum(['ARCHIVED', 'DELETED']).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  lastEditedBy: z.string().optional()
}).passthrough()

export const APIRequestSchema = z.object({
  requestId: z.string().uuid().optional(),
  timestamp: z.string().optional(),
  action: z.enum(['READ', 'CREATE', 'UPDATE', 'DELETE']).optional(),
  result: z.enum(['SUCCESS', 'DENY']).optional(),
  actor: z.object({
  id: z.string().uuid().optional(),
  account: z.string().optional(),
  jti: z.string().optional(),
  userAgent: z.string().optional(),
  requestIp: z.string().optional()
}).passthrough().optional(),
  resource: z.object({
  type: z.enum(['ITEM', 'VAULT']).optional(),
  vault: z.object({
  id: z.string().regex(new RegExp("^[\\da-z]{26}$")).optional()
}).passthrough().optional(),
  item: z.object({
  id: z.string().regex(new RegExp("^[\\da-z]{26}$")).optional()
}).passthrough().optional(),
  itemVersion: z.number().optional()
}).passthrough().optional()
}).passthrough()

export const PatchSchema = z.array(z.object({
  op: z.enum(['add', 'remove', 'replace']),
  path: z.string(),
  value: z.record(z.string(), z.unknown()).optional()
}).passthrough())

export const ServiceDependencySchema = z.object({
  service: z.string().optional(),
  status: z.string().optional(),
  message: z.string().optional()
}).passthrough()

export const FieldSchema = z.object({
  id: z.string(),
  section: z.object({
  id: z.string().optional()
}).passthrough().optional(),
  type: z.enum(['STRING', 'EMAIL', 'CONCEALED', 'URL', 'TOTP', 'DATE', 'MONTH_YEAR', 'MENU']),
  purpose: z.enum(['', 'USERNAME', 'PASSWORD', 'NOTES']).optional(),
  label: z.string().optional(),
  value: z.string().optional(),
  generate: z.boolean().optional(),
  recipe: GeneratorRecipeSchema.optional(),
  entropy: z.number().optional()
}).passthrough()

export const FullItemSchema = ItemSchema.and(z.object({
  sections: z.array(z.object({
  id: z.string().optional(),
  label: z.string().optional()
}).passthrough()).optional(),
  fields: z.array(FieldSchema).optional(),
  files: z.array(FileSchema).optional()
}).passthrough())
