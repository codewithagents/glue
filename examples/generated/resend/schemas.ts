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

export const AttachmentSchema = z.object({
  content: z.string().optional(),
  filename: z.string().optional(),
  path: z.string().optional(),
  content_type: z.string().optional(),
  content_id: z.string().optional()
}).passthrough()

export const TagSchema = z.object({
  name: z.string().optional(),
  value: z.string().optional()
}).passthrough()

export const EmailTemplateInputSchema = z.object({
  id: z.string(),
  variables: z.record(z.string(), z.union([z.string(), z.number()])).optional()
}).passthrough()

export const SendEmailResponseSchema = z.object({
  id: z.string().optional()
}).passthrough()

export const UpdateEmailOptionsSchema = z.object({
  scheduled_at: z.string().optional()
}).passthrough()

export const EmailSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional(),
  to: z.array(z.string()).optional(),
  from: z.string().optional(),
  created_at: z.string().optional(),
  subject: z.string().optional(),
  html: z.string().optional(),
  text: z.string().optional(),
  bcc: z.array(z.string()).optional(),
  cc: z.array(z.string()).optional(),
  reply_to: z.array(z.string()).optional(),
  last_event: z.enum(['bounced', 'canceled', 'clicked', 'complained', 'delivered', 'delivery_delayed', 'failed', 'opened', 'queued', 'scheduled', 'sent', 'suppressed']).optional()
}).passthrough()

export const CreateBatchEmailsResponseSchema = z.object({
  data: z.array(z.object({
  id: z.string().optional()
}).passthrough()).optional()
}).passthrough()

export const DomainCapabilitiesSchema = z.object({
  sending: z.enum(['enabled', 'disabled']).optional(),
  receiving: z.enum(['enabled', 'disabled']).optional()
}).passthrough()

export const DomainRecordSchema = z.object({
  record: z.enum(['SPF', 'DKIM', 'Receiving', 'Tracking', 'TrackingCAA']).optional(),
  name: z.string().optional(),
  type: z.enum(['MX', 'TXT', 'CNAME', 'CAA']).optional(),
  ttl: z.string().optional(),
  status: z.enum(['pending', 'verified', 'failed', 'temporary_failure', 'not_started']).optional(),
  value: z.string().optional(),
  priority: z.number().optional()
}).passthrough()

export const VerifyDomainResponseSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional()
}).passthrough()

export const UpdateDomainResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional()
}).passthrough()

export const DeleteDomainResponseSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional(),
  deleted: z.boolean().optional()
}).passthrough()

export const CreateApiKeyRequestSchema = z.object({
  name: z.string(),
  permission: z.enum(['full_access', 'sending_access']).optional(),
  domain_id: z.string().optional()
}).passthrough()

export const CreateApiKeyResponseSchema = z.object({
  id: z.string().optional(),
  token: z.string().optional()
}).passthrough()

export const ApiKeySchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  created_at: z.string().optional(),
  last_used_at: z.string().nullable().optional()
}).passthrough()

export const DeleteApiKeyResponseSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional(),
  deleted: z.boolean().optional()
}).passthrough()

export const CreateAudienceOptionsSchema = z.object({
  name: z.string()
}).passthrough()

export const CreateAudienceResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional(),
  name: z.string().optional()
}).passthrough()

export const GetAudienceResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional(),
  name: z.string().optional(),
  created_at: z.string().optional()
}).passthrough()

export const RemoveAudienceResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional(),
  deleted: z.boolean().optional()
}).passthrough()

export const ListAudiencesResponseSuccessSchema = z.object({
  object: z.string().optional(),
  data: z.array(z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  created_at: z.string().optional()
}).passthrough()).optional()
}).passthrough()

export const CreateContactOptionsSchema = z.object({
  email: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  unsubscribed: z.boolean().optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
  segments: z.array(z.string()).optional(),
  topics: z.array(z.object({
  id: z.string().optional(),
  subscription: z.enum(['opt_in', 'opt_out']).optional()
}).passthrough()).optional(),
  audience_id: z.string().optional()
}).passthrough()

export const CreateContactResponseSuccessSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional()
}).passthrough()

export const GetContactResponseSuccessSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional(),
  email: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  created_at: z.string().optional(),
  unsubscribed: z.boolean().optional(),
  properties: z.record(z.string(), z.unknown()).optional()
}).passthrough()

export const UpdateContactOptionsSchema = z.object({
  email: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  unsubscribed: z.boolean().optional(),
  properties: z.record(z.string(), z.unknown()).optional()
}).passthrough()

export const UpdateContactResponseSuccessSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional()
}).passthrough()

export const RemoveContactResponseSuccessSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional(),
  deleted: z.boolean().optional()
}).passthrough()

export const ListContactsResponseSuccessSchema = z.object({
  object: z.string().optional(),
  data: z.array(z.object({
  id: z.string().optional(),
  email: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  created_at: z.string().optional(),
  unsubscribed: z.boolean().optional()
}).passthrough()).optional()
}).passthrough()

export const CreateBroadcastOptionsSchema = z.object({
  name: z.string().optional(),
  segment_id: z.string(),
  audience_id: z.string().optional(),
  from: z.string(),
  subject: z.string(),
  reply_to: z.array(z.string()).optional(),
  preview_text: z.string().optional(),
  html: z.string().optional(),
  text: z.string().optional(),
  topic_id: z.string().optional(),
  send: z.boolean().optional(),
  scheduled_at: z.string().optional()
}).passthrough()

export const CreateBroadcastResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional()
}).passthrough()

export const ListBroadcastsResponseSuccessSchema = z.object({
  object: z.string().optional(),
  has_more: z.boolean().optional(),
  data: z.array(z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  audience_id: z.string().optional(),
  segment_id: z.string().optional(),
  status: z.string().optional(),
  created_at: z.string().optional(),
  scheduled_at: z.string().optional(),
  sent_at: z.string().optional(),
  topic_id: z.string().optional()
}).passthrough()).optional()
}).passthrough()

export const GetBroadcastResponseSuccessSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  audience_id: z.string().nullable().optional(),
  segment_id: z.string().nullable().optional(),
  from: z.string().optional(),
  subject: z.string().optional(),
  reply_to: z.array(z.string()).optional(),
  preview_text: z.string().optional(),
  status: z.string().optional(),
  created_at: z.string().optional(),
  scheduled_at: z.string().optional(),
  sent_at: z.string().optional(),
  text: z.string().nullable().optional(),
  html: z.string().nullable().optional(),
  topic_id: z.string().nullable().optional()
}).passthrough()

export const UpdateBroadcastOptionsSchema = z.object({
  name: z.string().optional(),
  audience_id: z.string().optional(),
  segment_id: z.string().optional(),
  from: z.string().optional(),
  subject: z.string().optional(),
  reply_to: z.array(z.string()).optional(),
  preview_text: z.string().optional(),
  html: z.string().optional(),
  text: z.string().optional(),
  topic_id: z.string().optional()
}).passthrough()

export const UpdateBroadcastResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional()
}).passthrough()

export const RemoveBroadcastResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional(),
  deleted: z.boolean().optional()
}).passthrough()

export const SendBroadcastOptionsSchema = z.object({
  scheduled_at: z.string().optional()
}).passthrough()

export const SendBroadcastResponseSuccessSchema = z.object({
  id: z.string().optional()
}).passthrough()

export const RetrievedAttachmentSchema = z.object({
  object: z.string().optional(),
  id: z.string().uuid().optional(),
  filename: z.string().optional(),
  content_type: z.string().optional(),
  content_id: z.string().optional(),
  content_disposition: z.enum(['inline', 'attachment']).optional(),
  download_url: z.string().optional(),
  expires_at: z.string().optional(),
  size: z.number().optional()
}).passthrough()

export const ListAttachmentsResponseSchema = z.object({
  object: z.string().optional(),
  has_more: z.boolean().optional(),
  data: z.array(z.object({
  id: z.string().uuid().optional(),
  filename: z.string().optional(),
  content_type: z.string().optional(),
  content_id: z.string().optional(),
  content_disposition: z.enum(['inline', 'attachment']).optional(),
  download_url: z.string().optional(),
  expires_at: z.string().optional(),
  size: z.number().optional()
}).passthrough()).optional()
}).passthrough()

export const GetReceivedEmailResponseSchema = z.object({
  object: z.string().optional(),
  id: z.string().uuid().optional(),
  to: z.array(z.string()).optional(),
  from: z.string().optional(),
  subject: z.string().optional(),
  message_id: z.string().optional(),
  bcc: z.unknown().nullable().optional(),
  cc: z.unknown().nullable().optional(),
  reply_to: z.unknown().nullable().optional(),
  html: z.string().nullable().optional(),
  text: z.string().nullable().optional(),
  headers: z.unknown().nullable().optional(),
  created_at: z.string().optional(),
  attachments: z.array(z.object({
  id: z.string().uuid().optional(),
  filename: z.string().optional(),
  content_type: z.string().optional(),
  content_id: z.string().optional(),
  content_disposition: z.enum(['inline', 'attachment']).optional(),
  size: z.number().optional()
}).passthrough()).optional()
}).passthrough()

export const ListReceivedEmailsResponseSchema = z.object({
  object: z.string().optional(),
  has_more: z.boolean().optional(),
  data: z.array(z.object({
  id: z.string().uuid().optional(),
  to: z.array(z.string()).optional(),
  from: z.string().optional(),
  subject: z.string().nullable().optional(),
  message_id: z.string().optional(),
  bcc: z.unknown().nullable().optional(),
  cc: z.unknown().nullable().optional(),
  reply_to: z.unknown().nullable().optional(),
  created_at: z.string().optional(),
  attachments: z.array(z.object({
  id: z.string().uuid().optional(),
  filename: z.string().optional(),
  content_type: z.string().optional(),
  content_id: z.string().optional(),
  content_disposition: z.enum(['inline', 'attachment']).optional(),
  size: z.number().optional()
}).passthrough()).optional()
}).passthrough()).optional()
}).passthrough()

export const CreateWebhookRequestSchema = z.object({
  endpoint: z.string(),
  events: z.array(z.string()).min(1)
}).passthrough()

export const CreateWebhookResponseSchema = z.object({
  object: z.string().optional(),
  id: z.string().uuid().optional(),
  signing_secret: z.string().optional()
}).passthrough()

export const GetWebhookResponseSchema = z.object({
  object: z.string().optional(),
  id: z.string().uuid().optional(),
  endpoint: z.string().optional(),
  events: z.unknown().nullable().optional(),
  status: z.string().optional(),
  created_at: z.string().optional(),
  signing_secret: z.string().optional()
}).passthrough()

export const ListWebhooksResponseSchema = z.object({
  object: z.string().optional(),
  has_more: z.boolean().optional(),
  data: z.array(z.object({
  id: z.string().uuid().optional(),
  endpoint: z.string().optional(),
  events: z.unknown().nullable().optional(),
  status: z.string().optional(),
  created_at: z.string().optional()
}).passthrough()).optional()
}).passthrough()

export const UpdateWebhookRequestSchema = z.object({
  endpoint: z.string().optional(),
  events: z.array(z.string()).min(1).optional(),
  status: z.enum(['enabled', 'disabled']).optional()
}).passthrough()

export const UpdateWebhookResponseSchema = z.object({
  object: z.string().optional(),
  id: z.string().uuid().optional()
}).passthrough()

export const DeleteWebhookResponseSchema = z.object({
  object: z.string().optional(),
  id: z.string().uuid().optional(),
  deleted: z.boolean().optional()
}).passthrough()

export const TemplateVariableSchema = z.object({
  id: z.string().optional(),
  key: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'object', 'list']),
  fallback_value: z.union([z.string(), z.number(), z.boolean(), z.record(z.string(), z.unknown()), z.array(z.unknown())]).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
}).passthrough()

export const TemplateVariableInputSchema = z.object({
  key: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'object', 'list']),
  fallback_value: z.union([z.string(), z.number(), z.boolean(), z.record(z.string(), z.unknown()), z.array(z.unknown())]).optional()
}).passthrough()

export const TemplateListItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  published_at: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  alias: z.string().optional()
}).passthrough()

export const CreateTemplateResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional()
}).passthrough()

export const UpdateTemplateResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional()
}).passthrough()

export const RemoveTemplateResponseSuccessSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional(),
  deleted: z.boolean().optional()
}).passthrough()

export const PublishTemplateResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional()
}).passthrough()

export const DuplicateTemplateResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional()
}).passthrough()

export const CreateSegmentOptionsSchema = z.object({
  name: z.string(),
  audience_id: z.string().optional(),
  filter: z.record(z.string(), z.unknown()).optional()
}).passthrough()

export const CreateSegmentResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional()
}).passthrough()

export const GetSegmentResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional(),
  name: z.string().optional(),
  audience_id: z.string().optional(),
  filter: z.record(z.string(), z.unknown()).optional(),
  created_at: z.string().optional()
}).passthrough()

export const ListSegmentsResponseSuccessSchema = z.object({
  object: z.string().optional(),
  has_more: z.boolean().optional(),
  data: z.array(z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  audience_id: z.string().optional(),
  created_at: z.string().optional()
}).passthrough()).optional()
}).passthrough()

export const RemoveSegmentResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional(),
  deleted: z.boolean().optional()
}).passthrough()

export const CreateTopicOptionsSchema = z.object({
  name: z.string().max(50),
  default_subscription: z.enum(['opt_in', 'opt_out']),
  description: z.string().max(200).optional(),
  visibility: z.enum(['public', 'private']).optional()
}).passthrough()

export const CreateTopicResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional()
}).passthrough()

export const GetTopicResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  default_subscription: z.enum(['opt_in', 'opt_out']).optional(),
  visibility: z.enum(['public', 'private']).optional(),
  created_at: z.string().optional()
}).passthrough()

export const ListTopicsResponseSuccessSchema = z.object({
  object: z.string().optional(),
  has_more: z.boolean().optional(),
  data: z.array(z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  default_subscription: z.enum(['opt_in', 'opt_out']).optional(),
  visibility: z.enum(['public', 'private']).optional(),
  created_at: z.string().optional()
}).passthrough()).optional()
}).passthrough()

export const UpdateTopicOptionsSchema = z.object({
  name: z.string().max(50).optional(),
  description: z.string().max(200).optional(),
  visibility: z.enum(['public', 'private']).optional()
}).passthrough()

export const UpdateTopicResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional()
}).passthrough()

export const RemoveTopicResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional(),
  deleted: z.boolean().optional()
}).passthrough()

export const CreateContactPropertyOptionsSchema = z.object({
  key: z.string(),
  type: z.enum(['string', 'number']),
  fallback_value: z.union([z.string(), z.number()]).optional()
}).passthrough()

export const CreateContactPropertyResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional()
}).passthrough()

export const GetContactPropertyResponseSuccessSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional(),
  key: z.string().optional(),
  type: z.string().optional(),
  fallback_value: z.union([z.string(), z.number()]).optional(),
  created_at: z.string().optional()
}).passthrough()

export const ListContactPropertiesResponseSuccessSchema = z.object({
  object: z.string().optional(),
  has_more: z.boolean().optional(),
  data: z.array(z.object({
  id: z.string().optional(),
  key: z.string().optional(),
  type: z.string().optional(),
  fallback_value: z.union([z.string(), z.number()]).optional(),
  created_at: z.string().optional()
}).passthrough()).optional()
}).passthrough()

export const UpdateContactPropertyOptionsSchema = z.object({
  fallback_value: z.union([z.string(), z.number()]).optional()
}).passthrough()

export const UpdateContactPropertyResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional()
}).passthrough()

export const RemoveContactPropertyResponseSuccessSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional(),
  deleted: z.boolean().optional()
}).passthrough()

export const AddContactToSegmentResponseSuccessSchema = z.object({
  object: z.string().optional(),
  contact_id: z.string().optional(),
  segment_id: z.string().optional()
}).passthrough()

export const ListContactSegmentsResponseSuccessSchema = z.object({
  object: z.string().optional(),
  has_more: z.boolean().optional(),
  data: z.array(z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  created_at: z.string().optional()
}).passthrough()).optional()
}).passthrough()

export const RemoveContactFromSegmentResponseSuccessSchema = z.object({
  object: z.string().optional(),
  contact_id: z.string().optional(),
  segment_id: z.string().optional(),
  deleted: z.boolean().optional()
}).passthrough()

export const GetContactTopicsResponseSuccessSchema = z.object({
  object: z.string().optional(),
  has_more: z.boolean().optional(),
  data: z.array(z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  subscription: z.enum(['opt_in', 'opt_out']).optional()
}).passthrough()).optional()
}).passthrough()

export const UpdateContactTopicsOptionsSchema = z.object({
  topics: z.array(z.object({
  id: z.string().optional(),
  subscription: z.enum(['opt_in', 'opt_out']).optional()
}).passthrough())
}).passthrough()

export const UpdateContactTopicsResponseSuccessSchema = z.object({
  object: z.string().optional(),
  contact_id: z.string().optional(),
  topics: z.array(z.object({
  id: z.string().optional(),
  subscription: z.enum(['opt_in', 'opt_out']).optional()
}).passthrough()).optional()
}).passthrough()

export const LogSummarySchema = z.object({
  id: z.string().uuid().optional(),
  created_at: z.string().optional(),
  endpoint: z.string().optional(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']).optional(),
  response_status: z.number().optional(),
  user_agent: z.string().nullable().optional()
}).passthrough()

export const LogSchema = z.object({
  object: z.string().optional(),
  id: z.string().uuid().optional(),
  created_at: z.string().optional(),
  endpoint: z.string().optional(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']).optional(),
  response_status: z.number().optional(),
  user_agent: z.string().nullable().optional(),
  request_body: z.unknown().nullable().optional(),
  response_body: z.unknown().nullable().optional()
}).passthrough()

export const AutomationStepSchema = z.object({
  key: z.string(),
  type: z.enum(['trigger', 'send_email', 'delay', 'wait_for_event', 'condition', 'contact_update', 'contact_delete', 'add_to_segment']),
  config: z.record(z.string(), z.unknown())
}).passthrough()

export const AutomationStepResponseSchema = z.object({
  key: z.string().optional(),
  type: z.enum(['trigger', 'send_email', 'delay', 'wait_for_event', 'condition', 'contact_update', 'contact_delete', 'add_to_segment']).optional(),
  config: z.record(z.string(), z.unknown()).optional()
}).passthrough()

export const AutomationConnectionSchema = z.object({
  from: z.string(),
  to: z.string(),
  type: z.enum(['default', 'condition_met', 'condition_not_met', 'timeout', 'event_received']).optional()
}).passthrough()

export const CreateAutomationResponseSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional()
}).passthrough()

export const AutomationListItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  status: z.enum(['enabled', 'disabled']).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
}).passthrough()

export const PatchAutomationResponseSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional()
}).passthrough()

export const DeleteAutomationResponseSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional(),
  deleted: z.boolean().optional()
}).passthrough()

export const StopAutomationResponseSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional(),
  status: z.string().optional()
}).passthrough()

export const AutomationRunStepSchema = z.object({
  key: z.string().optional(),
  type: z.enum(['trigger', 'send_email', 'delay', 'wait_for_event', 'condition', 'contact_update', 'contact_delete', 'add_to_segment']).optional(),
  status: z.string().optional(),
  started_at: z.string().nullable().optional(),
  completed_at: z.string().nullable().optional(),
  output: z.unknown().nullable().optional(),
  error: z.unknown().nullable().optional(),
  created_at: z.string().optional()
}).passthrough()

export const AutomationRunListItemSchema = z.object({
  id: z.string().optional(),
  status: z.enum(['running', 'completed', 'failed', 'cancelled']).optional(),
  started_at: z.string().nullable().optional(),
  completed_at: z.string().nullable().optional(),
  created_at: z.string().optional()
}).passthrough()

export const EventSchema = z.object({
  object: z.string().optional(),
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  schema: z.unknown().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().nullable().optional()
}).passthrough()

export const EventSummarySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  schema: z.unknown().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().nullable().optional()
}).passthrough()

export const CreateEventRequestSchema = z.object({
  name: z.string(),
  schema: z.unknown().nullable().optional()
}).passthrough()

export const CreateEventResponseSchema = z.object({
  object: z.string().optional(),
  id: z.string().uuid().optional()
}).passthrough()

export const UpdateEventRequestSchema = z.object({
  schema: z.unknown().nullable()
}).passthrough()

export const UpdateEventResponseSchema = z.object({
  object: z.string().optional(),
  id: z.string().uuid().optional()
}).passthrough()

export const RemoveEventResponseSchema = z.object({
  object: z.string().optional(),
  id: z.string().uuid().optional(),
  deleted: z.boolean().optional()
}).passthrough()

export const SendEventRequestSchema = z.object({
  event: z.string(),
  contact_id: z.string().uuid().optional(),
  email: z.string().email().optional(),
  payload: z.record(z.string(), z.unknown()).optional()
}).passthrough()

export const SendEventResponseSchema = z.object({
  object: z.string().optional(),
  event: z.string().optional()
}).passthrough()

export const SendEmailRequestSchema = z.object({
  from: z.string(),
  to: z.union([z.string(), z.array(z.string()).min(1).max(50)]),
  subject: z.string(),
  bcc: z.union([z.string(), z.array(z.string())]).optional(),
  cc: z.union([z.string(), z.array(z.string())]).optional(),
  reply_to: z.union([z.string(), z.array(z.string())]).optional(),
  html: z.string().optional(),
  text: z.string().optional(),
  template: EmailTemplateInputSchema.and(z.unknown()).optional(),
  headers: z.record(z.string(), z.unknown()).optional(),
  scheduled_at: z.string().optional(),
  attachments: z.array(AttachmentSchema).optional(),
  tags: z.array(TagSchema).optional(),
  topic_id: z.string().optional()
}).passthrough()

export const ListEmailsResponseSchema = z.object({
  object: z.string().optional(),
  has_more: z.boolean().optional(),
  data: z.array(EmailSchema).optional()
}).passthrough()

export const CreateDomainRequestSchema = z.object({
  name: z.string(),
  region: z.enum(['us-east-1', 'eu-west-1', 'sa-east-1', 'ap-northeast-1']).optional(),
  custom_return_path: z.string().optional(),
  open_tracking: z.boolean().optional(),
  click_tracking: z.boolean().optional(),
  tls: z.enum(['opportunistic', 'enforced']).optional(),
  capabilities: DomainCapabilitiesSchema.optional(),
  tracking_subdomain: z.string().optional()
}).passthrough()

export const UpdateDomainOptionsSchema = z.object({
  open_tracking: z.boolean().optional(),
  click_tracking: z.boolean().optional(),
  tls: z.string().optional(),
  capabilities: DomainCapabilitiesSchema.optional(),
  tracking_subdomain: z.string().optional()
}).passthrough()

export const ListDomainsItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  status: z.enum(['pending', 'verified', 'failed', 'not_started', 'partially_verified', 'partially_failed']).optional(),
  created_at: z.string().optional(),
  region: z.string().optional(),
  capabilities: DomainCapabilitiesSchema.optional()
}).passthrough()

export const CreateDomainResponseSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  created_at: z.string().optional(),
  status: z.enum(['pending', 'verified', 'failed', 'not_started', 'partially_verified', 'partially_failed']).optional(),
  capabilities: DomainCapabilitiesSchema.optional(),
  records: z.array(DomainRecordSchema).optional(),
  region: z.string().optional(),
  open_tracking: z.boolean().optional(),
  click_tracking: z.boolean().optional(),
  tracking_subdomain: z.string().optional()
}).passthrough()

export const DomainSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  status: z.enum(['pending', 'verified', 'failed', 'not_started', 'partially_verified', 'partially_failed']).optional(),
  created_at: z.string().optional(),
  region: z.string().optional(),
  open_tracking: z.boolean().optional(),
  click_tracking: z.boolean().optional(),
  tracking_subdomain: z.string().optional(),
  capabilities: DomainCapabilitiesSchema.optional(),
  records: z.array(DomainRecordSchema).optional()
}).passthrough()

export const ListApiKeysResponseSchema = z.object({
  object: z.string().optional(),
  has_more: z.boolean().optional(),
  data: z.array(ApiKeySchema).optional()
}).passthrough()

export const TemplateSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional(),
  current_version_id: z.string().optional(),
  name: z.string().optional(),
  alias: z.string().optional(),
  from: z.string().optional(),
  subject: z.string().optional(),
  reply_to: z.unknown().nullable().optional(),
  html: z.string().optional(),
  text: z.string().optional(),
  variables: z.array(TemplateVariableSchema).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  published_at: z.string().nullable().optional(),
  has_unpublished_versions: z.boolean().optional()
}).passthrough()

export const CreateTemplateRequestSchema = z.object({
  name: z.string(),
  alias: z.string().optional(),
  from: z.string().optional(),
  subject: z.string().optional(),
  reply_to: z.array(z.string()).optional(),
  html: z.string(),
  text: z.string().optional(),
  variables: z.array(TemplateVariableInputSchema).optional()
}).passthrough()

export const UpdateTemplateOptionsSchema = z.object({
  name: z.string().optional(),
  alias: z.string().optional(),
  from: z.string().optional(),
  subject: z.string().optional(),
  reply_to: z.array(z.string()).optional(),
  html: z.string().optional(),
  text: z.string().optional(),
  variables: z.array(TemplateVariableInputSchema).optional()
}).passthrough()

export const ListTemplatesResponseSuccessSchema = z.object({
  object: z.string().optional(),
  data: z.array(TemplateListItemSchema).optional(),
  has_more: z.boolean().optional()
}).passthrough()

export const ListLogsResponseSchema = z.object({
  object: z.string().optional(),
  has_more: z.boolean().optional(),
  data: z.array(LogSummarySchema).optional()
}).passthrough()

export const CreateAutomationRequestSchema = z.object({
  name: z.string().min(1),
  status: z.enum(['enabled', 'disabled']).optional(),
  steps: z.array(AutomationStepSchema).min(1).max(150),
  connections: z.array(AutomationConnectionSchema)
}).passthrough()

export const AutomationSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  status: z.enum(['enabled', 'disabled']).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  steps: z.array(AutomationStepResponseSchema).optional(),
  connections: z.array(AutomationConnectionSchema).optional()
}).passthrough()

export const PatchAutomationRequestSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.enum(['enabled', 'disabled']).optional(),
  steps: z.array(AutomationStepSchema).min(1).max(150).optional(),
  connections: z.array(AutomationConnectionSchema).optional()
}).passthrough()

export const ListAutomationsResponseSchema = z.object({
  object: z.string().optional(),
  has_more: z.boolean().optional(),
  data: z.array(AutomationListItemSchema).optional()
}).passthrough()

export const AutomationRunSchema = z.object({
  object: z.string().optional(),
  id: z.string().optional(),
  status: z.enum(['running', 'completed', 'failed', 'cancelled']).optional(),
  started_at: z.string().nullable().optional(),
  completed_at: z.string().nullable().optional(),
  created_at: z.string().optional(),
  steps: z.array(AutomationRunStepSchema).optional()
}).passthrough()

export const ListAutomationRunsResponseSchema = z.object({
  object: z.string().optional(),
  has_more: z.boolean().optional(),
  data: z.array(AutomationRunListItemSchema).optional()
}).passthrough()

export const ListEventsResponseSchema = z.object({
  object: z.string().optional(),
  has_more: z.boolean().optional(),
  data: z.array(EventSummarySchema).optional()
}).passthrough()

export const ListDomainsResponseSchema = z.object({
  object: z.string().optional(),
  has_more: z.boolean().optional(),
  data: z.array(ListDomainsItemSchema).optional()
}).passthrough()
