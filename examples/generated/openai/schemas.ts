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

export const AddUploadPartRequestSchema = z.object({
  data: z.string()
}).passthrough()

export const AdminApiKeySchema = z.object({
  object: z.enum(["organization.admin_api_key"]),
  id: z.string(),
  name: z.union([z.string(), z.null()]).optional(),
  redacted_value: z.string(),
  created_at: z.number(),
  last_used_at: z.union([z.number(), z.null()]).optional(),
  owner: z.object({
  type: z.string().optional(),
  object: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  created_at: z.number().optional(),
  role: z.string().optional()
}).passthrough()
}).passthrough()

export const AssignedRoleDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.array(z.string()),
  resource_type: z.string(),
  predefined_role: z.boolean(),
  description: z.union([z.string(), z.null()]),
  created_at: z.union([z.number(), z.null()]),
  updated_at: z.union([z.number(), z.null()]),
  created_by: z.union([z.string(), z.null()]),
  created_by_user_obj: z.union([z.record(z.string(), z.unknown()), z.null()]),
  metadata: z.union([z.record(z.string(), z.unknown()), z.null()])
}).passthrough()

export const AssistantSupportedModelsSchema = z.enum(["gpt-5", "gpt-5-mini", "gpt-5-nano", "gpt-5-2025-08-07", "gpt-5-mini-2025-08-07", "gpt-5-nano-2025-08-07", "gpt-4.1", "gpt-4.1-mini", "gpt-4.1-nano", "gpt-4.1-2025-04-14", "gpt-4.1-mini-2025-04-14", "gpt-4.1-nano-2025-04-14", "o3-mini", "o3-mini-2025-01-31", "o1", "o1-2024-12-17", "gpt-4o", "gpt-4o-2024-11-20", "gpt-4o-2024-08-06", "gpt-4o-2024-05-13", "gpt-4o-mini", "gpt-4o-mini-2024-07-18", "gpt-4.5-preview", "gpt-4.5-preview-2025-02-27", "gpt-4-turbo", "gpt-4-turbo-2024-04-09", "gpt-4-0125-preview", "gpt-4-turbo-preview", "gpt-4-1106-preview", "gpt-4-vision-preview", "gpt-4", "gpt-4-0314", "gpt-4-0613", "gpt-4-32k", "gpt-4-32k-0314", "gpt-4-32k-0613", "gpt-3.5-turbo", "gpt-3.5-turbo-16k", "gpt-3.5-turbo-0613", "gpt-3.5-turbo-1106", "gpt-3.5-turbo-0125", "gpt-3.5-turbo-16k-0613"])

export const AssistantToolsCodeSchema = z.object({
  type: z.enum(["code_interpreter"])
}).passthrough()

export const AssistantToolsFileSearchTypeOnlySchema = z.object({
  type: z.enum(["file_search"])
}).passthrough()

export const AssistantsNamedToolChoiceSchema = z.object({
  type: z.enum(["function", "code_interpreter", "file_search"]),
  function: z.object({
  name: z.string()
}).passthrough().optional()
}).passthrough()

export const AudioResponseFormatSchema = z.enum(["json", "text", "srt", "verbose_json", "vtt", "diarized_json"])

export const AudioTranscriptionSchema = z.object({
  model: z.union([z.string(), z.enum(["whisper-1", "gpt-4o-mini-transcribe", "gpt-4o-mini-transcribe-2025-12-15", "gpt-4o-transcribe", "gpt-4o-transcribe-diarize", "gpt-realtime-whisper"])]).optional(),
  language: z.string().optional(),
  prompt: z.string().optional(),
  delay: z.enum(["minimal", "low", "medium", "high", "xhigh"]).optional()
}).passthrough()

export const AudioTranscriptionResponseSchema = z.object({
  model: z.union([z.string(), z.enum(["whisper-1", "gpt-4o-mini-transcribe", "gpt-4o-mini-transcribe-2025-12-15", "gpt-4o-transcribe", "gpt-4o-transcribe-diarize", "gpt-realtime-whisper"])]).optional(),
  language: z.string().optional(),
  prompt: z.string().optional()
}).passthrough()

export const AuditLogActorServiceAccountSchema = z.object({
  id: z.string().optional()
}).passthrough()

export const AuditLogActorUserSchema = z.object({
  id: z.string().optional(),
  email: z.string().optional()
}).passthrough()

export const AuditLogEventTypeSchema = z.enum(["api_key.created", "api_key.updated", "api_key.deleted", "certificate.created", "certificate.updated", "certificate.deleted", "certificates.activated", "certificates.deactivated", "checkpoint.permission.created", "checkpoint.permission.deleted", "external_key.registered", "external_key.removed", "group.created", "group.updated", "group.deleted", "invite.sent", "invite.accepted", "invite.deleted", "ip_allowlist.created", "ip_allowlist.updated", "ip_allowlist.deleted", "ip_allowlist.config.activated", "ip_allowlist.config.deactivated", "login.succeeded", "login.failed", "logout.succeeded", "logout.failed", "organization.updated", "project.created", "project.updated", "project.archived", "project.deleted", "rate_limit.updated", "rate_limit.deleted", "resource.deleted", "tunnel.created", "tunnel.updated", "tunnel.deleted", "role.created", "role.updated", "role.deleted", "role.assignment.created", "role.assignment.deleted", "scim.enabled", "scim.disabled", "service_account.created", "service_account.updated", "service_account.deleted", "user.added", "user.updated", "user.deleted"])

export const AutoChunkingStrategyRequestParamSchema = z.object({
  type: z.enum(["auto"])
}).passthrough()

export const BatchFileExpirationAfterSchema = z.object({
  anchor: z.enum(["created_at"]),
  seconds: z.number().min(3600).max(2592000)
}).passthrough()

export const CertificateSchema = z.object({
  object: z.enum(["certificate", "organization.certificate", "organization.project.certificate"]),
  id: z.string(),
  name: z.union([z.string(), z.null()]),
  created_at: z.number(),
  certificate_details: z.object({
  valid_at: z.number().optional(),
  expires_at: z.number().optional(),
  content: z.string().optional()
}).passthrough(),
  active: z.boolean().optional()
}).passthrough()

export const ChatCompletionAllowedToolsSchema = z.object({
  mode: z.enum(["auto", "required"]),
  tools: z.array(z.record(z.string(), z.unknown()))
}).passthrough()

export const ChatCompletionDeletedSchema = z.object({
  object: z.enum(["chat.completion.deleted"]),
  id: z.string(),
  deleted: z.boolean()
}).passthrough()

export const ChatCompletionFunctionCallOptionSchema = z.object({
  name: z.string()
}).passthrough()

export const ChatCompletionMessageCustomToolCallSchema = z.object({
  id: z.string(),
  type: z.enum(["custom"]),
  custom: z.object({
  name: z.string(),
  input: z.string()
}).passthrough()
}).passthrough()

export const ChatCompletionMessageToolCallSchema = z.object({
  id: z.string(),
  type: z.enum(["function"]),
  function: z.object({
  name: z.string(),
  arguments: z.string()
}).passthrough()
}).passthrough()

export const ChatCompletionMessageToolCallChunkSchema = z.object({
  index: z.number(),
  id: z.string().optional(),
  type: z.enum(["function"]).optional(),
  function: z.object({
  name: z.string().optional(),
  arguments: z.string().optional()
}).passthrough().optional()
}).passthrough()

export const ChatCompletionModalitiesSchema = z.union([z.array(z.enum(["text", "audio"])), z.null()])

export const ChatCompletionNamedToolChoiceSchema = z.object({
  type: z.enum(["function"]),
  function: z.object({
  name: z.string()
}).passthrough()
}).passthrough()

export const ChatCompletionNamedToolChoiceCustomSchema = z.object({
  type: z.enum(["custom"]),
  custom: z.object({
  name: z.string()
}).passthrough()
}).passthrough()

export const ChatCompletionRequestFunctionMessageSchema = z.object({
  role: z.enum(["function"]),
  content: z.union([z.string(), z.null()]),
  name: z.string()
}).passthrough()

export const ChatCompletionRequestMessageContentPartAudioSchema = z.object({
  type: z.enum(["input_audio"]),
  input_audio: z.object({
  data: z.string(),
  format: z.enum(["wav", "mp3"])
}).passthrough()
}).passthrough()

export const ChatCompletionRequestMessageContentPartFileSchema = z.object({
  type: z.enum(["file"]),
  file: z.object({
  filename: z.string().optional(),
  file_data: z.string().optional(),
  file_id: z.string().optional()
}).passthrough()
}).passthrough()

export const ChatCompletionRequestMessageContentPartImageSchema = z.object({
  type: z.enum(["image_url"]),
  image_url: z.object({
  url: z.string(),
  detail: z.enum(["auto", "low", "high"]).optional()
}).passthrough()
}).passthrough()

export const ChatCompletionRequestMessageContentPartRefusalSchema = z.object({
  type: z.enum(["refusal"]),
  refusal: z.string()
}).passthrough()

export const ChatCompletionRequestMessageContentPartTextSchema = z.object({
  type: z.enum(["text"]),
  text: z.string()
}).passthrough()

export const ChatCompletionRoleSchema = z.enum(["developer", "system", "user", "assistant", "tool", "function"])

export const ChatCompletionStreamOptionsSchema = z.union([z.object({
  include_usage: z.boolean().optional(),
  include_obfuscation: z.boolean().optional()
}).passthrough(), z.null()])

export const ChatCompletionTokenLogprobSchema = z.object({
  token: z.string(),
  logprob: z.number(),
  bytes: z.union([z.array(z.number()), z.null()]),
  top_logprobs: z.array(z.object({
  token: z.string(),
  logprob: z.number(),
  bytes: z.union([z.array(z.number()), z.null()])
}).passthrough())
}).passthrough()

export const CodeInterpreterFileOutputSchema = z.object({
  type: z.enum(["files"]),
  files: z.array(z.object({
  mime_type: z.string(),
  file_id: z.string()
}).passthrough())
}).passthrough()

export const CodeInterpreterTextOutputSchema = z.object({
  type: z.enum(["logs"]),
  logs: z.string()
}).passthrough()

export const ComparisonFilterSchema = z.object({
  type: z.enum(["eq", "ne", "gt", "gte", "lt", "lte", "in", "nin"]),
  key: z.string(),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.union([z.string(), z.number()]))])
}).passthrough()

export const CompleteUploadRequestSchema = z.object({
  part_ids: z.array(z.string()),
  md5: z.string().optional()
}).passthrough()

export const CompletionUsageSchema = z.object({
  completion_tokens: z.number(),
  prompt_tokens: z.number(),
  total_tokens: z.number(),
  completion_tokens_details: z.object({
  accepted_prediction_tokens: z.number().optional(),
  audio_tokens: z.number().optional(),
  reasoning_tokens: z.number().optional(),
  rejected_prediction_tokens: z.number().optional()
}).passthrough().optional(),
  prompt_tokens_details: z.object({
  audio_tokens: z.number().optional(),
  cached_tokens: z.number().optional()
}).passthrough().optional()
}).passthrough()

export const ComputerScreenshotImageSchema = z.object({
  type: z.enum(["computer_screenshot"]),
  image_url: z.string().optional(),
  file_id: z.string().optional()
}).passthrough()

export const ContainerFileResourceSchema = z.object({
  id: z.string(),
  object: z.string(),
  container_id: z.string(),
  created_at: z.number(),
  bytes: z.number(),
  path: z.string(),
  source: z.string()
}).passthrough()

export const ContainerResourceSchema = z.object({
  id: z.string(),
  object: z.string(),
  name: z.string(),
  created_at: z.number(),
  status: z.string(),
  last_active_at: z.number().optional(),
  expires_after: z.object({
  anchor: z.enum(["last_active_at"]).optional(),
  minutes: z.number().optional()
}).passthrough().optional(),
  memory_limit: z.enum(["1g", "4g", "16g", "64g"]).optional(),
  network_policy: z.object({
  type: z.enum(["allowlist", "disabled"]),
  allowed_domains: z.array(z.string()).optional()
}).passthrough().optional()
}).passthrough()

export const CostsResultSchema = z.object({
  object: z.enum(["organization.costs.result"]),
  amount: z.object({
  value: z.number().optional(),
  currency: z.string().optional()
}).passthrough().optional(),
  line_item: z.union([z.string(), z.null()]).optional(),
  project_id: z.union([z.string(), z.null()]).optional(),
  api_key_id: z.union([z.string(), z.null()]).optional(),
  quantity: z.union([z.number(), z.null()]).optional()
}).passthrough()

export const CreateContainerFileBodySchema = z.object({
  file_id: z.string().optional(),
  file: z.string().optional()
}).passthrough()

export const CreateEmbeddingRequestSchema = z.object({
  input: z.union([z.string(), z.array(z.string()).min(1).max(2048), z.array(z.number()).min(1).max(2048), z.array(z.array(z.number()).min(1)).min(1).max(2048)]),
  model: z.union([z.string(), z.enum(["text-embedding-ada-002", "text-embedding-3-small", "text-embedding-3-large"])]),
  encoding_format: z.enum(["float", "base64"]).optional(),
  dimensions: z.number().min(1).optional(),
  user: z.string().optional()
}).passthrough()

export const CreateEvalCustomDataSourceConfigSchema = z.object({
  type: z.enum(["custom"]),
  item_schema: z.record(z.string(), z.unknown()),
  include_sample_schema: z.boolean().optional()
}).passthrough()

export const CreateEvalLogsDataSourceConfigSchema = z.object({
  type: z.enum(["logs"]),
  metadata: z.record(z.string(), z.unknown()).optional()
}).passthrough()

export const CreateEvalStoredCompletionsDataSourceConfigSchema = z.object({
  type: z.enum(["stored_completions"]),
  metadata: z.record(z.string(), z.unknown()).optional()
}).passthrough()

export const CreateFineTuningCheckpointPermissionRequestSchema = z.object({
  project_ids: z.array(z.string())
}).passthrough()

export const CreateGroupBodySchema = z.object({
  name: z.string().min(1).max(255)
}).passthrough()

export const CreateGroupUserBodySchema = z.object({
  user_id: z.string()
}).passthrough()

export const CreateImageVariationRequestSchema = z.object({
  image: z.string(),
  model: z.union([z.string(), z.enum(["dall-e-2"])]).optional(),
  n: z.number().min(1).max(10).optional(),
  response_format: z.enum(["url", "b64_json"]).optional(),
  size: z.enum(["256x256", "512x512", "1024x1024"]).optional(),
  user: z.string().optional()
}).passthrough()

export const CreateModerationRequestSchema = z.object({
  input: z.union([z.string(), z.array(z.string()), z.array(z.union([z.object({
  type: z.enum(["image_url"]),
  image_url: z.object({
  url: z.string()
}).passthrough()
}).passthrough(), z.object({
  type: z.enum(["text"]),
  text: z.string()
}).passthrough()]))]),
  model: z.union([z.string(), z.enum(["omni-moderation-latest", "omni-moderation-2024-09-26", "text-moderation-latest", "text-moderation-stable"])]).optional()
}).passthrough()

export const CreateModerationResponseSchema = z.object({
  id: z.string(),
  model: z.string(),
  results: z.array(z.object({
  flagged: z.boolean(),
  categories: z.object({
  hate: z.boolean(),
  'hate/threatening': z.boolean(),
  harassment: z.boolean(),
  'harassment/threatening': z.boolean(),
  illicit: z.union([z.boolean(), z.null()]),
  'illicit/violent': z.union([z.boolean(), z.null()]),
  'self-harm': z.boolean(),
  'self-harm/intent': z.boolean(),
  'self-harm/instructions': z.boolean(),
  sexual: z.boolean(),
  'sexual/minors': z.boolean(),
  violence: z.boolean(),
  'violence/graphic': z.boolean()
}).passthrough(),
  category_scores: z.object({
  hate: z.number(),
  'hate/threatening': z.number(),
  harassment: z.number(),
  'harassment/threatening': z.number(),
  illicit: z.number(),
  'illicit/violent': z.number(),
  'self-harm': z.number(),
  'self-harm/intent': z.number(),
  'self-harm/instructions': z.number(),
  sexual: z.number(),
  'sexual/minors': z.number(),
  violence: z.number(),
  'violence/graphic': z.number()
}).passthrough(),
  category_applied_input_types: z.object({
  hate: z.array(z.enum(["text"])),
  'hate/threatening': z.array(z.enum(["text"])),
  harassment: z.array(z.enum(["text"])),
  'harassment/threatening': z.array(z.enum(["text"])),
  illicit: z.array(z.enum(["text"])),
  'illicit/violent': z.array(z.enum(["text"])),
  'self-harm': z.array(z.enum(["text", "image"])),
  'self-harm/intent': z.array(z.enum(["text", "image"])),
  'self-harm/instructions': z.array(z.enum(["text", "image"])),
  sexual: z.array(z.enum(["text", "image"])),
  'sexual/minors': z.array(z.enum(["text"])),
  violence: z.array(z.enum(["text", "image"])),
  'violence/graphic': z.array(z.enum(["text", "image"]))
}).passthrough()
}).passthrough())
}).passthrough()

export const CreateTranslationRequestSchema = z.object({
  file: z.string(),
  model: z.union([z.string(), z.enum(["whisper-1"])]),
  prompt: z.string().optional(),
  response_format: z.enum(["json", "text", "srt", "verbose_json", "vtt"]).optional(),
  temperature: z.number().optional()
}).passthrough()

export const CreateTranslationResponseJsonSchema = z.object({
  text: z.string()
}).passthrough()

export const CreateVoiceConsentRequestSchema = z.object({
  name: z.string(),
  recording: z.string(),
  language: z.string()
}).passthrough()

export const CreateVoiceRequestSchema = z.object({
  name: z.string(),
  audio_sample: z.string(),
  consent: z.string()
}).passthrough()

export const CustomToolCallSchema = z.object({
  type: z.enum(["custom_tool_call"]),
  id: z.string().optional(),
  call_id: z.string(),
  namespace: z.string().optional(),
  name: z.string(),
  input: z.string()
}).passthrough()

export const CustomToolChatCompletionsSchema = z.object({
  type: z.enum(["custom"]),
  custom: z.object({
  name: z.string(),
  description: z.string().optional(),
  format: z.union([z.object({
  type: z.enum(["text"])
}).passthrough(), z.object({
  type: z.enum(["grammar"]),
  grammar: z.object({
  definition: z.string(),
  syntax: z.enum(["lark", "regex"])
}).passthrough()
}).passthrough()]).optional()
}).passthrough()
}).passthrough()

export const DeleteAssistantResponseSchema = z.object({
  id: z.string(),
  deleted: z.boolean(),
  object: z.enum(["assistant.deleted"])
}).passthrough()

export const DeleteCertificateResponseSchema = z.object({
  object: z.enum(["certificate.deleted"]),
  id: z.string()
}).passthrough()

export const DeleteFileResponseSchema = z.object({
  id: z.string(),
  object: z.enum(["file"]),
  deleted: z.boolean()
}).passthrough()

export const DeleteFineTuningCheckpointPermissionResponseSchema = z.object({
  id: z.string(),
  object: z.enum(["checkpoint.permission"]),
  deleted: z.boolean()
}).passthrough()

export const DeleteMessageResponseSchema = z.object({
  id: z.string(),
  deleted: z.boolean(),
  object: z.enum(["thread.message.deleted"])
}).passthrough()

export const DeleteModelResponseSchema = z.object({
  id: z.string(),
  deleted: z.boolean(),
  object: z.string()
}).passthrough()

export const DeleteThreadResponseSchema = z.object({
  id: z.string(),
  deleted: z.boolean(),
  object: z.enum(["thread.deleted"])
}).passthrough()

export const DeleteVectorStoreFileResponseSchema = z.object({
  id: z.string(),
  deleted: z.boolean(),
  object: z.enum(["vector_store.file.deleted"])
}).passthrough()

export const DeleteVectorStoreResponseSchema = z.object({
  id: z.string(),
  deleted: z.boolean(),
  object: z.enum(["vector_store.deleted"])
}).passthrough()

export const DeletedRoleAssignmentResourceSchema = z.object({
  object: z.string(),
  deleted: z.boolean()
}).passthrough()

export const DoneEventSchema = z.object({
  event: z.enum(["done"]),
  data: z.enum(["[DONE]"])
}).passthrough()

export const EmbeddingSchema = z.object({
  index: z.number(),
  embedding: z.array(z.number()),
  object: z.enum(["embedding"])
}).passthrough()

export const ErrorSchema = z.object({
  code: z.union([z.string(), z.null()]),
  message: z.string(),
  param: z.union([z.string(), z.null()]),
  type: z.string()
}).passthrough()

export const EvalApiErrorSchema = z.object({
  code: z.string(),
  message: z.string()
}).passthrough()

export const EvalCustomDataSourceConfigSchema = z.object({
  type: z.enum(["custom"]),
  schema: z.record(z.string(), z.unknown())
}).passthrough()

export const EvalItemContentOutputTextSchema = z.object({
  type: z.enum(["output_text"]),
  text: z.string()
}).passthrough()

export const EvalItemContentTextSchema = z.string()

export const EvalItemInputImageSchema = z.object({
  type: z.enum(["input_image"]),
  image_url: z.string(),
  detail: z.string().optional()
}).passthrough()

export const EvalJsonlFileContentSourceSchema = z.object({
  type: z.enum(["file_content"]),
  content: z.array(z.object({
  item: z.record(z.string(), z.unknown()),
  sample: z.record(z.string(), z.unknown()).optional()
}).passthrough())
}).passthrough()

export const EvalJsonlFileIdSourceSchema = z.object({
  type: z.enum(["file_id"]),
  id: z.string()
}).passthrough()

export const EvalRunOutputItemResultSchema = z.object({
  name: z.string(),
  type: z.string().optional(),
  score: z.number(),
  passed: z.boolean(),
  sample: z.union([z.record(z.string(), z.unknown()), z.null()]).optional()
}).passthrough()

export const FileExpirationAfterSchema = z.object({
  anchor: z.enum(["created_at"]),
  seconds: z.number().min(3600).max(2592000)
}).passthrough()

export const FilePathSchema = z.object({
  type: z.enum(["file_path"]),
  file_id: z.string(),
  index: z.number()
}).passthrough()

export const FileSearchRankerSchema = z.enum(["auto", "default_2024_08_21"])

export const FineTuneDPOHyperparametersSchema = z.object({
  beta: z.union([z.enum(["auto"]), z.number().min(0).max(2)]).optional(),
  batch_size: z.union([z.enum(["auto"]), z.number().min(1).max(256)]).optional(),
  learning_rate_multiplier: z.union([z.enum(["auto"]), z.number().min(0)]).optional(),
  n_epochs: z.union([z.enum(["auto"]), z.number().min(1).max(50)]).optional()
}).passthrough()

export const FineTuneReinforcementHyperparametersSchema = z.object({
  batch_size: z.union([z.enum(["auto"]), z.number().min(1).max(256)]).optional(),
  learning_rate_multiplier: z.union([z.enum(["auto"]), z.number().min(0)]).optional(),
  n_epochs: z.union([z.enum(["auto"]), z.number().min(1).max(50)]).optional(),
  reasoning_effort: z.enum(["default", "low", "medium", "high"]).optional(),
  compute_multiplier: z.union([z.enum(["auto"]), z.number().min(0.00001).max(10)]).optional(),
  eval_interval: z.union([z.enum(["auto"]), z.number().min(1)]).optional(),
  eval_samples: z.union([z.enum(["auto"]), z.number().min(1)]).optional()
}).passthrough()

export const FineTuneSupervisedHyperparametersSchema = z.object({
  batch_size: z.union([z.enum(["auto"]), z.number().min(1).max(256)]).optional(),
  learning_rate_multiplier: z.union([z.enum(["auto"]), z.number().min(0)]).optional(),
  n_epochs: z.union([z.enum(["auto"]), z.number().min(1).max(50)]).optional()
}).passthrough()

export const FineTuningCheckpointPermissionSchema = z.object({
  id: z.string(),
  created_at: z.number(),
  project_id: z.string(),
  object: z.enum(["checkpoint.permission"])
}).passthrough()

export const FineTuningIntegrationSchema = z.object({
  type: z.enum(["wandb"]),
  wandb: z.object({
  project: z.string(),
  name: z.union([z.string(), z.null()]).optional(),
  entity: z.union([z.string(), z.null()]).optional(),
  tags: z.array(z.string()).optional()
}).passthrough()
}).passthrough()

export const FineTuningJobCheckpointSchema = z.object({
  id: z.string(),
  created_at: z.number(),
  fine_tuned_model_checkpoint: z.string(),
  step_number: z.number(),
  metrics: z.object({
  step: z.number().optional(),
  train_loss: z.number().optional(),
  train_mean_token_accuracy: z.number().optional(),
  valid_loss: z.number().optional(),
  valid_mean_token_accuracy: z.number().optional(),
  full_valid_loss: z.number().optional(),
  full_valid_mean_token_accuracy: z.number().optional()
}).passthrough(),
  fine_tuning_job_id: z.string(),
  object: z.enum(["fine_tuning.job.checkpoint"])
}).passthrough()

export const FineTuningJobEventSchema = z.object({
  object: z.enum(["fine_tuning.job.event"]),
  id: z.string(),
  created_at: z.number(),
  level: z.enum(["info", "warn", "error"]),
  message: z.string(),
  type: z.enum(["message", "metrics"]).optional(),
  data: z.record(z.string(), z.unknown()).optional()
}).passthrough()

export const FunctionParametersSchema = z.record(z.string(), z.unknown())

export const FunctionToolCallSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["function_call"]),
  call_id: z.string(),
  namespace: z.string().optional(),
  name: z.string(),
  arguments: z.string(),
  status: z.enum(["in_progress", "completed", "incomplete"]).optional()
}).passthrough()

export const GraderPythonSchema = z.object({
  type: z.enum(["python"]),
  name: z.string(),
  source: z.string(),
  image_tag: z.string().optional()
}).passthrough()

export const GraderStringCheckSchema = z.object({
  type: z.enum(["string_check"]),
  name: z.string(),
  input: z.string(),
  reference: z.string(),
  operation: z.enum(["eq", "ne", "like", "ilike"])
}).passthrough()

export const GraderTextSimilaritySchema = z.object({
  type: z.enum(["text_similarity"]),
  name: z.string(),
  input: z.string(),
  reference: z.string(),
  evaluation_metric: z.enum(["cosine", "fuzzy_match", "bleu", "gleu", "meteor", "rouge_1", "rouge_2", "rouge_3", "rouge_4", "rouge_5", "rouge_l"])
}).passthrough()

export const GroupSchema = z.object({
  object: z.enum(["group"]),
  id: z.string(),
  name: z.string(),
  created_at: z.number(),
  scim_managed: z.boolean()
}).passthrough()

export const GroupDeletedResourceSchema = z.object({
  object: z.enum(["group.deleted"]),
  id: z.string(),
  deleted: z.boolean()
}).passthrough()

export const GroupResourceWithSuccessSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.number(),
  is_scim_managed: z.boolean()
}).passthrough()

export const GroupResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.number(),
  is_scim_managed: z.boolean(),
  group_type: z.string()
}).passthrough()

export const GroupUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.union([z.string(), z.null()])
}).passthrough()

export const GroupUserAssignmentSchema = z.object({
  object: z.enum(["group.user"]),
  user_id: z.string(),
  group_id: z.string()
}).passthrough()

export const GroupUserDeletedResourceSchema = z.object({
  object: z.enum(["group.user.deleted"]),
  deleted: z.boolean()
}).passthrough()

export const ImageSchema = z.object({
  b64_json: z.string().optional(),
  url: z.string().optional(),
  revised_prompt: z.string().optional()
}).passthrough()

export const ImageEditPartialImageEventSchema = z.object({
  type: z.enum(["image_edit.partial_image"]),
  b64_json: z.string(),
  created_at: z.number(),
  size: z.enum(["1024x1024", "1024x1536", "1536x1024", "auto"]),
  quality: z.enum(["low", "medium", "high", "auto"]),
  background: z.enum(["transparent", "opaque", "auto"]),
  output_format: z.enum(["png", "webp", "jpeg"]),
  partial_image_index: z.number()
}).passthrough()

export const ImageGenPartialImageEventSchema = z.object({
  type: z.enum(["image_generation.partial_image"]),
  b64_json: z.string(),
  created_at: z.number(),
  size: z.enum(["1024x1024", "1024x1536", "1536x1024", "auto"]),
  quality: z.enum(["low", "medium", "high", "auto"]),
  background: z.enum(["transparent", "opaque", "auto"]),
  output_format: z.enum(["png", "webp", "jpeg"]),
  partial_image_index: z.number()
}).passthrough()

export const ImageGenToolCallSchema = z.object({
  type: z.enum(["image_generation_call"]),
  id: z.string(),
  status: z.enum(["in_progress", "completed", "generating", "failed"]),
  result: z.union([z.string(), z.null()])
}).passthrough()

export const ImageRefParamSchema = z.union([z.unknown(), z.unknown()])

export const ImagesUsageSchema = z.object({
  total_tokens: z.number(),
  input_tokens: z.number(),
  output_tokens: z.number(),
  input_tokens_details: z.object({
  text_tokens: z.number(),
  image_tokens: z.number()
}).passthrough()
}).passthrough()

export const InputAudioSchema = z.object({
  type: z.enum(["input_audio"]),
  input_audio: z.object({
  data: z.string(),
  format: z.enum(["mp3", "wav"])
}).passthrough()
}).passthrough()

export const InviteSchema = z.object({
  object: z.enum(["organization.invite"]),
  id: z.string(),
  email: z.string(),
  role: z.enum(["owner", "reader"]),
  status: z.enum(["accepted", "expired", "pending"]),
  created_at: z.number(),
  expires_at: z.union([z.number(), z.null()]).optional(),
  accepted_at: z.union([z.number(), z.null()]).optional(),
  projects: z.array(z.object({
  id: z.string(),
  role: z.enum(["member", "owner"])
}).passthrough())
}).passthrough()

export const InviteDeleteResponseSchema = z.object({
  object: z.enum(["organization.invite.deleted"]),
  id: z.string(),
  deleted: z.boolean()
}).passthrough()

export const InviteProjectGroupBodySchema = z.object({
  group_id: z.string(),
  role: z.string()
}).passthrough()

export const InviteRequestSchema = z.object({
  email: z.string(),
  role: z.enum(["reader", "owner"]),
  projects: z.array(z.object({
  id: z.string(),
  role: z.enum(["member", "owner"])
}).passthrough()).optional()
}).passthrough()

export const LocalShellToolCallOutputSchema = z.object({
  type: z.enum(["local_shell_call_output"]),
  id: z.string(),
  output: z.string(),
  status: z.union([z.enum(["in_progress", "completed", "incomplete"]), z.null()]).optional()
}).passthrough()

export const LogProbPropertiesSchema = z.object({
  token: z.string(),
  logprob: z.number(),
  bytes: z.array(z.number())
}).passthrough()

export const MCPApprovalRequestSchema = z.object({
  type: z.enum(["mcp_approval_request"]),
  id: z.string(),
  server_label: z.string(),
  name: z.string(),
  arguments: z.string()
}).passthrough()

export const MCPApprovalResponseSchema = z.object({
  type: z.enum(["mcp_approval_response"]),
  id: z.union([z.string(), z.null()]).optional(),
  approval_request_id: z.string(),
  approve: z.boolean(),
  reason: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const MCPApprovalResponseResourceSchema = z.object({
  type: z.enum(["mcp_approval_response"]),
  id: z.string(),
  approval_request_id: z.string(),
  approve: z.boolean(),
  reason: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const MCPListToolsToolSchema = z.object({
  name: z.string(),
  description: z.union([z.string(), z.null()]).optional(),
  input_schema: z.record(z.string(), z.unknown()),
  annotations: z.union([z.record(z.string(), z.unknown()), z.null()]).optional()
}).passthrough()

export const MCPToolFilterSchema = z.object({
  tool_names: z.array(z.string()).optional(),
  read_only: z.boolean().optional()
}).passthrough()

export const MessageContentImageFileObjectSchema = z.object({
  type: z.enum(["image_file"]),
  image_file: z.object({
  file_id: z.string(),
  detail: z.enum(["auto", "low", "high"]).optional()
}).passthrough()
}).passthrough()

export const MessageContentImageUrlObjectSchema = z.object({
  type: z.enum(["image_url"]),
  image_url: z.object({
  url: z.string(),
  detail: z.enum(["auto", "low", "high"]).optional()
}).passthrough()
}).passthrough()

export const MessageContentRefusalObjectSchema = z.object({
  type: z.enum(["refusal"]),
  refusal: z.string()
}).passthrough()

export const MessageContentTextAnnotationsFileCitationObjectSchema = z.object({
  type: z.enum(["file_citation"]),
  text: z.string(),
  file_citation: z.object({
  file_id: z.string()
}).passthrough(),
  start_index: z.number().min(0),
  end_index: z.number().min(0)
}).passthrough()

export const MessageContentTextAnnotationsFilePathObjectSchema = z.object({
  type: z.enum(["file_path"]),
  text: z.string(),
  file_path: z.object({
  file_id: z.string()
}).passthrough(),
  start_index: z.number().min(0),
  end_index: z.number().min(0)
}).passthrough()

export const MessageDeltaContentImageFileObjectSchema = z.object({
  index: z.number(),
  type: z.enum(["image_file"]),
  image_file: z.object({
  file_id: z.string().optional(),
  detail: z.enum(["auto", "low", "high"]).optional()
}).passthrough().optional()
}).passthrough()

export const MessageDeltaContentImageUrlObjectSchema = z.object({
  index: z.number(),
  type: z.enum(["image_url"]),
  image_url: z.object({
  url: z.string().optional(),
  detail: z.enum(["auto", "low", "high"]).optional()
}).passthrough().optional()
}).passthrough()

export const MessageDeltaContentRefusalObjectSchema = z.object({
  index: z.number(),
  type: z.enum(["refusal"]),
  refusal: z.string().optional()
}).passthrough()

export const MessageDeltaContentTextAnnotationsFileCitationObjectSchema = z.object({
  index: z.number(),
  type: z.enum(["file_citation"]),
  text: z.string().optional(),
  file_citation: z.object({
  file_id: z.string().optional(),
  quote: z.string().optional()
}).passthrough().optional(),
  start_index: z.number().min(0).optional(),
  end_index: z.number().min(0).optional()
}).passthrough()

export const MessageDeltaContentTextAnnotationsFilePathObjectSchema = z.object({
  index: z.number(),
  type: z.enum(["file_path"]),
  text: z.string().optional(),
  file_path: z.object({
  file_id: z.string().optional()
}).passthrough().optional(),
  start_index: z.number().min(0).optional(),
  end_index: z.number().min(0).optional()
}).passthrough()

export const MessagePhaseSchema = z.enum(["commentary", "final_answer"])

export const MessageRequestContentTextObjectSchema = z.object({
  type: z.enum(["text"]),
  text: z.string()
}).passthrough()

export const MetadataSchema = z.union([z.record(z.string(), z.string()), z.null()])

export const ModelSchema = z.unknown()

export const ModelIdsSharedSchema = z.union([z.string(), z.enum(["gpt-5.4", "gpt-5.4-mini", "gpt-5.4-nano", "gpt-5.4-mini-2026-03-17", "gpt-5.4-nano-2026-03-17", "gpt-5.3-chat-latest", "gpt-5.2", "gpt-5.2-2025-12-11", "gpt-5.2-chat-latest", "gpt-5.2-pro", "gpt-5.2-pro-2025-12-11", "gpt-5.1", "gpt-5.1-2025-11-13", "gpt-5.1-codex", "gpt-5.1-mini", "gpt-5.1-chat-latest", "gpt-5", "gpt-5-mini", "gpt-5-nano", "gpt-5-2025-08-07", "gpt-5-mini-2025-08-07", "gpt-5-nano-2025-08-07", "gpt-5-chat-latest", "gpt-4.1", "gpt-4.1-mini", "gpt-4.1-nano", "gpt-4.1-2025-04-14", "gpt-4.1-mini-2025-04-14", "gpt-4.1-nano-2025-04-14", "o4-mini", "o4-mini-2025-04-16", "o3", "o3-2025-04-16", "o3-mini", "o3-mini-2025-01-31", "o1", "o1-2024-12-17", "o1-preview", "o1-preview-2024-09-12", "o1-mini", "o1-mini-2024-09-12", "gpt-4o", "gpt-4o-2024-11-20", "gpt-4o-2024-08-06", "gpt-4o-2024-05-13", "gpt-4o-audio-preview", "gpt-4o-audio-preview-2024-10-01", "gpt-4o-audio-preview-2024-12-17", "gpt-4o-audio-preview-2025-06-03", "gpt-4o-mini-audio-preview", "gpt-4o-mini-audio-preview-2024-12-17", "gpt-4o-search-preview", "gpt-4o-mini-search-preview", "gpt-4o-search-preview-2025-03-11", "gpt-4o-mini-search-preview-2025-03-11", "chatgpt-4o-latest", "codex-mini-latest", "gpt-4o-mini", "gpt-4o-mini-2024-07-18", "gpt-4-turbo", "gpt-4-turbo-2024-04-09", "gpt-4-0125-preview", "gpt-4-turbo-preview", "gpt-4-1106-preview", "gpt-4-vision-preview", "gpt-4", "gpt-4-0314", "gpt-4-0613", "gpt-4-32k", "gpt-4-32k-0314", "gpt-4-32k-0613", "gpt-3.5-turbo", "gpt-3.5-turbo-16k", "gpt-3.5-turbo-0301", "gpt-3.5-turbo-0613", "gpt-3.5-turbo-1106", "gpt-3.5-turbo-0125", "gpt-3.5-turbo-16k-0613"])])

export const ModifyCertificateRequestSchema = z.object({
  name: z.string().optional()
}).passthrough()

export const NoiseReductionTypeSchema = z.enum(["near_field", "far_field"])

export const OpenAIFileSchema = z.unknown()

export const OrganizationCertificateSchema = z.object({
  object: z.enum(["organization.certificate"]),
  id: z.string(),
  name: z.union([z.string(), z.null()]),
  created_at: z.number(),
  certificate_details: z.object({
  valid_at: z.number().optional(),
  expires_at: z.number().optional()
}).passthrough(),
  active: z.boolean()
}).passthrough()

export const OrganizationProjectCertificateSchema = z.object({
  object: z.enum(["organization.project.certificate"]),
  id: z.string(),
  name: z.union([z.string(), z.null()]),
  created_at: z.number(),
  certificate_details: z.object({
  valid_at: z.number().optional(),
  expires_at: z.number().optional()
}).passthrough(),
  active: z.boolean()
}).passthrough()

export const OtherChunkingStrategyResponseParamSchema = z.object({
  type: z.enum(["other"])
}).passthrough()

export const OutputAudioSchema = z.object({
  type: z.enum(["output_audio"]),
  data: z.string(),
  transcript: z.string()
}).passthrough()

export const ParallelToolCallsSchema = z.boolean()

export const PartialImagesSchema = z.union([z.number().min(0).max(3), z.null()])

export const ProjectSchema = z.object({
  id: z.string(),
  object: z.enum(["organization.project"]),
  name: z.union([z.string(), z.null()]).optional(),
  created_at: z.number(),
  archived_at: z.union([z.number(), z.null()]).optional(),
  status: z.union([z.string(), z.null()]).optional(),
  external_key_id: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const ProjectApiKeyDeleteResponseSchema = z.object({
  object: z.enum(["organization.project.api_key.deleted"]),
  id: z.string(),
  deleted: z.boolean()
}).passthrough()

export const ProjectApiKeyOwnerServiceAccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.number(),
  role: z.string()
}).passthrough()

export const ProjectApiKeyOwnerUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  created_at: z.number(),
  role: z.string()
}).passthrough()

export const ProjectCreateRequestSchema = z.object({
  name: z.string(),
  geography: z.union([z.string(), z.null()]).optional(),
  external_key_id: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const ProjectGroupSchema = z.object({
  object: z.enum(["project.group"]),
  project_id: z.string(),
  group_id: z.string(),
  group_name: z.string(),
  group_type: z.string(),
  created_at: z.number()
}).passthrough()

export const ProjectGroupDeletedResourceSchema = z.object({
  object: z.enum(["project.group.deleted"]),
  deleted: z.boolean()
}).passthrough()

export const ProjectRateLimitSchema = z.object({
  object: z.enum(["project.rate_limit"]),
  id: z.string(),
  model: z.string(),
  max_requests_per_1_minute: z.number(),
  max_tokens_per_1_minute: z.number(),
  max_images_per_1_minute: z.number().optional(),
  max_audio_megabytes_per_1_minute: z.number().optional(),
  max_requests_per_1_day: z.number().optional(),
  batch_1_day_max_input_tokens: z.number().optional()
}).passthrough()

export const ProjectRateLimitUpdateRequestSchema = z.object({
  max_requests_per_1_minute: z.number().optional(),
  max_tokens_per_1_minute: z.number().optional(),
  max_images_per_1_minute: z.number().optional(),
  max_audio_megabytes_per_1_minute: z.number().optional(),
  max_requests_per_1_day: z.number().optional(),
  batch_1_day_max_input_tokens: z.number().optional()
}).passthrough()

export const ProjectServiceAccountSchema = z.object({
  object: z.enum(["organization.project.service_account"]),
  id: z.string(),
  name: z.string(),
  role: z.enum(["owner", "member"]),
  created_at: z.number()
}).passthrough()

export const ProjectServiceAccountApiKeySchema = z.object({
  object: z.enum(["organization.project.service_account.api_key"]),
  value: z.string(),
  name: z.string(),
  created_at: z.number(),
  id: z.string()
}).passthrough()

export const ProjectServiceAccountCreateRequestSchema = z.object({
  name: z.string()
}).passthrough()

export const ProjectServiceAccountDeleteResponseSchema = z.object({
  object: z.enum(["organization.project.service_account.deleted"]),
  id: z.string(),
  deleted: z.boolean()
}).passthrough()

export const ProjectUpdateRequestSchema = z.object({
  name: z.union([z.string(), z.null()]).optional(),
  external_key_id: z.union([z.string(), z.null()]).optional(),
  geography: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const ProjectUserSchema = z.object({
  object: z.enum(["organization.project.user"]),
  id: z.string(),
  name: z.union([z.string(), z.null()]).optional(),
  email: z.union([z.string(), z.null()]).optional(),
  role: z.string(),
  added_at: z.number()
}).passthrough()

export const ProjectUserCreateRequestSchema = z.object({
  user_id: z.union([z.string(), z.null()]).optional(),
  email: z.union([z.string(), z.null()]).optional(),
  role: z.string()
}).passthrough()

export const ProjectUserDeleteResponseSchema = z.object({
  object: z.enum(["organization.project.user.deleted"]),
  id: z.string(),
  deleted: z.boolean()
}).passthrough()

export const ProjectUserUpdateRequestSchema = z.object({
  role: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const PublicAssignOrganizationGroupRoleBodySchema = z.object({
  role_id: z.string()
}).passthrough()

export const PublicCreateOrganizationRoleBodySchema = z.object({
  role_name: z.string(),
  permissions: z.array(z.string()),
  description: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const PublicUpdateOrganizationRoleBodySchema = z.object({
  permissions: z.union([z.array(z.string()), z.null()]).optional(),
  description: z.union([z.string(), z.null()]).optional(),
  role_name: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const RealtimeAudioFormatsSchema = z.union([z.object({
  type: z.enum(["audio/pcm"]).optional(),
  rate: z.union([z.literal(24000)]).optional()
}).passthrough(), z.object({
  type: z.enum(["audio/pcmu"]).optional()
}).passthrough(), z.object({
  type: z.enum(["audio/pcma"]).optional()
}).passthrough()])

export const RealtimeBetaClientEventConversationItemDeleteSchema = z.object({
  event_id: z.string().optional(),
  type: z.enum(["conversation.item.delete"]),
  item_id: z.string()
}).passthrough()

export const RealtimeBetaClientEventConversationItemRetrieveSchema = z.object({
  event_id: z.string().optional(),
  type: z.enum(["conversation.item.retrieve"]),
  item_id: z.string()
}).passthrough()

export const RealtimeBetaClientEventConversationItemTruncateSchema = z.object({
  event_id: z.string().optional(),
  type: z.enum(["conversation.item.truncate"]),
  item_id: z.string(),
  content_index: z.number(),
  audio_end_ms: z.number()
}).passthrough()

export const RealtimeBetaClientEventInputAudioBufferAppendSchema = z.object({
  event_id: z.string().optional(),
  type: z.enum(["input_audio_buffer.append"]),
  audio: z.string()
}).passthrough()

export const RealtimeBetaClientEventInputAudioBufferClearSchema = z.object({
  event_id: z.string().optional(),
  type: z.enum(["input_audio_buffer.clear"])
}).passthrough()

export const RealtimeBetaClientEventInputAudioBufferCommitSchema = z.object({
  event_id: z.string().optional(),
  type: z.enum(["input_audio_buffer.commit"])
}).passthrough()

export const RealtimeBetaClientEventOutputAudioBufferClearSchema = z.object({
  event_id: z.string().optional(),
  type: z.enum(["output_audio_buffer.clear"])
}).passthrough()

export const RealtimeBetaClientEventResponseCancelSchema = z.object({
  event_id: z.string().optional(),
  type: z.enum(["response.cancel"]),
  response_id: z.string().optional()
}).passthrough()

export const RealtimeBetaServerEventConversationItemDeletedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.deleted"]),
  item_id: z.string()
}).passthrough()

export const RealtimeBetaServerEventConversationItemInputAudioTranscriptionFailedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.input_audio_transcription.failed"]),
  item_id: z.string(),
  content_index: z.number(),
  error: z.object({
  type: z.string().optional(),
  code: z.string().optional(),
  message: z.string().optional(),
  param: z.string().optional()
}).passthrough()
}).passthrough()

export const RealtimeBetaServerEventConversationItemInputAudioTranscriptionSegmentSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.input_audio_transcription.segment"]),
  item_id: z.string(),
  content_index: z.number(),
  text: z.string(),
  id: z.string(),
  speaker: z.string(),
  start: z.number(),
  end: z.number()
}).passthrough()

export const RealtimeBetaServerEventConversationItemTruncatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.truncated"]),
  item_id: z.string(),
  content_index: z.number(),
  audio_end_ms: z.number()
}).passthrough()

export const RealtimeBetaServerEventErrorSchema = z.object({
  event_id: z.string(),
  type: z.enum(["error"]),
  error: z.object({
  type: z.string(),
  code: z.union([z.string(), z.null()]).optional(),
  message: z.string(),
  param: z.union([z.string(), z.null()]).optional(),
  event_id: z.union([z.string(), z.null()]).optional()
}).passthrough()
}).passthrough()

export const RealtimeBetaServerEventInputAudioBufferClearedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["input_audio_buffer.cleared"])
}).passthrough()

export const RealtimeBetaServerEventInputAudioBufferCommittedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["input_audio_buffer.committed"]),
  previous_item_id: z.union([z.string(), z.null()]).optional(),
  item_id: z.string()
}).passthrough()

export const RealtimeBetaServerEventInputAudioBufferSpeechStartedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["input_audio_buffer.speech_started"]),
  audio_start_ms: z.number(),
  item_id: z.string()
}).passthrough()

export const RealtimeBetaServerEventInputAudioBufferSpeechStoppedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["input_audio_buffer.speech_stopped"]),
  audio_end_ms: z.number(),
  item_id: z.string()
}).passthrough()

export const RealtimeBetaServerEventMCPListToolsCompletedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["mcp_list_tools.completed"]),
  item_id: z.string()
}).passthrough()

export const RealtimeBetaServerEventMCPListToolsFailedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["mcp_list_tools.failed"]),
  item_id: z.string()
}).passthrough()

export const RealtimeBetaServerEventMCPListToolsInProgressSchema = z.object({
  event_id: z.string(),
  type: z.enum(["mcp_list_tools.in_progress"]),
  item_id: z.string()
}).passthrough()

export const RealtimeBetaServerEventRateLimitsUpdatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["rate_limits.updated"]),
  rate_limits: z.array(z.object({
  name: z.enum(["requests", "tokens"]).optional(),
  limit: z.number().optional(),
  remaining: z.number().optional(),
  reset_seconds: z.number().optional()
}).passthrough())
}).passthrough()

export const RealtimeBetaServerEventResponseAudioDeltaSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.output_audio.delta"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  delta: z.string()
}).passthrough()

export const RealtimeBetaServerEventResponseAudioDoneSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.output_audio.done"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number()
}).passthrough()

export const RealtimeBetaServerEventResponseAudioTranscriptDeltaSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.output_audio_transcript.delta"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  delta: z.string()
}).passthrough()

export const RealtimeBetaServerEventResponseAudioTranscriptDoneSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.output_audio_transcript.done"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  transcript: z.string()
}).passthrough()

export const RealtimeBetaServerEventResponseContentPartAddedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.content_part.added"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  part: z.object({
  type: z.enum(["audio", "text"]).optional(),
  text: z.string().optional(),
  audio: z.string().optional(),
  transcript: z.string().optional()
}).passthrough()
}).passthrough()

export const RealtimeBetaServerEventResponseContentPartDoneSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.content_part.done"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  part: z.object({
  type: z.enum(["audio", "text"]).optional(),
  text: z.string().optional(),
  audio: z.string().optional(),
  transcript: z.string().optional()
}).passthrough()
}).passthrough()

export const RealtimeBetaServerEventResponseFunctionCallArgumentsDeltaSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.function_call_arguments.delta"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  call_id: z.string(),
  delta: z.string()
}).passthrough()

export const RealtimeBetaServerEventResponseFunctionCallArgumentsDoneSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.function_call_arguments.done"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  call_id: z.string(),
  name: z.string(),
  arguments: z.string()
}).passthrough()

export const RealtimeBetaServerEventResponseMCPCallArgumentsDeltaSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.mcp_call_arguments.delta"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  delta: z.string(),
  obfuscation: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const RealtimeBetaServerEventResponseMCPCallArgumentsDoneSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.mcp_call_arguments.done"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  arguments: z.string()
}).passthrough()

export const RealtimeBetaServerEventResponseMCPCallCompletedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.mcp_call.completed"]),
  output_index: z.number(),
  item_id: z.string()
}).passthrough()

export const RealtimeBetaServerEventResponseMCPCallFailedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.mcp_call.failed"]),
  output_index: z.number(),
  item_id: z.string()
}).passthrough()

export const RealtimeBetaServerEventResponseMCPCallInProgressSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.mcp_call.in_progress"]),
  output_index: z.number(),
  item_id: z.string()
}).passthrough()

export const RealtimeBetaServerEventResponseTextDeltaSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.output_text.delta"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  delta: z.string()
}).passthrough()

export const RealtimeBetaServerEventResponseTextDoneSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.output_text.done"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  text: z.string()
}).passthrough()

export const RealtimeCallReferRequestSchema = z.object({
  target_uri: z.string()
}).passthrough()

export const RealtimeCallRejectRequestSchema = z.object({
  status_code: z.number().optional()
}).passthrough()

export const RealtimeClientEventConversationItemDeleteSchema = z.object({
  event_id: z.string().max(512).optional(),
  type: z.enum(["conversation.item.delete"]),
  item_id: z.string()
}).passthrough()

export const RealtimeClientEventConversationItemRetrieveSchema = z.object({
  event_id: z.string().max(512).optional(),
  type: z.enum(["conversation.item.retrieve"]),
  item_id: z.string()
}).passthrough()

export const RealtimeClientEventConversationItemTruncateSchema = z.object({
  event_id: z.string().max(512).optional(),
  type: z.enum(["conversation.item.truncate"]),
  item_id: z.string(),
  content_index: z.number(),
  audio_end_ms: z.number()
}).passthrough()

export const RealtimeClientEventInputAudioBufferAppendSchema = z.object({
  event_id: z.string().max(512).optional(),
  type: z.enum(["input_audio_buffer.append"]),
  audio: z.string()
}).passthrough()

export const RealtimeClientEventInputAudioBufferClearSchema = z.object({
  event_id: z.string().max(512).optional(),
  type: z.enum(["input_audio_buffer.clear"])
}).passthrough()

export const RealtimeClientEventInputAudioBufferCommitSchema = z.object({
  event_id: z.string().max(512).optional(),
  type: z.enum(["input_audio_buffer.commit"])
}).passthrough()

export const RealtimeClientEventOutputAudioBufferClearSchema = z.object({
  event_id: z.string().optional(),
  type: z.enum(["output_audio_buffer.clear"])
}).passthrough()

export const RealtimeClientEventResponseCancelSchema = z.object({
  event_id: z.string().max(512).optional(),
  type: z.enum(["response.cancel"]),
  response_id: z.string().optional()
}).passthrough()

export const RealtimeConversationItemFunctionCallSchema = z.object({
  id: z.string().optional(),
  object: z.enum(["realtime.item"]).optional(),
  type: z.enum(["function_call"]),
  status: z.enum(["completed", "incomplete", "in_progress"]).optional(),
  call_id: z.string().optional(),
  name: z.string(),
  arguments: z.string()
}).passthrough()

export const RealtimeConversationItemFunctionCallOutputSchema = z.object({
  id: z.string().optional(),
  object: z.enum(["realtime.item"]).optional(),
  type: z.enum(["function_call_output"]),
  status: z.enum(["completed", "incomplete", "in_progress"]).optional(),
  call_id: z.string(),
  output: z.string()
}).passthrough()

export const RealtimeConversationItemMessageAssistantSchema = z.object({
  id: z.string().optional(),
  object: z.enum(["realtime.item"]).optional(),
  type: z.enum(["message"]),
  status: z.enum(["completed", "incomplete", "in_progress"]).optional(),
  role: z.enum(["assistant"]),
  content: z.array(z.object({
  type: z.enum(["output_text", "output_audio"]).optional(),
  text: z.string().optional(),
  audio: z.string().optional(),
  transcript: z.string().optional()
}).passthrough())
}).passthrough()

export const RealtimeConversationItemMessageSystemSchema = z.object({
  id: z.string().optional(),
  object: z.enum(["realtime.item"]).optional(),
  type: z.enum(["message"]),
  status: z.enum(["completed", "incomplete", "in_progress"]).optional(),
  role: z.enum(["system"]),
  content: z.array(z.object({
  type: z.enum(["input_text"]).optional(),
  text: z.string().optional()
}).passthrough())
}).passthrough()

export const RealtimeConversationItemMessageUserSchema = z.object({
  id: z.string().optional(),
  object: z.enum(["realtime.item"]).optional(),
  type: z.enum(["message"]),
  status: z.enum(["completed", "incomplete", "in_progress"]).optional(),
  role: z.enum(["user"]),
  content: z.array(z.object({
  type: z.enum(["input_text", "input_audio", "input_image"]).optional(),
  text: z.string().optional(),
  audio: z.string().optional(),
  image_url: z.string().optional(),
  detail: z.enum(["auto", "low", "high"]).optional(),
  transcript: z.string().optional()
}).passthrough())
}).passthrough()

export const RealtimeConversationItemWithReferenceSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["message", "function_call", "function_call_output"]).optional(),
  object: z.enum(["realtime.item"]).optional(),
  status: z.enum(["completed", "incomplete", "in_progress"]).optional(),
  role: z.enum(["user", "assistant", "system"]).optional(),
  content: z.array(z.object({
  type: z.enum(["input_audio", "input_text", "item_reference", "text"]).optional(),
  text: z.string().optional(),
  id: z.string().optional(),
  audio: z.string().optional(),
  transcript: z.string().optional()
}).passthrough()).optional(),
  call_id: z.string().optional(),
  name: z.string().optional(),
  arguments: z.string().optional(),
  output: z.string().optional()
}).passthrough()

export const RealtimeFunctionToolSchema = z.object({
  type: z.enum(["function"]).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  parameters: z.record(z.string(), z.unknown()).optional()
}).passthrough()

export const RealtimeMCPApprovalRequestSchema = z.object({
  type: z.enum(["mcp_approval_request"]),
  id: z.string(),
  server_label: z.string(),
  name: z.string(),
  arguments: z.string()
}).passthrough()

export const RealtimeMCPApprovalResponseSchema = z.object({
  type: z.enum(["mcp_approval_response"]),
  id: z.string(),
  approval_request_id: z.string(),
  approve: z.boolean(),
  reason: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const RealtimeMCPHTTPErrorSchema = z.object({
  type: z.enum(["http_error"]),
  code: z.number(),
  message: z.string()
}).passthrough()

export const RealtimeMCPProtocolErrorSchema = z.object({
  type: z.enum(["protocol_error"]),
  code: z.number(),
  message: z.string()
}).passthrough()

export const RealtimeMCPToolExecutionErrorSchema = z.object({
  type: z.enum(["tool_execution_error"]),
  message: z.string()
}).passthrough()

export const RealtimeReasoningEffortSchema = z.enum(["minimal", "low", "medium", "high", "xhigh"])

export const RealtimeServerEventConversationCreatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.created"]),
  conversation: z.object({
  id: z.string().optional(),
  object: z.string().optional()
}).passthrough()
}).passthrough()

export const RealtimeServerEventConversationItemDeletedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.deleted"]),
  item_id: z.string()
}).passthrough()

export const RealtimeServerEventConversationItemInputAudioTranscriptionFailedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.input_audio_transcription.failed"]),
  item_id: z.string(),
  content_index: z.number(),
  error: z.object({
  type: z.string().optional(),
  code: z.string().optional(),
  message: z.string().optional(),
  param: z.string().optional()
}).passthrough()
}).passthrough()

export const RealtimeServerEventConversationItemInputAudioTranscriptionSegmentSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.input_audio_transcription.segment"]),
  item_id: z.string(),
  content_index: z.number(),
  text: z.string(),
  id: z.string(),
  speaker: z.string(),
  start: z.number(),
  end: z.number()
}).passthrough()

export const RealtimeServerEventConversationItemTruncatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.truncated"]),
  item_id: z.string(),
  content_index: z.number(),
  audio_end_ms: z.number()
}).passthrough()

export const RealtimeServerEventErrorSchema = z.object({
  event_id: z.string(),
  type: z.enum(["error"]),
  error: z.object({
  type: z.string(),
  code: z.union([z.string(), z.null()]).optional(),
  message: z.string(),
  param: z.union([z.string(), z.null()]).optional(),
  event_id: z.union([z.string(), z.null()]).optional()
}).passthrough()
}).passthrough()

export const RealtimeServerEventInputAudioBufferClearedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["input_audio_buffer.cleared"])
}).passthrough()

export const RealtimeServerEventInputAudioBufferCommittedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["input_audio_buffer.committed"]),
  previous_item_id: z.union([z.string(), z.null()]).optional(),
  item_id: z.string()
}).passthrough()

export const RealtimeServerEventInputAudioBufferDtmfEventReceivedSchema = z.object({
  type: z.enum(["input_audio_buffer.dtmf_event_received"]),
  event: z.string(),
  received_at: z.number()
}).passthrough()

export const RealtimeServerEventInputAudioBufferSpeechStartedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["input_audio_buffer.speech_started"]),
  audio_start_ms: z.number(),
  item_id: z.string()
}).passthrough()

export const RealtimeServerEventInputAudioBufferSpeechStoppedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["input_audio_buffer.speech_stopped"]),
  audio_end_ms: z.number(),
  item_id: z.string()
}).passthrough()

export const RealtimeServerEventInputAudioBufferTimeoutTriggeredSchema = z.object({
  event_id: z.string(),
  type: z.enum(["input_audio_buffer.timeout_triggered"]),
  audio_start_ms: z.number(),
  audio_end_ms: z.number(),
  item_id: z.string()
}).passthrough()

export const RealtimeServerEventMCPListToolsCompletedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["mcp_list_tools.completed"]),
  item_id: z.string()
}).passthrough()

export const RealtimeServerEventMCPListToolsFailedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["mcp_list_tools.failed"]),
  item_id: z.string()
}).passthrough()

export const RealtimeServerEventMCPListToolsInProgressSchema = z.object({
  event_id: z.string(),
  type: z.enum(["mcp_list_tools.in_progress"]),
  item_id: z.string()
}).passthrough()

export const RealtimeServerEventOutputAudioBufferClearedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["output_audio_buffer.cleared"]),
  response_id: z.string()
}).passthrough()

export const RealtimeServerEventOutputAudioBufferStartedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["output_audio_buffer.started"]),
  response_id: z.string()
}).passthrough()

export const RealtimeServerEventOutputAudioBufferStoppedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["output_audio_buffer.stopped"]),
  response_id: z.string()
}).passthrough()

export const RealtimeServerEventRateLimitsUpdatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["rate_limits.updated"]),
  rate_limits: z.array(z.object({
  name: z.enum(["requests", "tokens"]).optional(),
  limit: z.number().optional(),
  remaining: z.number().optional(),
  reset_seconds: z.number().optional()
}).passthrough())
}).passthrough()

export const RealtimeServerEventResponseAudioDeltaSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.output_audio.delta"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  delta: z.string()
}).passthrough()

export const RealtimeServerEventResponseAudioDoneSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.output_audio.done"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number()
}).passthrough()

export const RealtimeServerEventResponseAudioTranscriptDeltaSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.output_audio_transcript.delta"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  delta: z.string()
}).passthrough()

export const RealtimeServerEventResponseAudioTranscriptDoneSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.output_audio_transcript.done"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  transcript: z.string()
}).passthrough()

export const RealtimeServerEventResponseContentPartAddedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.content_part.added"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  part: z.object({
  type: z.enum(["audio", "text"]).optional(),
  text: z.string().optional(),
  audio: z.string().optional(),
  transcript: z.string().optional()
}).passthrough()
}).passthrough()

export const RealtimeServerEventResponseContentPartDoneSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.content_part.done"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  part: z.object({
  type: z.enum(["audio", "text"]).optional(),
  text: z.string().optional(),
  audio: z.string().optional(),
  transcript: z.string().optional()
}).passthrough()
}).passthrough()

export const RealtimeServerEventResponseFunctionCallArgumentsDeltaSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.function_call_arguments.delta"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  call_id: z.string(),
  delta: z.string()
}).passthrough()

export const RealtimeServerEventResponseFunctionCallArgumentsDoneSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.function_call_arguments.done"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  call_id: z.string(),
  name: z.string(),
  arguments: z.string()
}).passthrough()

export const RealtimeServerEventResponseMCPCallArgumentsDeltaSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.mcp_call_arguments.delta"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  delta: z.string(),
  obfuscation: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const RealtimeServerEventResponseMCPCallArgumentsDoneSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.mcp_call_arguments.done"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  arguments: z.string()
}).passthrough()

export const RealtimeServerEventResponseMCPCallCompletedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.mcp_call.completed"]),
  output_index: z.number(),
  item_id: z.string()
}).passthrough()

export const RealtimeServerEventResponseMCPCallFailedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.mcp_call.failed"]),
  output_index: z.number(),
  item_id: z.string()
}).passthrough()

export const RealtimeServerEventResponseMCPCallInProgressSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.mcp_call.in_progress"]),
  output_index: z.number(),
  item_id: z.string()
}).passthrough()

export const RealtimeServerEventResponseTextDeltaSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.output_text.delta"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  delta: z.string()
}).passthrough()

export const RealtimeServerEventResponseTextDoneSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.output_text.done"]),
  response_id: z.string(),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  text: z.string()
}).passthrough()

export const RealtimeTranslationClientEventInputAudioBufferAppendSchema = z.object({
  event_id: z.string().max(512).optional(),
  type: z.enum(["session.input_audio_buffer.append"]),
  audio: z.string()
}).passthrough()

export const RealtimeTranslationClientEventSessionCloseSchema = z.object({
  event_id: z.string().max(512).optional(),
  type: z.enum(["session.close"])
}).passthrough()

export const RealtimeTranslationServerEventSessionClosedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["session.closed"])
}).passthrough()

export const RealtimeTranslationServerEventSessionInputTranscriptDeltaSchema = z.object({
  event_id: z.string(),
  type: z.enum(["session.input_transcript.delta"]),
  delta: z.string(),
  elapsed_ms: z.union([z.number(), z.null()]).optional()
}).passthrough()

export const RealtimeTranslationServerEventSessionOutputAudioDeltaSchema = z.object({
  event_id: z.string(),
  type: z.enum(["session.output_audio.delta"]),
  delta: z.string(),
  sample_rate: z.number().optional(),
  channels: z.number().optional(),
  format: z.enum(["pcm16"]).optional(),
  elapsed_ms: z.union([z.number(), z.null()]).optional()
}).passthrough()

export const RealtimeTranslationServerEventSessionOutputTranscriptDeltaSchema = z.object({
  event_id: z.string(),
  type: z.enum(["session.output_transcript.delta"]),
  delta: z.string(),
  elapsed_ms: z.union([z.number(), z.null()]).optional()
}).passthrough()

export const RealtimeTruncationSchema = z.union([z.enum(["auto", "disabled"]), z.object({
  type: z.enum(["retention_ratio"]),
  retention_ratio: z.number().min(0).max(1),
  token_limits: z.object({
  post_instructions: z.number().min(0).optional()
}).passthrough().optional()
}).passthrough()])

export const RealtimeTurnDetectionSchema = z.union([z.union([z.object({
  type: z.string(),
  threshold: z.number().optional(),
  prefix_padding_ms: z.number().optional(),
  silence_duration_ms: z.number().optional(),
  create_response: z.boolean().optional(),
  interrupt_response: z.boolean().optional(),
  idle_timeout_ms: z.union([z.number().min(5000).max(30000), z.null()]).optional()
}).passthrough(), z.object({
  type: z.string(),
  eagerness: z.enum(["low", "medium", "high", "auto"]).optional(),
  create_response: z.boolean().optional(),
  interrupt_response: z.boolean().optional()
}).passthrough()]), z.null()])

export const ReasoningEffortSchema = z.union([z.enum(["none", "minimal", "low", "medium", "high", "xhigh"]), z.null()])

export const ResponseAudioDeltaEventSchema = z.object({
  type: z.enum(["response.audio.delta"]),
  sequence_number: z.number(),
  delta: z.string()
}).passthrough()

export const ResponseAudioDoneEventSchema = z.object({
  type: z.enum(["response.audio.done"]),
  sequence_number: z.number()
}).passthrough()

export const ResponseAudioTranscriptDeltaEventSchema = z.object({
  type: z.enum(["response.audio.transcript.delta"]),
  delta: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseAudioTranscriptDoneEventSchema = z.object({
  type: z.enum(["response.audio.transcript.done"]),
  sequence_number: z.number()
}).passthrough()

export const ResponseCodeInterpreterCallCodeDeltaEventSchema = z.object({
  type: z.enum(["response.code_interpreter_call_code.delta"]),
  output_index: z.number(),
  item_id: z.string(),
  delta: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseCodeInterpreterCallCodeDoneEventSchema = z.object({
  type: z.enum(["response.code_interpreter_call_code.done"]),
  output_index: z.number(),
  item_id: z.string(),
  code: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseCodeInterpreterCallCompletedEventSchema = z.object({
  type: z.enum(["response.code_interpreter_call.completed"]),
  output_index: z.number(),
  item_id: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseCodeInterpreterCallInProgressEventSchema = z.object({
  type: z.enum(["response.code_interpreter_call.in_progress"]),
  output_index: z.number(),
  item_id: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseCodeInterpreterCallInterpretingEventSchema = z.object({
  type: z.enum(["response.code_interpreter_call.interpreting"]),
  output_index: z.number(),
  item_id: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseCustomToolCallInputDeltaEventSchema = z.object({
  type: z.enum(["response.custom_tool_call_input.delta"]),
  sequence_number: z.number(),
  output_index: z.number(),
  item_id: z.string(),
  delta: z.string()
}).passthrough()

export const ResponseCustomToolCallInputDoneEventSchema = z.object({
  type: z.enum(["response.custom_tool_call_input.done"]),
  sequence_number: z.number(),
  output_index: z.number(),
  item_id: z.string(),
  input: z.string()
}).passthrough()

export const ResponseErrorCodeSchema = z.enum(["server_error", "rate_limit_exceeded", "invalid_prompt", "vector_store_timeout", "invalid_image", "invalid_image_format", "invalid_base64_image", "invalid_image_url", "image_too_large", "image_too_small", "image_parse_error", "image_content_policy_violation", "invalid_image_mode", "image_file_too_large", "unsupported_image_media_type", "empty_image_file", "failed_to_download_image", "image_file_not_found"])

export const ResponseErrorEventSchema = z.object({
  type: z.enum(["error"]),
  code: z.union([z.string(), z.null()]),
  message: z.string(),
  param: z.union([z.string(), z.null()]),
  sequence_number: z.number()
}).passthrough()

export const ResponseFileSearchCallCompletedEventSchema = z.object({
  type: z.enum(["response.file_search_call.completed"]),
  output_index: z.number(),
  item_id: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseFileSearchCallInProgressEventSchema = z.object({
  type: z.enum(["response.file_search_call.in_progress"]),
  output_index: z.number(),
  item_id: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseFileSearchCallSearchingEventSchema = z.object({
  type: z.enum(["response.file_search_call.searching"]),
  output_index: z.number(),
  item_id: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseFormatJsonObjectSchema = z.object({
  type: z.enum(["json_object"])
}).passthrough()

export const ResponseFormatJsonSchemaSchemaSchema = z.record(z.string(), z.unknown())

export const ResponseFormatTextSchema = z.object({
  type: z.enum(["text"])
}).passthrough()

export const ResponseFormatTextGrammarSchema = z.object({
  type: z.enum(["grammar"]),
  grammar: z.string()
}).passthrough()

export const ResponseFormatTextPythonSchema = z.object({
  type: z.enum(["python"])
}).passthrough()

export const ResponseFunctionCallArgumentsDeltaEventSchema = z.object({
  type: z.enum(["response.function_call_arguments.delta"]),
  item_id: z.string(),
  output_index: z.number(),
  sequence_number: z.number(),
  delta: z.string()
}).passthrough()

export const ResponseFunctionCallArgumentsDoneEventSchema = z.object({
  type: z.enum(["response.function_call_arguments.done"]),
  item_id: z.string(),
  name: z.string(),
  output_index: z.number(),
  sequence_number: z.number(),
  arguments: z.string()
}).passthrough()

export const ResponseImageGenCallCompletedEventSchema = z.object({
  type: z.enum(["response.image_generation_call.completed"]),
  output_index: z.number(),
  sequence_number: z.number(),
  item_id: z.string()
}).passthrough()

export const ResponseImageGenCallGeneratingEventSchema = z.object({
  type: z.enum(["response.image_generation_call.generating"]),
  output_index: z.number(),
  item_id: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseImageGenCallInProgressEventSchema = z.object({
  type: z.enum(["response.image_generation_call.in_progress"]),
  output_index: z.number(),
  item_id: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseImageGenCallPartialImageEventSchema = z.object({
  type: z.enum(["response.image_generation_call.partial_image"]),
  output_index: z.number(),
  item_id: z.string(),
  sequence_number: z.number(),
  partial_image_index: z.number(),
  partial_image_b64: z.string()
}).passthrough()

export const ResponseLogProbSchema = z.object({
  token: z.string(),
  logprob: z.number(),
  top_logprobs: z.array(z.object({
  token: z.string().optional(),
  logprob: z.number().optional()
}).passthrough()).optional()
}).passthrough()

export const ResponseMCPCallArgumentsDeltaEventSchema = z.object({
  type: z.enum(["response.mcp_call_arguments.delta"]),
  output_index: z.number(),
  item_id: z.string(),
  delta: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseMCPCallArgumentsDoneEventSchema = z.object({
  type: z.enum(["response.mcp_call_arguments.done"]),
  output_index: z.number(),
  item_id: z.string(),
  arguments: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseMCPCallCompletedEventSchema = z.object({
  type: z.enum(["response.mcp_call.completed"]),
  item_id: z.string(),
  output_index: z.number(),
  sequence_number: z.number()
}).passthrough()

export const ResponseMCPCallFailedEventSchema = z.object({
  type: z.enum(["response.mcp_call.failed"]),
  item_id: z.string(),
  output_index: z.number(),
  sequence_number: z.number()
}).passthrough()

export const ResponseMCPCallInProgressEventSchema = z.object({
  type: z.enum(["response.mcp_call.in_progress"]),
  sequence_number: z.number(),
  output_index: z.number(),
  item_id: z.string()
}).passthrough()

export const ResponseMCPListToolsCompletedEventSchema = z.object({
  type: z.enum(["response.mcp_list_tools.completed"]),
  item_id: z.string(),
  output_index: z.number(),
  sequence_number: z.number()
}).passthrough()

export const ResponseMCPListToolsFailedEventSchema = z.object({
  type: z.enum(["response.mcp_list_tools.failed"]),
  item_id: z.string(),
  output_index: z.number(),
  sequence_number: z.number()
}).passthrough()

export const ResponseMCPListToolsInProgressEventSchema = z.object({
  type: z.enum(["response.mcp_list_tools.in_progress"]),
  item_id: z.string(),
  output_index: z.number(),
  sequence_number: z.number()
}).passthrough()

export const ResponseModalitiesSchema = z.union([z.array(z.enum(["text", "audio"])), z.null()])

export const ResponseOutputTextAnnotationAddedEventSchema = z.object({
  type: z.enum(["response.output_text.annotation.added"]),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  annotation_index: z.number(),
  sequence_number: z.number(),
  annotation: z.record(z.string(), z.unknown())
}).passthrough()

export const ResponseReasoningSummaryPartAddedEventSchema = z.object({
  type: z.enum(["response.reasoning_summary_part.added"]),
  item_id: z.string(),
  output_index: z.number(),
  summary_index: z.number(),
  sequence_number: z.number(),
  part: z.object({
  type: z.enum(["summary_text"]),
  text: z.string()
}).passthrough()
}).passthrough()

export const ResponseReasoningSummaryPartDoneEventSchema = z.object({
  type: z.enum(["response.reasoning_summary_part.done"]),
  item_id: z.string(),
  output_index: z.number(),
  summary_index: z.number(),
  sequence_number: z.number(),
  part: z.object({
  type: z.enum(["summary_text"]),
  text: z.string()
}).passthrough()
}).passthrough()

export const ResponseReasoningSummaryTextDeltaEventSchema = z.object({
  type: z.enum(["response.reasoning_summary_text.delta"]),
  item_id: z.string(),
  output_index: z.number(),
  summary_index: z.number(),
  delta: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseReasoningSummaryTextDoneEventSchema = z.object({
  type: z.enum(["response.reasoning_summary_text.done"]),
  item_id: z.string(),
  output_index: z.number(),
  summary_index: z.number(),
  text: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseReasoningTextDeltaEventSchema = z.object({
  type: z.enum(["response.reasoning_text.delta"]),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  delta: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseReasoningTextDoneEventSchema = z.object({
  type: z.enum(["response.reasoning_text.done"]),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  text: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseRefusalDeltaEventSchema = z.object({
  type: z.enum(["response.refusal.delta"]),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  delta: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseRefusalDoneEventSchema = z.object({
  type: z.enum(["response.refusal.done"]),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  refusal: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseStreamOptionsSchema = z.union([z.object({
  include_obfuscation: z.boolean().optional()
}).passthrough(), z.null()])

export const ResponseUsageSchema = z.object({
  input_tokens: z.number(),
  input_tokens_details: z.object({
  cached_tokens: z.number()
}).passthrough(),
  output_tokens: z.number(),
  output_tokens_details: z.object({
  reasoning_tokens: z.number()
}).passthrough(),
  total_tokens: z.number()
}).passthrough()

export const ResponseWebSearchCallCompletedEventSchema = z.object({
  type: z.enum(["response.web_search_call.completed"]),
  output_index: z.number(),
  item_id: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseWebSearchCallInProgressEventSchema = z.object({
  type: z.enum(["response.web_search_call.in_progress"]),
  output_index: z.number(),
  item_id: z.string(),
  sequence_number: z.number()
}).passthrough()

export const ResponseWebSearchCallSearchingEventSchema = z.object({
  type: z.enum(["response.web_search_call.searching"]),
  output_index: z.number(),
  item_id: z.string(),
  sequence_number: z.number()
}).passthrough()

export const RoleSchema = z.object({
  object: z.enum(["role"]),
  id: z.string(),
  name: z.string(),
  description: z.union([z.string(), z.null()]),
  permissions: z.array(z.string()),
  resource_type: z.string(),
  predefined_role: z.boolean()
}).passthrough()

export const RoleDeletedResourceSchema = z.object({
  object: z.enum(["role.deleted"]),
  id: z.string(),
  deleted: z.boolean()
}).passthrough()

export const RunCompletionUsageSchema = z.union([z.object({
  completion_tokens: z.number(),
  prompt_tokens: z.number(),
  total_tokens: z.number()
}).passthrough(), z.null()])

export const RunGraderResponseSchema = z.object({
  reward: z.number(),
  metadata: z.object({
  name: z.string(),
  type: z.string(),
  errors: z.object({
  formula_parse_error: z.boolean(),
  sample_parse_error: z.boolean(),
  truncated_observation_error: z.boolean(),
  unresponsive_reward_error: z.boolean(),
  invalid_variable_error: z.boolean(),
  other_error: z.boolean(),
  python_grader_server_error: z.boolean(),
  python_grader_server_error_type: z.union([z.string(), z.null()]),
  python_grader_runtime_error: z.boolean(),
  python_grader_runtime_error_details: z.union([z.string(), z.null()]),
  model_grader_server_error: z.boolean(),
  model_grader_refusal_error: z.boolean(),
  model_grader_parse_error: z.boolean(),
  model_grader_server_error_details: z.union([z.string(), z.null()])
}).passthrough(),
  execution_time: z.number(),
  scores: z.record(z.string(), z.unknown()),
  token_usage: z.union([z.number(), z.null()]),
  sampled_model_name: z.union([z.string(), z.null()])
}).passthrough(),
  sub_rewards: z.record(z.string(), z.unknown()),
  model_grader_token_usage_per_model: z.record(z.string(), z.unknown())
}).passthrough()

export const RunStepCompletionUsageSchema = z.union([z.object({
  completion_tokens: z.number(),
  prompt_tokens: z.number(),
  total_tokens: z.number()
}).passthrough(), z.null()])

export const RunStepDeltaStepDetailsMessageCreationObjectSchema = z.object({
  type: z.enum(["message_creation"]),
  message_creation: z.object({
  message_id: z.string().optional()
}).passthrough().optional()
}).passthrough()

export const RunStepDeltaStepDetailsToolCallsCodeOutputImageObjectSchema = z.object({
  index: z.number(),
  type: z.enum(["image"]),
  image: z.object({
  file_id: z.string().optional()
}).passthrough().optional()
}).passthrough()

export const RunStepDeltaStepDetailsToolCallsCodeOutputLogsObjectSchema = z.object({
  index: z.number(),
  type: z.enum(["logs"]),
  logs: z.string().optional()
}).passthrough()

export const RunStepDeltaStepDetailsToolCallsFileSearchObjectSchema = z.object({
  index: z.number(),
  id: z.string().optional(),
  type: z.enum(["file_search"]),
  file_search: z.record(z.string(), z.unknown())
}).passthrough()

export const RunStepDeltaStepDetailsToolCallsFunctionObjectSchema = z.object({
  index: z.number(),
  id: z.string().optional(),
  type: z.enum(["function"]),
  function: z.object({
  name: z.string().optional(),
  arguments: z.string().optional(),
  output: z.union([z.string(), z.null()]).optional()
}).passthrough().optional()
}).passthrough()

export const RunStepDetailsMessageCreationObjectSchema = z.object({
  type: z.enum(["message_creation"]),
  message_creation: z.object({
  message_id: z.string()
}).passthrough()
}).passthrough()

export const RunStepDetailsToolCallsCodeOutputImageObjectSchema = z.object({
  type: z.enum(["image"]),
  image: z.object({
  file_id: z.string()
}).passthrough()
}).passthrough()

export const RunStepDetailsToolCallsCodeOutputLogsObjectSchema = z.object({
  type: z.enum(["logs"]),
  logs: z.string()
}).passthrough()

export const RunStepDetailsToolCallsFileSearchResultObjectSchema = z.object({
  file_id: z.string(),
  file_name: z.string(),
  score: z.number().min(0).max(1),
  content: z.array(z.object({
  type: z.enum(["text"]).optional(),
  text: z.string().optional()
}).passthrough()).optional()
}).passthrough()

export const RunStepDetailsToolCallsFunctionObjectSchema = z.object({
  id: z.string(),
  type: z.enum(["function"]),
  function: z.object({
  name: z.string(),
  arguments: z.string(),
  output: z.union([z.string(), z.null()])
}).passthrough()
}).passthrough()

export const RunToolCallObjectSchema = z.object({
  id: z.string(),
  type: z.enum(["function"]),
  function: z.object({
  name: z.string(),
  arguments: z.string()
}).passthrough()
}).passthrough()

export const ServiceTierSchema = z.union([z.enum(["auto", "default", "flex", "scale", "priority"]), z.null()])

export const SpeechAudioDeltaEventSchema = z.object({
  type: z.enum(["speech.audio.delta"]),
  audio: z.string()
}).passthrough()

export const SpeechAudioDoneEventSchema = z.object({
  type: z.enum(["speech.audio.done"]),
  usage: z.object({
  input_tokens: z.number(),
  output_tokens: z.number(),
  total_tokens: z.number()
}).passthrough()
}).passthrough()

export const StaticChunkingStrategySchema = z.object({
  max_chunk_size_tokens: z.number().min(100).max(4096),
  chunk_overlap_tokens: z.number()
}).passthrough()

export const StopConfigurationSchema = z.union([z.string(), z.array(z.string()).min(1).max(4)])

export const SubmitToolOutputsRunRequestSchema = z.object({
  tool_outputs: z.array(z.object({
  tool_call_id: z.string().optional(),
  output: z.string().optional()
}).passthrough()),
  stream: z.union([z.boolean(), z.null()]).optional()
}).passthrough()

export const ToggleCertificatesRequestSchema = z.object({
  certificate_ids: z.array(z.string()).min(1).max(10)
}).passthrough()

export const ToolChoiceAllowedSchema = z.object({
  type: z.enum(["allowed_tools"]),
  mode: z.enum(["auto", "required"]),
  tools: z.array(z.record(z.string(), z.unknown()))
}).passthrough()

export const ToolChoiceCustomSchema = z.object({
  type: z.enum(["custom"]),
  name: z.string()
}).passthrough()

export const ToolChoiceFunctionSchema = z.object({
  type: z.enum(["function"]),
  name: z.string()
}).passthrough()

export const ToolChoiceMCPSchema = z.object({
  type: z.enum(["mcp"]),
  server_label: z.string(),
  name: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const ToolChoiceOptionsSchema = z.enum(["none", "auto", "required"])

export const ToolChoiceTypesSchema = z.object({
  type: z.enum(["file_search", "web_search_preview", "computer", "computer_use_preview", "computer_use", "web_search_preview_2025_03_11", "image_generation", "code_interpreter"])
}).passthrough()

export const TranscriptTextDeltaEventSchema = z.object({
  type: z.enum(["transcript.text.delta"]),
  delta: z.string(),
  logprobs: z.array(z.object({
  token: z.string().optional(),
  logprob: z.number().optional(),
  bytes: z.array(z.number()).optional()
}).passthrough()).optional(),
  segment_id: z.string().optional()
}).passthrough()

export const TranscriptTextSegmentEventSchema = z.object({
  type: z.enum(["transcript.text.segment"]),
  id: z.string(),
  start: z.number(),
  end: z.number(),
  text: z.string(),
  speaker: z.string()
}).passthrough()

export const TranscriptTextUsageDurationSchema = z.object({
  type: z.enum(["duration"]),
  seconds: z.number()
}).passthrough()

export const TranscriptTextUsageTokensSchema = z.object({
  type: z.enum(["tokens"]),
  input_tokens: z.number(),
  input_token_details: z.object({
  text_tokens: z.number().optional(),
  audio_tokens: z.number().optional()
}).passthrough().optional(),
  output_tokens: z.number(),
  total_tokens: z.number()
}).passthrough()

export const TranscriptionDiarizedSegmentSchema = z.object({
  type: z.enum(["transcript.text.segment"]),
  id: z.string(),
  start: z.number(),
  end: z.number(),
  text: z.string(),
  speaker: z.string()
}).passthrough()

export const TranscriptionIncludeSchema = z.enum(["logprobs"])

export const TranscriptionSegmentSchema = z.object({
  id: z.number(),
  seek: z.number(),
  start: z.number(),
  end: z.number(),
  text: z.string(),
  tokens: z.array(z.number()),
  temperature: z.number(),
  avg_logprob: z.number(),
  compression_ratio: z.number(),
  no_speech_prob: z.number()
}).passthrough()

export const TranscriptionWordSchema = z.object({
  word: z.string(),
  start: z.number(),
  end: z.number()
}).passthrough()

export const TruncationObjectSchema = z.object({
  type: z.enum(["auto", "last_messages"]),
  last_messages: z.union([z.number().min(1), z.null()]).optional()
}).passthrough()

export const UpdateGroupBodySchema = z.object({
  name: z.string().min(1).max(255)
}).passthrough()

export const UpdateVoiceConsentRequestSchema = z.object({
  name: z.string()
}).passthrough()

export const UploadCertificateRequestSchema = z.object({
  name: z.string().optional(),
  certificate: z.string()
}).passthrough()

export const UploadPartSchema = z.object({
  id: z.string(),
  created_at: z.number(),
  upload_id: z.string(),
  object: z.enum(["upload.part"])
}).passthrough()

export const UsageAudioSpeechesResultSchema = z.object({
  object: z.enum(["organization.usage.audio_speeches.result"]),
  characters: z.number(),
  num_model_requests: z.number(),
  project_id: z.union([z.string(), z.null()]).optional(),
  user_id: z.union([z.string(), z.null()]).optional(),
  api_key_id: z.union([z.string(), z.null()]).optional(),
  model: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const UsageAudioTranscriptionsResultSchema = z.object({
  object: z.enum(["organization.usage.audio_transcriptions.result"]),
  seconds: z.number(),
  num_model_requests: z.number(),
  project_id: z.union([z.string(), z.null()]).optional(),
  user_id: z.union([z.string(), z.null()]).optional(),
  api_key_id: z.union([z.string(), z.null()]).optional(),
  model: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const UsageCodeInterpreterSessionsResultSchema = z.object({
  object: z.enum(["organization.usage.code_interpreter_sessions.result"]),
  num_sessions: z.number(),
  project_id: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const UsageCompletionsResultSchema = z.object({
  object: z.enum(["organization.usage.completions.result"]),
  input_tokens: z.number(),
  input_cached_tokens: z.number().optional(),
  output_tokens: z.number(),
  input_audio_tokens: z.number().optional(),
  output_audio_tokens: z.number().optional(),
  num_model_requests: z.number(),
  project_id: z.union([z.string(), z.null()]).optional(),
  user_id: z.union([z.string(), z.null()]).optional(),
  api_key_id: z.union([z.string(), z.null()]).optional(),
  model: z.union([z.string(), z.null()]).optional(),
  batch: z.union([z.boolean(), z.null()]).optional(),
  service_tier: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const UsageEmbeddingsResultSchema = z.object({
  object: z.enum(["organization.usage.embeddings.result"]),
  input_tokens: z.number(),
  num_model_requests: z.number(),
  project_id: z.union([z.string(), z.null()]).optional(),
  user_id: z.union([z.string(), z.null()]).optional(),
  api_key_id: z.union([z.string(), z.null()]).optional(),
  model: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const UsageImagesResultSchema = z.object({
  object: z.enum(["organization.usage.images.result"]),
  images: z.number(),
  num_model_requests: z.number(),
  source: z.union([z.string(), z.null()]).optional(),
  size: z.union([z.string(), z.null()]).optional(),
  project_id: z.union([z.string(), z.null()]).optional(),
  user_id: z.union([z.string(), z.null()]).optional(),
  api_key_id: z.union([z.string(), z.null()]).optional(),
  model: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const UsageModerationsResultSchema = z.object({
  object: z.enum(["organization.usage.moderations.result"]),
  input_tokens: z.number(),
  num_model_requests: z.number(),
  project_id: z.union([z.string(), z.null()]).optional(),
  user_id: z.union([z.string(), z.null()]).optional(),
  api_key_id: z.union([z.string(), z.null()]).optional(),
  model: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const UsageVectorStoresResultSchema = z.object({
  object: z.enum(["organization.usage.vector_stores.result"]),
  usage_bytes: z.number(),
  project_id: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const UserSchema = z.object({
  object: z.enum(["organization.user"]),
  id: z.string(),
  name: z.union([z.string(), z.null()]).optional(),
  email: z.union([z.string(), z.null()]).optional(),
  role: z.union([z.string(), z.null()]).optional(),
  added_at: z.number(),
  is_default: z.boolean().optional(),
  created: z.number().optional(),
  user: z.object({
  object: z.enum(["user"]),
  id: z.string(),
  email: z.union([z.string(), z.null()]).optional(),
  name: z.union([z.string(), z.null()]).optional(),
  picture: z.union([z.string(), z.null()]).optional(),
  enabled: z.union([z.boolean(), z.null()]).optional(),
  banned: z.union([z.boolean(), z.null()]).optional(),
  banned_at: z.union([z.number(), z.null()]).optional()
}).passthrough().optional(),
  is_service_account: z.boolean().optional(),
  is_scale_tier_authorized_purchaser: z.union([z.boolean(), z.null()]).optional(),
  is_scim_managed: z.boolean().optional(),
  api_key_last_used_at: z.union([z.number(), z.null()]).optional(),
  technical_level: z.union([z.string(), z.null()]).optional(),
  developer_persona: z.union([z.string(), z.null()]).optional(),
  projects: z.union([z.object({
  object: z.enum(["list"]),
  data: z.array(z.object({
  id: z.union([z.string(), z.null()]).optional(),
  name: z.union([z.string(), z.null()]).optional(),
  role: z.union([z.string(), z.null()]).optional()
}).passthrough())
}).passthrough(), z.null()]).optional()
}).passthrough()

export const UserDeleteResponseSchema = z.object({
  object: z.enum(["organization.user.deleted"]),
  id: z.string(),
  deleted: z.boolean()
}).passthrough()

export const UserRoleUpdateRequestSchema = z.object({
  role: z.union([z.string(), z.null()]).optional(),
  role_id: z.union([z.string(), z.null()]).optional(),
  technical_level: z.union([z.string(), z.null()]).optional(),
  developer_persona: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const VadConfigSchema = z.object({
  type: z.enum(["server_vad"]),
  prefix_padding_ms: z.number().optional(),
  silence_duration_ms: z.number().optional(),
  threshold: z.number().optional()
}).passthrough()

export const VectorStoreExpirationAfterSchema = z.object({
  anchor: z.enum(["last_active_at"]),
  days: z.number().min(1).max(365)
}).passthrough()

export const VectorStoreFileAttributesSchema = z.union([z.record(z.string(), z.union([z.string().max(512), z.number(), z.boolean()])), z.null()])

export const VectorStoreFileBatchObjectSchema = z.object({
  id: z.string(),
  object: z.enum(["vector_store.files_batch"]),
  created_at: z.number(),
  vector_store_id: z.string(),
  status: z.enum(["in_progress", "completed", "cancelled", "failed"]),
  file_counts: z.object({
  in_progress: z.number(),
  completed: z.number(),
  failed: z.number(),
  cancelled: z.number(),
  total: z.number()
}).passthrough()
}).passthrough()

export const VectorStoreFileContentResponseSchema = z.object({
  object: z.enum(["vector_store.file_content.page"]),
  data: z.array(z.object({
  type: z.string().optional(),
  text: z.string().optional()
}).passthrough()),
  has_more: z.boolean(),
  next_page: z.union([z.string(), z.null()])
}).passthrough()

export const VectorStoreSearchResultContentObjectSchema = z.object({
  type: z.enum(["text"]),
  text: z.string()
}).passthrough()

export const VerbositySchema = z.union([z.enum(["low", "medium", "high"]), z.null()])

export const VoiceConsentDeletedResourceSchema = z.object({
  id: z.string(),
  object: z.enum(["audio.voice_consent"]),
  deleted: z.boolean()
}).passthrough()

export const VoiceConsentResourceSchema = z.object({
  object: z.enum(["audio.voice_consent"]),
  id: z.string(),
  name: z.string(),
  language: z.string(),
  created_at: z.number()
}).passthrough()

export const VoiceIdsSharedSchema = z.union([z.string(), z.enum(["alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer", "verse", "marin", "cedar"])])

export const VoiceResourceSchema = z.object({
  object: z.enum(["audio.voice"]),
  id: z.string(),
  name: z.string(),
  created_at: z.number()
}).passthrough()

export const WebSearchActionFindSchema = z.object({
  type: z.enum(["find_in_page"]),
  url: z.string(),
  pattern: z.string()
}).passthrough()

export const WebSearchActionOpenPageSchema = z.object({
  type: z.enum(["open_page"]),
  url: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const WebSearchActionSearchSchema = z.object({
  type: z.enum(["search"]),
  query: z.string(),
  queries: z.array(z.string()).optional(),
  sources: z.array(z.object({
  type: z.enum(["url"]),
  url: z.string()
}).passthrough()).optional()
}).passthrough()

export const WebSearchApproximateLocationSchema = z.union([z.object({
  type: z.enum(["approximate"]).optional(),
  country: z.union([z.string(), z.null()]).optional(),
  region: z.union([z.string(), z.null()]).optional(),
  city: z.union([z.string(), z.null()]).optional(),
  timezone: z.union([z.string(), z.null()]).optional()
}).passthrough(), z.null()])

export const WebSearchContextSizeSchema = z.enum(["low", "medium", "high"])

export const WebSearchLocationSchema = z.object({
  country: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  timezone: z.string().optional()
}).passthrough()

export const WebhookBatchCancelledSchema = z.object({
  created_at: z.number(),
  id: z.string(),
  data: z.object({
  id: z.string()
}).passthrough(),
  object: z.enum(["event"]).optional(),
  type: z.enum(["batch.cancelled"])
}).passthrough()

export const WebhookBatchCompletedSchema = z.object({
  created_at: z.number(),
  id: z.string(),
  data: z.object({
  id: z.string()
}).passthrough(),
  object: z.enum(["event"]).optional(),
  type: z.enum(["batch.completed"])
}).passthrough()

export const WebhookBatchExpiredSchema = z.object({
  created_at: z.number(),
  id: z.string(),
  data: z.object({
  id: z.string()
}).passthrough(),
  object: z.enum(["event"]).optional(),
  type: z.enum(["batch.expired"])
}).passthrough()

export const WebhookBatchFailedSchema = z.object({
  created_at: z.number(),
  id: z.string(),
  data: z.object({
  id: z.string()
}).passthrough(),
  object: z.enum(["event"]).optional(),
  type: z.enum(["batch.failed"])
}).passthrough()

export const WebhookEvalRunCanceledSchema = z.object({
  created_at: z.number(),
  id: z.string(),
  data: z.object({
  id: z.string()
}).passthrough(),
  object: z.enum(["event"]).optional(),
  type: z.enum(["eval.run.canceled"])
}).passthrough()

export const WebhookEvalRunFailedSchema = z.object({
  created_at: z.number(),
  id: z.string(),
  data: z.object({
  id: z.string()
}).passthrough(),
  object: z.enum(["event"]).optional(),
  type: z.enum(["eval.run.failed"])
}).passthrough()

export const WebhookEvalRunSucceededSchema = z.object({
  created_at: z.number(),
  id: z.string(),
  data: z.object({
  id: z.string()
}).passthrough(),
  object: z.enum(["event"]).optional(),
  type: z.enum(["eval.run.succeeded"])
}).passthrough()

export const WebhookFineTuningJobCancelledSchema = z.object({
  created_at: z.number(),
  id: z.string(),
  data: z.object({
  id: z.string()
}).passthrough(),
  object: z.enum(["event"]).optional(),
  type: z.enum(["fine_tuning.job.cancelled"])
}).passthrough()

export const WebhookFineTuningJobFailedSchema = z.object({
  created_at: z.number(),
  id: z.string(),
  data: z.object({
  id: z.string()
}).passthrough(),
  object: z.enum(["event"]).optional(),
  type: z.enum(["fine_tuning.job.failed"])
}).passthrough()

export const WebhookFineTuningJobSucceededSchema = z.object({
  created_at: z.number(),
  id: z.string(),
  data: z.object({
  id: z.string()
}).passthrough(),
  object: z.enum(["event"]).optional(),
  type: z.enum(["fine_tuning.job.succeeded"])
}).passthrough()

export const WebhookRealtimeCallIncomingSchema = z.object({
  created_at: z.number(),
  id: z.string(),
  data: z.object({
  call_id: z.string(),
  sip_headers: z.array(z.object({
  name: z.string(),
  value: z.string()
}).passthrough())
}).passthrough(),
  object: z.enum(["event"]).optional(),
  type: z.enum(["realtime.call.incoming"])
}).passthrough()

export const WebhookResponseCancelledSchema = z.object({
  created_at: z.number(),
  id: z.string(),
  data: z.object({
  id: z.string()
}).passthrough(),
  object: z.enum(["event"]).optional(),
  type: z.enum(["response.cancelled"])
}).passthrough()

export const WebhookResponseCompletedSchema = z.object({
  created_at: z.number(),
  id: z.string(),
  data: z.object({
  id: z.string()
}).passthrough(),
  object: z.enum(["event"]).optional(),
  type: z.enum(["response.completed"])
}).passthrough()

export const WebhookResponseFailedSchema = z.object({
  created_at: z.number(),
  id: z.string(),
  data: z.object({
  id: z.string()
}).passthrough(),
  object: z.enum(["event"]).optional(),
  type: z.enum(["response.failed"])
}).passthrough()

export const WebhookResponseIncompleteSchema = z.object({
  created_at: z.number(),
  id: z.string(),
  data: z.object({
  id: z.string()
}).passthrough(),
  object: z.enum(["event"]).optional(),
  type: z.enum(["response.incomplete"])
}).passthrough()

export const SkillReferenceParamSchema = z.object({
  type: z.enum(["skill_reference"]),
  skill_id: z.string().min(1).max(64),
  version: z.string().optional()
}).passthrough()

export const InlineSkillSourceParamSchema = z.object({
  type: z.enum(["base64"]),
  media_type: z.enum(["application/zip"]),
  data: z.string().min(1).max(70254592)
}).passthrough()

export const ContainerNetworkPolicyDisabledParamSchema = z.object({
  type: z.enum(["disabled"])
}).passthrough()

export const ContainerNetworkPolicyDomainSecretParamSchema = z.object({
  domain: z.string().min(1),
  name: z.string().min(1),
  value: z.string().min(1).max(10485760)
}).passthrough()

export const IncludeEnumSchema = z.enum(["file_search_call.results", "web_search_call.results", "web_search_call.action.sources", "message.input_image.image_url", "computer_call_output.output.image_url", "code_interpreter_call.outputs", "reasoning.encrypted_content", "message.output_text.logprobs"])

export const MessageStatusSchema = z.enum(["in_progress", "completed", "incomplete"])

export const MessageRoleSchema = z.enum(["unknown", "user", "assistant", "system", "critic", "discriminator", "developer", "tool"])

export const InputTextContentSchema = z.object({
  type: z.enum(["input_text"]),
  text: z.string()
}).passthrough()

export const FileCitationBodySchema = z.object({
  type: z.enum(["file_citation"]),
  file_id: z.string(),
  index: z.number(),
  filename: z.string()
}).passthrough()

export const UrlCitationBodySchema = z.object({
  type: z.enum(["url_citation"]),
  url: z.string(),
  start_index: z.number(),
  end_index: z.number(),
  title: z.string()
}).passthrough()

export const ContainerFileCitationBodySchema = z.object({
  type: z.enum(["container_file_citation"]),
  container_id: z.string(),
  file_id: z.string(),
  start_index: z.number(),
  end_index: z.number(),
  filename: z.string()
}).passthrough()

export const TopLogProbSchema = z.object({
  token: z.string(),
  logprob: z.number(),
  bytes: z.array(z.number())
}).passthrough()

export const TextContentSchema = z.object({
  type: z.enum(["text"]),
  text: z.string()
}).passthrough()

export const SummaryTextContentSchema = z.object({
  type: z.enum(["summary_text"]),
  text: z.string()
}).passthrough()

export const ReasoningTextContentSchema = z.object({
  type: z.enum(["reasoning_text"]),
  text: z.string()
}).passthrough()

export const RefusalContentSchema = z.object({
  type: z.enum(["refusal"]),
  refusal: z.string()
}).passthrough()

export const ImageDetailSchema = z.enum(["low", "high", "auto", "original"])

export const FileInputDetailSchema = z.enum(["low", "high"])

export const MessagePhase2Schema = z.enum(["commentary", "final_answer"])

export const FunctionCallStatusSchema = z.enum(["in_progress", "completed", "incomplete"])

export const FunctionCallOutputStatusEnumSchema = z.enum(["in_progress", "completed", "incomplete"])

export const ClickButtonTypeSchema = z.enum(["left", "right", "wheel", "back", "forward"])

export const DoubleClickActionSchema = z.object({
  type: z.enum(["double_click"]),
  x: z.number(),
  y: z.number(),
  keys: z.union([z.array(z.string()), z.null()])
}).passthrough()

export const CoordParamSchema = z.object({
  x: z.number(),
  y: z.number()
}).passthrough()

export const KeyPressActionSchema = z.object({
  type: z.enum(["keypress"]),
  keys: z.array(z.string())
}).passthrough()

export const MoveParamSchema = z.object({
  type: z.enum(["move"]),
  x: z.number(),
  y: z.number(),
  keys: z.union([z.array(z.string()), z.null()]).optional()
}).passthrough()

export const ScreenshotParamSchema = z.object({
  type: z.enum(["screenshot"])
}).passthrough()

export const ScrollParamSchema = z.object({
  type: z.enum(["scroll"]),
  x: z.number(),
  y: z.number(),
  scroll_x: z.number(),
  scroll_y: z.number(),
  keys: z.union([z.array(z.string()), z.null()]).optional()
}).passthrough()

export const TypeParamSchema = z.object({
  type: z.enum(["type"]),
  text: z.string()
}).passthrough()

export const WaitParamSchema = z.object({
  type: z.enum(["wait"])
}).passthrough()

export const ComputerCallSafetyCheckParamSchema = z.object({
  id: z.string(),
  code: z.union([z.string(), z.null()]).optional(),
  message: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const ComputerCallOutputStatusSchema = z.enum(["completed", "incomplete", "failed"])

export const ToolSearchExecutionTypeSchema = z.enum(["server", "client"])

export const FunctionToolSchema = z.object({
  type: z.enum(["function"]),
  name: z.string(),
  description: z.union([z.string(), z.null()]).optional(),
  parameters: z.union([z.record(z.string(), z.unknown()), z.null()]),
  strict: z.union([z.boolean(), z.null()]),
  defer_loading: z.boolean().optional()
}).passthrough()

export const RankerVersionTypeSchema = z.enum(["auto", "default-2024-11-15"])

export const HybridSearchOptionsSchema = z.object({
  embedding_weight: z.number(),
  text_weight: z.number()
}).passthrough()

export const ComputerToolSchema = z.object({
  type: z.enum(["computer"])
}).passthrough()

export const ComputerEnvironmentSchema = z.enum(["windows", "mac", "linux", "ubuntu", "browser"])

export const ContainerMemoryLimitSchema = z.enum(["1g", "4g", "16g", "64g"])

export const InputFidelitySchema = z.enum(["high", "low"])

export const ImageGenActionEnumSchema = z.enum(["generate", "edit", "auto"])

export const LocalShellToolParamSchema = z.object({
  type: z.enum(["local_shell"])
}).passthrough()

export const LocalSkillParamSchema = z.object({
  name: z.string(),
  description: z.string(),
  path: z.string()
}).passthrough()

export const ContainerReferenceParamSchema = z.object({
  type: z.enum(["container_reference"]),
  container_id: z.string()
}).passthrough()

export const CustomTextFormatParamSchema = z.object({
  type: z.enum(["text"])
}).passthrough()

export const GrammarSyntax1Schema = z.enum(["lark", "regex"])

export const EmptyModelParamSchema = z.record(z.string(), z.unknown())

export const ApproximateLocationSchema = z.object({
  type: z.enum(["approximate"]),
  country: z.union([z.string(), z.null()]).optional(),
  region: z.union([z.string(), z.null()]).optional(),
  city: z.union([z.string(), z.null()]).optional(),
  timezone: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const SearchContextSizeSchema = z.enum(["low", "medium", "high"])

export const SearchContentTypeSchema = z.enum(["text", "image"])

export const ApplyPatchToolParamSchema = z.object({
  type: z.enum(["apply_patch"])
}).passthrough()

export const CompactionBodySchema = z.object({
  type: z.enum(["compaction"]),
  id: z.string(),
  encrypted_content: z.string(),
  created_by: z.string().optional()
}).passthrough()

export const CodeInterpreterOutputLogsSchema = z.object({
  type: z.enum(["logs"]),
  logs: z.string()
}).passthrough()

export const CodeInterpreterOutputImageSchema = z.object({
  type: z.enum(["image"]),
  url: z.string()
}).passthrough()

export const LocalShellExecActionSchema = z.object({
  type: z.enum(["exec"]),
  command: z.array(z.string()),
  timeout_ms: z.union([z.number(), z.null()]).optional(),
  working_directory: z.union([z.string(), z.null()]).optional(),
  env: z.record(z.string(), z.string()),
  user: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const FunctionShellActionSchema = z.object({
  commands: z.array(z.string()),
  timeout_ms: z.union([z.number(), z.null()]),
  max_output_length: z.union([z.number(), z.null()])
}).passthrough()

export const FunctionShellCallStatusSchema = z.enum(["in_progress", "completed", "incomplete"])

export const LocalEnvironmentResourceSchema = z.object({
  type: z.enum(["local"])
}).passthrough()

export const ContainerReferenceResourceSchema = z.object({
  type: z.enum(["container_reference"]),
  container_id: z.string()
}).passthrough()

export const FunctionShellCallOutputStatusEnumSchema = z.enum(["in_progress", "completed", "incomplete"])

export const FunctionShellCallOutputTimeoutOutcomeSchema = z.object({
  type: z.enum(["timeout"])
}).passthrough()

export const FunctionShellCallOutputExitOutcomeSchema = z.object({
  type: z.enum(["exit"]),
  exit_code: z.number()
}).passthrough()

export const ApplyPatchCallStatusSchema = z.enum(["in_progress", "completed"])

export const ApplyPatchCreateFileOperationSchema = z.object({
  type: z.enum(["create_file"]),
  path: z.string(),
  diff: z.string()
}).passthrough()

export const ApplyPatchDeleteFileOperationSchema = z.object({
  type: z.enum(["delete_file"]),
  path: z.string()
}).passthrough()

export const ApplyPatchUpdateFileOperationSchema = z.object({
  type: z.enum(["update_file"]),
  path: z.string(),
  diff: z.string()
}).passthrough()

export const ApplyPatchCallOutputStatusSchema = z.enum(["completed", "failed"])

export const MCPToolCallStatusSchema = z.enum(["in_progress", "completed", "incomplete", "calling", "failed"])

export const DetailEnumSchema = z.enum(["low", "high", "auto", "original"])

export const FunctionCallItemStatusSchema = z.enum(["in_progress", "completed", "incomplete"])

export const InputTextContentParamSchema = z.object({
  type: z.enum(["input_text"]),
  text: z.string().max(10485760)
}).passthrough()

export const FileDetailEnumSchema = z.enum(["low", "high"])

export const CompactionSummaryItemParamSchema = z.object({
  id: z.union([z.string(), z.null()]).optional(),
  type: z.enum(["compaction"]),
  encrypted_content: z.string().max(10485760)
}).passthrough()

export const FunctionShellActionParamSchema = z.object({
  commands: z.array(z.string()),
  timeout_ms: z.union([z.number(), z.null()]).optional(),
  max_output_length: z.union([z.number(), z.null()]).optional()
}).passthrough()

export const FunctionShellCallItemStatusSchema = z.enum(["in_progress", "completed", "incomplete"])

export const FunctionShellCallOutputTimeoutOutcomeParamSchema = z.object({
  type: z.enum(["timeout"])
}).passthrough()

export const FunctionShellCallOutputExitOutcomeParamSchema = z.object({
  type: z.enum(["exit"]),
  exit_code: z.number()
}).passthrough()

export const ApplyPatchCallStatusParamSchema = z.enum(["in_progress", "completed"])

export const ApplyPatchCreateFileOperationParamSchema = z.object({
  type: z.enum(["create_file"]),
  path: z.string().min(1),
  diff: z.string().max(10485760)
}).passthrough()

export const ApplyPatchDeleteFileOperationParamSchema = z.object({
  type: z.enum(["delete_file"]),
  path: z.string().min(1)
}).passthrough()

export const ApplyPatchUpdateFileOperationParamSchema = z.object({
  type: z.enum(["update_file"]),
  path: z.string().min(1),
  diff: z.string().max(10485760)
}).passthrough()

export const ApplyPatchCallOutputStatusParamSchema = z.enum(["completed", "failed"])

export const ItemReferenceParamSchema = z.object({
  type: z.union([z.enum(["item_reference"]), z.null()]).optional(),
  id: z.string()
}).passthrough()

export const ConversationResourceSchema = z.object({
  id: z.string(),
  object: z.enum(["conversation"]),
  metadata: z.unknown(),
  created_at: z.number()
}).passthrough()

export const ImageGenOutputTokensDetailsSchema = z.object({
  image_tokens: z.number(),
  text_tokens: z.number()
}).passthrough()

export const ImageGenInputUsageDetailsSchema = z.object({
  text_tokens: z.number(),
  image_tokens: z.number()
}).passthrough()

export const SpecificApplyPatchParamSchema = z.object({
  type: z.enum(["apply_patch"])
}).passthrough()

export const SpecificFunctionShellParamSchema = z.object({
  type: z.enum(["shell"])
}).passthrough()

export const ConversationParam2Schema = z.object({
  id: z.string()
}).passthrough()

export const ContextManagementParamSchema = z.object({
  type: z.string(),
  compact_threshold: z.union([z.number().min(1000), z.null()]).optional()
}).passthrough()

export const Conversation2Schema = z.object({
  id: z.string()
}).passthrough()

export const DeletedConversationResourceSchema = z.object({
  object: z.enum(["conversation.deleted"]),
  deleted: z.boolean(),
  id: z.string()
}).passthrough()

export const OrderEnumSchema = z.enum(["asc", "desc"])

export const VideoModelSchema = z.union([z.string(), z.enum(["sora-2", "sora-2-pro", "sora-2-2025-10-06", "sora-2-pro-2025-10-06", "sora-2-2025-12-08"])])

export const VideoStatusSchema = z.enum(["queued", "in_progress", "completed", "failed"])

export const VideoSizeSchema = z.enum(["720x1280", "1280x720", "1024x1792", "1792x1024"])

export const Error2Schema = z.object({
  code: z.string(),
  message: z.string()
}).passthrough()

export const ImageRefParam2Schema = z.object({
  image_url: z.string().max(20971520).optional(),
  file_id: z.string().optional()
}).passthrough()

export const VideoSecondsSchema = z.enum(["4", "8", "12"])

export const CreateVideoCharacterBodySchema = z.object({
  video: z.string(),
  name: z.string().min(1).max(80)
}).passthrough()

export const VideoCharacterResourceSchema = z.object({
  id: z.union([z.string(), z.null()]),
  name: z.union([z.string(), z.null()]),
  created_at: z.number()
}).passthrough()

export const VideoReferenceInputParamSchema = z.object({
  id: z.string()
}).passthrough()

export const DeletedVideoResourceSchema = z.object({
  object: z.enum(["video.deleted"]),
  deleted: z.boolean(),
  id: z.string()
}).passthrough()

export const VideoContentVariantSchema = z.enum(["video", "thumbnail", "spritesheet"])

export const CreateVideoRemixBodySchema = z.object({
  prompt: z.string().min(1).max(32000)
}).passthrough()

export const TruncationEnumSchema = z.enum(["auto", "disabled"])

export const TokenCountsResourceSchema = z.object({
  object: z.enum(["response.input_tokens"]),
  input_tokens: z.number()
}).passthrough()

export const PromptCacheRetentionEnumSchema = z.enum(["in_memory", "24h"])

export const ServiceTierEnumSchema = z.enum(["auto", "default", "flex", "priority"])

export const SkillResourceSchema = z.object({
  id: z.string(),
  object: z.enum(["skill"]),
  name: z.string(),
  description: z.string(),
  created_at: z.number(),
  default_version: z.string(),
  latest_version: z.string()
}).passthrough()

export const CreateSkillBodySchema = z.object({
  files: z.union([z.array(z.string()).max(500), z.string()])
}).passthrough()

export const SetDefaultSkillVersionBodySchema = z.object({
  default_version: z.string()
}).passthrough()

export const DeletedSkillResourceSchema = z.object({
  object: z.enum(["skill.deleted"]),
  deleted: z.boolean(),
  id: z.string()
}).passthrough()

export const SkillVersionResourceSchema = z.object({
  object: z.enum(["skill.version"]),
  id: z.string(),
  skill_id: z.string(),
  version: z.string(),
  created_at: z.number(),
  name: z.string(),
  description: z.string()
}).passthrough()

export const CreateSkillVersionBodySchema = z.object({
  files: z.union([z.array(z.string()).max(500), z.string()]),
  default: z.boolean().optional()
}).passthrough()

export const DeletedSkillVersionResourceSchema = z.object({
  object: z.enum(["skill.version.deleted"]),
  deleted: z.boolean(),
  id: z.string(),
  version: z.string()
}).passthrough()

export const ChatkitWorkflowTracingSchema = z.object({
  enabled: z.boolean()
}).passthrough()

export const ChatSessionRateLimitsSchema = z.object({
  max_requests_per_1_minute: z.number()
}).passthrough()

export const ChatSessionStatusSchema = z.enum(["active", "expired", "cancelled"])

export const ChatSessionAutomaticThreadTitlingSchema = z.object({
  enabled: z.boolean()
}).passthrough()

export const ChatSessionFileUploadSchema = z.object({
  enabled: z.boolean(),
  max_file_size: z.union([z.number(), z.null()]),
  max_files: z.union([z.number(), z.null()])
}).passthrough()

export const ChatSessionHistorySchema = z.object({
  enabled: z.boolean(),
  recent_threads: z.union([z.number(), z.null()])
}).passthrough()

export const WorkflowTracingParamSchema = z.object({
  enabled: z.boolean().optional()
}).passthrough()

export const ExpiresAfterParamSchema = z.object({
  anchor: z.enum(["created_at"]),
  seconds: z.number().min(1).max(600)
}).passthrough()

export const RateLimitsParamSchema = z.object({
  max_requests_per_1_minute: z.number().min(1).optional()
}).passthrough()

export const AutomaticThreadTitlingParamSchema = z.object({
  enabled: z.boolean().optional()
}).passthrough()

export const FileUploadParamSchema = z.object({
  enabled: z.boolean().optional(),
  max_file_size: z.number().min(1).max(512).optional(),
  max_files: z.number().min(1).optional()
}).passthrough()

export const HistoryParamSchema = z.object({
  enabled: z.boolean().optional(),
  recent_threads: z.number().min(1).optional()
}).passthrough()

export const UserMessageInputTextSchema = z.object({
  type: z.enum(["input_text"]),
  text: z.string()
}).passthrough()

export const UserMessageQuotedTextSchema = z.object({
  type: z.enum(["quoted_text"]),
  text: z.string()
}).passthrough()

export const AttachmentTypeSchema = z.enum(["image", "file"])

export const ToolChoiceSchema = z.object({
  id: z.string()
}).passthrough()

export const FileAnnotationSourceSchema = z.object({
  type: z.enum(["file"]),
  filename: z.string()
}).passthrough()

export const UrlAnnotationSourceSchema = z.object({
  type: z.enum(["url"]),
  url: z.string()
}).passthrough()

export const WidgetMessageItemSchema = z.object({
  id: z.string(),
  object: z.enum(["chatkit.thread_item"]),
  created_at: z.number(),
  thread_id: z.string(),
  type: z.enum(["chatkit.widget"]),
  widget: z.string()
}).passthrough()

export const ClientToolCallStatusSchema = z.enum(["in_progress", "completed"])

export const TaskTypeSchema = z.enum(["custom", "thought"])

export const ActiveStatusSchema = z.object({
  type: z.enum(["active"])
}).passthrough()

export const LockedStatusSchema = z.object({
  type: z.enum(["locked"]),
  reason: z.union([z.string(), z.null()])
}).passthrough()

export const ClosedStatusSchema = z.object({
  type: z.enum(["closed"]),
  reason: z.union([z.string(), z.null()])
}).passthrough()

export const DeletedThreadResourceSchema = z.object({
  id: z.string(),
  object: z.enum(["chatkit.thread.deleted"]),
  deleted: z.boolean()
}).passthrough()

export const DragPointSchema = z.object({
  x: z.number(),
  y: z.number()
}).passthrough()

export const AdminApiKeyCreateResponseSchema = AdminApiKeySchema.and(z.object({
  value: z.string()
}).passthrough())

export const ApiKeyListSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(AdminApiKeySchema),
  has_more: z.boolean(),
  first_id: z.union([z.string(), z.null()]).optional(),
  last_id: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const RoleListResourceSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(AssignedRoleDetailsSchema),
  has_more: z.boolean(),
  next: z.union([z.string(), z.null()])
}).passthrough()

export const AssistantsApiToolChoiceOptionSchema = z.union([z.enum(["none", "auto", "required"]), AssistantsNamedToolChoiceSchema])

export const RealtimeTranscriptionSessionCreateResponseSchema = z.object({
  client_secret: z.object({
  value: z.string(),
  expires_at: z.number()
}).passthrough(),
  modalities: z.unknown().optional(),
  input_audio_format: z.string().optional(),
  input_audio_transcription: AudioTranscriptionResponseSchema.optional(),
  turn_detection: z.object({
  type: z.string().optional(),
  threshold: z.number().optional(),
  prefix_padding_ms: z.number().optional(),
  silence_duration_ms: z.number().optional()
}).passthrough().optional()
}).passthrough()

export const AuditLogActorApiKeySchema = z.object({
  id: z.string().optional(),
  type: z.enum(["user", "service_account"]).optional(),
  user: AuditLogActorUserSchema.optional(),
  service_account: AuditLogActorServiceAccountSchema.optional()
}).passthrough()

export const AuditLogActorSessionSchema = z.object({
  user: AuditLogActorUserSchema.optional(),
  ip_address: z.string().optional()
}).passthrough()

export const ChatCompletionAllowedToolsChoiceSchema = z.object({
  type: z.enum(["allowed_tools"]),
  allowed_tools: ChatCompletionAllowedToolsSchema
}).passthrough()

export const ChatCompletionMessageToolCallsSchema = z.array(z.union([ChatCompletionMessageToolCallSchema, ChatCompletionMessageCustomToolCallSchema]))

export const ChatCompletionStreamResponseDeltaSchema = z.object({
  content: z.union([z.string(), z.null()]).optional(),
  function_call: z.object({
  arguments: z.string().optional(),
  name: z.string().optional()
}).passthrough().optional(),
  tool_calls: z.array(ChatCompletionMessageToolCallChunkSchema).optional(),
  role: z.enum(["developer", "system", "user", "assistant", "tool"]).optional(),
  refusal: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const ChatCompletionRequestAssistantMessageContentPartSchema = z.union([ChatCompletionRequestMessageContentPartTextSchema, ChatCompletionRequestMessageContentPartRefusalSchema])

export const ChatCompletionRequestDeveloperMessageSchema = z.object({
  content: z.union([z.string(), z.array(ChatCompletionRequestMessageContentPartTextSchema).min(1)]),
  role: z.enum(["developer"]),
  name: z.string().optional()
}).passthrough()

export const ChatCompletionRequestSystemMessageContentPartSchema = z.union([ChatCompletionRequestMessageContentPartTextSchema])

export const ChatCompletionRequestToolMessageContentPartSchema = z.union([ChatCompletionRequestMessageContentPartTextSchema])

export const ChatCompletionRequestUserMessageContentPartSchema = z.union([ChatCompletionRequestMessageContentPartTextSchema, ChatCompletionRequestMessageContentPartImageSchema, ChatCompletionRequestMessageContentPartAudioSchema, ChatCompletionRequestMessageContentPartFileSchema])

export const PredictionContentSchema = z.object({
  type: z.enum(["content"]),
  content: z.union([z.string(), z.array(ChatCompletionRequestMessageContentPartTextSchema).min(1)])
}).passthrough()

export const CompoundFilterSchema = z.object({
  type: z.enum(["and", "or"]),
  filters: z.array(z.union([ComparisonFilterSchema, z.unknown()]))
}).passthrough()

export const CreateCompletionResponseSchema = z.object({
  id: z.string(),
  choices: z.array(z.object({
  finish_reason: z.enum(["stop", "length", "content_filter"]),
  index: z.number(),
  logprobs: z.union([z.object({
  text_offset: z.array(z.number()).optional(),
  token_logprobs: z.array(z.number()).optional(),
  tokens: z.array(z.string()).optional(),
  top_logprobs: z.array(z.record(z.string(), z.number())).optional()
}).passthrough(), z.null()]),
  text: z.string()
}).passthrough()),
  created: z.number(),
  model: z.string(),
  system_fingerprint: z.string().optional(),
  object: z.enum(["text_completion"]),
  usage: CompletionUsageSchema.optional()
}).passthrough()

export const ContainerFileListResourceSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(ContainerFileResourceSchema),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean()
}).passthrough()

export const ContainerListResourceSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(ContainerResourceSchema),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean()
}).passthrough()

export const CreateEmbeddingResponseSchema = z.object({
  data: z.array(EmbeddingSchema),
  model: z.string(),
  object: z.enum(["list"]),
  usage: z.object({
  prompt_tokens: z.number(),
  total_tokens: z.number()
}).passthrough()
}).passthrough()

export const ErrorEventSchema = z.object({
  event: z.enum(["error"]),
  data: ErrorSchema
}).passthrough()

export const ErrorResponseSchema = z.object({
  error: ErrorSchema
}).passthrough()

export const CreateEvalJsonlRunDataSourceSchema = z.object({
  type: z.enum(["jsonl"]),
  source: z.union([EvalJsonlFileContentSourceSchema, EvalJsonlFileIdSourceSchema])
}).passthrough()

export const EvalRunOutputItemSchema = z.object({
  object: z.enum(["eval.run.output_item"]),
  id: z.string(),
  run_id: z.string(),
  eval_id: z.string(),
  created_at: z.number(),
  status: z.string(),
  datasource_item_id: z.number(),
  datasource_item: z.record(z.string(), z.unknown()),
  results: z.array(EvalRunOutputItemResultSchema),
  sample: z.object({
  input: z.array(z.object({
  role: z.string(),
  content: z.string()
}).passthrough()),
  output: z.array(z.object({
  role: z.string().optional(),
  content: z.string().optional()
}).passthrough()),
  finish_reason: z.string(),
  model: z.string(),
  usage: z.object({
  total_tokens: z.number(),
  completion_tokens: z.number(),
  prompt_tokens: z.number(),
  cached_tokens: z.number()
}).passthrough(),
  error: EvalApiErrorSchema,
  temperature: z.number(),
  max_completion_tokens: z.number(),
  top_p: z.number(),
  seed: z.number()
}).passthrough()
}).passthrough()

export const CreateFileRequestSchema = z.object({
  file: z.string(),
  purpose: z.enum(["assistants", "batch", "fine-tune", "vision", "user_data", "evals"]),
  expires_after: FileExpirationAfterSchema.optional()
}).passthrough()

export const CreateUploadRequestSchema = z.object({
  filename: z.string(),
  purpose: z.enum(["assistants", "batch", "fine-tune", "vision"]),
  bytes: z.number(),
  mime_type: z.string(),
  expires_after: FileExpirationAfterSchema.optional()
}).passthrough()

export const FileSearchRankingOptionsSchema = z.object({
  ranker: FileSearchRankerSchema.optional(),
  score_threshold: z.number().min(0).max(1)
}).passthrough()

export const RunStepDetailsToolCallsFileSearchRankingOptionsObjectSchema = z.object({
  ranker: FileSearchRankerSchema,
  score_threshold: z.number().min(0).max(1)
}).passthrough()

export const FineTuneDPOMethodSchema = z.object({
  hyperparameters: FineTuneDPOHyperparametersSchema.optional()
}).passthrough()

export const FineTuneSupervisedMethodSchema = z.object({
  hyperparameters: FineTuneSupervisedHyperparametersSchema.optional()
}).passthrough()

export const ListFineTuningCheckpointPermissionResponseSchema = z.object({
  data: z.array(FineTuningCheckpointPermissionSchema),
  object: z.enum(["list"]),
  first_id: z.union([z.string(), z.null()]).optional(),
  last_id: z.union([z.string(), z.null()]).optional(),
  has_more: z.boolean()
}).passthrough()

export const ListFineTuningJobCheckpointsResponseSchema = z.object({
  data: z.array(FineTuningJobCheckpointSchema),
  object: z.enum(["list"]),
  first_id: z.union([z.string(), z.null()]).optional(),
  last_id: z.union([z.string(), z.null()]).optional(),
  has_more: z.boolean()
}).passthrough()

export const ListFineTuningJobEventsResponseSchema = z.object({
  data: z.array(FineTuningJobEventSchema),
  object: z.enum(["list"]),
  has_more: z.boolean()
}).passthrough()

export const ChatCompletionFunctionsSchema = z.object({
  description: z.string().optional(),
  name: z.string(),
  parameters: FunctionParametersSchema.optional()
}).passthrough()

export const FunctionObjectSchema = z.object({
  description: z.string().optional(),
  name: z.string(),
  parameters: FunctionParametersSchema.optional(),
  strict: z.union([z.boolean(), z.null()]).optional()
}).passthrough()

export const EvalGraderPythonSchema = GraderPythonSchema.and(z.object({
  pass_threshold: z.number().optional()
}).passthrough())

export const EvalGraderStringCheckSchema = GraderStringCheckSchema

export const EvalGraderTextSimilaritySchema = GraderTextSimilaritySchema.and(z.object({
  pass_threshold: z.number()
}).passthrough())

export const GroupListResourceSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(GroupResponseSchema),
  has_more: z.boolean(),
  next: z.union([z.string(), z.null()])
}).passthrough()

export const UserListResourceSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(GroupUserSchema),
  has_more: z.boolean(),
  next: z.union([z.string(), z.null()])
}).passthrough()

export const ImageEditCompletedEventSchema = z.object({
  type: z.enum(["image_edit.completed"]),
  b64_json: z.string(),
  created_at: z.number(),
  size: z.enum(["1024x1024", "1024x1536", "1536x1024", "auto"]),
  quality: z.enum(["low", "medium", "high", "auto"]),
  background: z.enum(["transparent", "opaque", "auto"]),
  output_format: z.enum(["png", "webp", "jpeg"]),
  usage: ImagesUsageSchema
}).passthrough()

export const ImageGenCompletedEventSchema = z.object({
  type: z.enum(["image_generation.completed"]),
  b64_json: z.string(),
  created_at: z.number(),
  size: z.enum(["1024x1024", "1024x1536", "1536x1024", "auto"]),
  quality: z.enum(["low", "medium", "high", "auto"]),
  background: z.enum(["transparent", "opaque", "auto"]),
  output_format: z.enum(["png", "webp", "jpeg"]),
  usage: ImagesUsageSchema
}).passthrough()

export const InviteListResponseSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(InviteSchema),
  first_id: z.union([z.string(), z.null()]).optional(),
  last_id: z.union([z.string(), z.null()]).optional(),
  has_more: z.boolean()
}).passthrough()

export const RealtimeBetaServerEventConversationItemInputAudioTranscriptionDeltaSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.input_audio_transcription.delta"]),
  item_id: z.string(),
  content_index: z.number().optional(),
  delta: z.string().optional(),
  logprobs: z.union([z.array(LogProbPropertiesSchema), z.null()]).optional()
}).passthrough()

export const RealtimeServerEventConversationItemInputAudioTranscriptionDeltaSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.input_audio_transcription.delta"]),
  item_id: z.string(),
  content_index: z.number().optional(),
  delta: z.string().optional(),
  logprobs: z.union([z.array(LogProbPropertiesSchema), z.null()]).optional()
}).passthrough()

export const MCPListToolsSchema = z.object({
  type: z.enum(["mcp_list_tools"]),
  id: z.string(),
  server_label: z.string(),
  tools: z.array(MCPListToolsToolSchema),
  error: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const RealtimeMCPListToolsSchema = z.object({
  type: z.enum(["mcp_list_tools"]),
  id: z.string().optional(),
  server_label: z.string(),
  tools: z.array(MCPListToolsToolSchema)
}).passthrough()

export const MCPToolSchema = z.object({
  type: z.enum(["mcp"]),
  server_label: z.string(),
  server_url: z.string().optional(),
  connector_id: z.enum(["connector_dropbox", "connector_gmail", "connector_googlecalendar", "connector_googledrive", "connector_microsoftteams", "connector_outlookcalendar", "connector_outlookemail", "connector_sharepoint"]).optional(),
  authorization: z.string().optional(),
  server_description: z.string().optional(),
  headers: z.union([z.record(z.string(), z.string()), z.null()]).optional(),
  allowed_tools: z.union([z.union([z.array(z.string()), MCPToolFilterSchema]), z.null()]).optional(),
  require_approval: z.union([z.union([z.object({
  always: MCPToolFilterSchema.optional(),
  never: MCPToolFilterSchema.optional()
}).passthrough(), z.enum(["always", "never"])]), z.null()]).optional(),
  defer_loading: z.boolean().optional()
}).passthrough()

export const MessageContentTextObjectSchema = z.object({
  type: z.enum(["text"]),
  text: z.object({
  value: z.string(),
  annotations: z.array(z.union([MessageContentTextAnnotationsFileCitationObjectSchema, MessageContentTextAnnotationsFilePathObjectSchema]))
}).passthrough()
}).passthrough()

export const MessageDeltaContentTextObjectSchema = z.object({
  index: z.number(),
  type: z.enum(["text"]),
  text: z.object({
  value: z.string().optional(),
  annotations: z.array(z.union([MessageDeltaContentTextAnnotationsFileCitationObjectSchema, MessageDeltaContentTextAnnotationsFilePathObjectSchema])).optional()
}).passthrough().optional()
}).passthrough()

export const BatchSchema = z.object({
  id: z.string(),
  object: z.enum(["batch"]),
  endpoint: z.string(),
  model: z.string().optional(),
  errors: z.object({
  object: z.string().optional(),
  data: z.array(z.object({
  code: z.string().optional(),
  message: z.string().optional(),
  param: z.union([z.string(), z.null()]).optional(),
  line: z.union([z.number(), z.null()]).optional()
}).passthrough()).optional()
}).passthrough().optional(),
  input_file_id: z.string(),
  completion_window: z.string(),
  status: z.enum(["validating", "failed", "in_progress", "finalizing", "completed", "expired", "cancelling", "cancelled"]),
  output_file_id: z.string().optional(),
  error_file_id: z.string().optional(),
  created_at: z.number(),
  in_progress_at: z.number().optional(),
  expires_at: z.number().optional(),
  finalizing_at: z.number().optional(),
  completed_at: z.number().optional(),
  failed_at: z.number().optional(),
  expired_at: z.number().optional(),
  cancelling_at: z.number().optional(),
  cancelled_at: z.number().optional(),
  request_counts: z.object({
  total: z.number(),
  completed: z.number(),
  failed: z.number()
}).passthrough().optional(),
  usage: z.object({
  input_tokens: z.number(),
  input_tokens_details: z.object({
  cached_tokens: z.number()
}).passthrough(),
  output_tokens: z.number(),
  output_tokens_details: z.object({
  reasoning_tokens: z.number()
}).passthrough(),
  total_tokens: z.number()
}).passthrough().optional(),
  metadata: MetadataSchema.optional()
}).passthrough()

export const CreateMessageRequestSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.union([z.string(), z.array(z.union([MessageContentImageFileObjectSchema, MessageContentImageUrlObjectSchema, MessageRequestContentTextObjectSchema])).min(1)]),
  attachments: z.union([z.array(z.object({
  file_id: z.string().optional(),
  tools: z.array(z.union([AssistantToolsCodeSchema, AssistantToolsFileSearchTypeOnlySchema])).optional()
}).passthrough()), z.null()]).optional(),
  metadata: MetadataSchema.optional()
}).passthrough()

export const EvalLogsDataSourceConfigSchema = z.object({
  type: z.enum(["logs"]),
  metadata: MetadataSchema.optional(),
  schema: z.record(z.string(), z.unknown())
}).passthrough()

export const EvalStoredCompletionsDataSourceConfigSchema = z.object({
  type: z.enum(["stored_completions"]),
  metadata: MetadataSchema.optional(),
  schema: z.record(z.string(), z.unknown())
}).passthrough()

export const EvalStoredCompletionsSourceSchema = z.object({
  type: z.enum(["stored_completions"]),
  metadata: MetadataSchema.optional(),
  model: z.union([z.string(), z.null()]).optional(),
  created_after: z.union([z.number(), z.null()]).optional(),
  created_before: z.union([z.number(), z.null()]).optional(),
  limit: z.union([z.number(), z.null()]).optional()
}).passthrough()

export const ModifyMessageRequestSchema = z.object({
  metadata: MetadataSchema.optional()
}).passthrough()

export const ModifyRunRequestSchema = z.object({
  metadata: MetadataSchema.optional()
}).passthrough()

export const ModifyThreadRequestSchema = z.object({
  tool_resources: z.union([z.object({
  code_interpreter: z.object({
  file_ids: z.array(z.string()).max(20).optional()
}).passthrough().optional(),
  file_search: z.object({
  vector_store_ids: z.array(z.string()).max(1).optional()
}).passthrough().optional()
}).passthrough(), z.null()]).optional(),
  metadata: MetadataSchema.optional()
}).passthrough()

export const ThreadObjectSchema = z.object({
  id: z.string(),
  object: z.enum(["thread"]),
  created_at: z.number(),
  tool_resources: z.union([z.object({
  code_interpreter: z.object({
  file_ids: z.array(z.string()).max(20).optional()
}).passthrough().optional(),
  file_search: z.object({
  vector_store_ids: z.array(z.string()).max(1).optional()
}).passthrough().optional()
}).passthrough(), z.null()]),
  metadata: MetadataSchema
}).passthrough()

export const UpdateConversationBodySchema = z.object({
  metadata: MetadataSchema
}).passthrough()

export const ListModelsResponseSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(ModelSchema)
}).passthrough()

export const ModelIdsResponsesSchema = z.union([ModelIdsSharedSchema, z.enum(["o1-pro", "o1-pro-2025-03-19", "o3-pro", "o3-pro-2025-06-10", "o3-deep-research", "o3-deep-research-2025-06-26", "o4-mini-deep-research", "o4-mini-deep-research-2025-06-26", "computer-use-preview", "computer-use-preview-2025-03-11", "gpt-5-codex", "gpt-5-pro", "gpt-5-pro-2025-10-06", "gpt-5.1-codex-max"])])

export const RealtimeTranscriptionSessionCreateRequestSchema = z.object({
  turn_detection: z.object({
  type: z.enum(["server_vad"]).optional(),
  threshold: z.number().optional(),
  prefix_padding_ms: z.number().optional(),
  silence_duration_ms: z.number().optional()
}).passthrough().optional(),
  input_audio_noise_reduction: z.object({
  type: NoiseReductionTypeSchema.optional()
}).passthrough().optional(),
  input_audio_format: z.enum(["pcm16", "g711_ulaw", "g711_alaw"]).optional(),
  input_audio_transcription: AudioTranscriptionSchema.optional(),
  include: z.array(z.enum(["item.input_audio_transcription.logprobs"])).optional()
}).passthrough()

export const RealtimeTranslationSessionSchema = z.object({
  id: z.string(),
  type: z.enum(["translation"]),
  expires_at: z.number(),
  model: z.string(),
  audio: z.object({
  input: z.object({
  transcription: z.union([z.object({
  model: z.string()
}).passthrough(), z.null()]).optional(),
  noise_reduction: z.union([z.object({
  type: NoiseReductionTypeSchema
}).passthrough(), z.null()]).optional()
}).passthrough().optional(),
  output: z.object({
  language: z.string().optional()
}).passthrough().optional()
}).passthrough()
}).passthrough()

export const RealtimeTranslationSessionCreateRequestSchema = z.object({
  model: z.string(),
  audio: z.object({
  input: z.object({
  transcription: z.union([z.object({
  model: z.string()
}).passthrough(), z.null()]).optional(),
  noise_reduction: z.union([z.object({
  type: NoiseReductionTypeSchema
}).passthrough(), z.null()]).optional()
}).passthrough().optional(),
  output: z.object({
  language: z.string().optional()
}).passthrough().optional()
}).passthrough().optional()
}).passthrough()

export const RealtimeTranslationSessionUpdateRequestSchema = z.object({
  audio: z.object({
  input: z.object({
  transcription: z.union([z.object({
  model: z.string()
}).passthrough(), z.null()]).optional(),
  noise_reduction: z.union([z.object({
  type: NoiseReductionTypeSchema
}).passthrough(), z.null()]).optional()
}).passthrough().optional(),
  output: z.object({
  language: z.string().optional()
}).passthrough().optional()
}).passthrough().optional()
}).passthrough()

export const ListFilesResponseSchema = z.object({
  object: z.string(),
  data: z.array(OpenAIFileSchema),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean()
}).passthrough()

export const UploadSchema = z.object({
  id: z.string(),
  created_at: z.number(),
  filename: z.string(),
  bytes: z.number(),
  purpose: z.string(),
  status: z.enum(["pending", "completed", "cancelled", "expired"]),
  expires_at: z.number(),
  object: z.enum(["upload"]).optional(),
  file: OpenAIFileSchema.and(z.unknown()).optional()
}).passthrough()

export const ListCertificatesResponseSchema = z.object({
  data: z.array(OrganizationCertificateSchema),
  first_id: z.union([z.string(), z.null()]),
  last_id: z.union([z.string(), z.null()]),
  has_more: z.boolean(),
  object: z.enum(["list"])
}).passthrough()

export const OrganizationCertificateActivationResponseSchema = z.object({
  object: z.enum(["organization.certificate.activation"]),
  data: z.array(OrganizationCertificateSchema)
}).passthrough()

export const OrganizationCertificateDeactivationResponseSchema = z.object({
  object: z.enum(["organization.certificate.deactivation"]),
  data: z.array(OrganizationCertificateSchema)
}).passthrough()

export const ListProjectCertificatesResponseSchema = z.object({
  data: z.array(OrganizationProjectCertificateSchema),
  first_id: z.union([z.string(), z.null()]),
  last_id: z.union([z.string(), z.null()]),
  has_more: z.boolean(),
  object: z.enum(["list"])
}).passthrough()

export const OrganizationProjectCertificateActivationResponseSchema = z.object({
  object: z.enum(["organization.project.certificate.activation"]),
  data: z.array(OrganizationProjectCertificateSchema)
}).passthrough()

export const OrganizationProjectCertificateDeactivationResponseSchema = z.object({
  object: z.enum(["organization.project.certificate.deactivation"]),
  data: z.array(OrganizationProjectCertificateSchema)
}).passthrough()

export const CreateImageRequestSchema = z.object({
  prompt: z.string(),
  model: z.union([z.string(), z.enum(["gpt-image-1.5", "dall-e-2", "dall-e-3", "gpt-image-1", "gpt-image-1-mini"])]).optional(),
  n: z.number().min(1).max(10).optional(),
  quality: z.enum(["standard", "hd", "low", "medium", "high", "auto"]).optional(),
  response_format: z.enum(["url", "b64_json"]).optional(),
  output_format: z.enum(["png", "jpeg", "webp"]).optional(),
  output_compression: z.number().optional(),
  stream: z.boolean().optional(),
  partial_images: PartialImagesSchema.optional(),
  size: z.union([z.string(), z.enum(["auto", "1024x1024", "1536x1024", "1024x1536", "256x256", "512x512", "1792x1024", "1024x1792"])]).optional(),
  moderation: z.enum(["low", "auto"]).optional(),
  background: z.enum(["transparent", "opaque", "auto"]).optional(),
  style: z.enum(["vivid", "natural"]).optional(),
  user: z.string().optional()
}).passthrough()

export const EditImageBodyJsonParamSchema = z.object({
  model: z.union([z.string(), z.enum(["gpt-image-1.5", "gpt-image-1", "gpt-image-1-mini", "chatgpt-image-latest"]), z.null()]).optional(),
  images: z.array(ImageRefParamSchema).min(1).max(16),
  mask: ImageRefParamSchema.optional(),
  prompt: z.string().min(1).max(32000),
  n: z.union([z.number().min(1).max(10), z.null()]).optional(),
  quality: z.union([z.enum(["low", "medium", "high", "auto"]), z.null()]).optional(),
  input_fidelity: z.union([z.enum(["high", "low"]), z.null()]).optional(),
  size: z.union([z.enum(["auto", "1024x1024", "1536x1024", "1024x1536"]), z.null()]).optional(),
  user: z.string().optional(),
  output_format: z.union([z.enum(["png", "jpeg", "webp"]), z.null()]).optional(),
  output_compression: z.union([z.number().min(0).max(100), z.null()]).optional(),
  moderation: z.union([z.enum(["low", "auto"]), z.null()]).optional(),
  background: z.union([z.enum(["transparent", "opaque", "auto"]), z.null()]).optional(),
  stream: z.union([z.boolean(), z.null()]).optional(),
  partial_images: PartialImagesSchema.optional()
}).passthrough()

export const ProjectListResponseSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(ProjectSchema),
  first_id: z.union([z.string(), z.null()]).optional(),
  last_id: z.union([z.string(), z.null()]).optional(),
  has_more: z.boolean()
}).passthrough()

export const ProjectApiKeySchema = z.object({
  object: z.enum(["organization.project.api_key"]),
  redacted_value: z.string(),
  name: z.string(),
  created_at: z.number(),
  last_used_at: z.union([z.number(), z.null()]),
  id: z.string(),
  owner: z.object({
  type: z.enum(["user", "service_account"]).optional(),
  user: ProjectApiKeyOwnerUserSchema.optional(),
  service_account: ProjectApiKeyOwnerServiceAccountSchema.optional()
}).passthrough()
}).passthrough()

export const ProjectGroupListResourceSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(ProjectGroupSchema),
  has_more: z.boolean(),
  next: z.union([z.string(), z.null()])
}).passthrough()

export const ProjectRateLimitListResponseSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(ProjectRateLimitSchema),
  first_id: z.union([z.string(), z.null()]).optional(),
  last_id: z.union([z.string(), z.null()]).optional(),
  has_more: z.boolean()
}).passthrough()

export const ProjectServiceAccountListResponseSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(ProjectServiceAccountSchema),
  first_id: z.union([z.string(), z.null()]).optional(),
  last_id: z.union([z.string(), z.null()]).optional(),
  has_more: z.boolean()
}).passthrough()

export const ProjectServiceAccountCreateResponseSchema = z.object({
  object: z.enum(["organization.project.service_account"]),
  id: z.string(),
  name: z.string(),
  role: z.enum(["member"]),
  created_at: z.number(),
  api_key: z.union([ProjectServiceAccountApiKeySchema, z.null()])
}).passthrough()

export const ProjectUserListResponseSchema = z.object({
  object: z.string(),
  data: z.array(ProjectUserSchema),
  first_id: z.union([z.string(), z.null()]).optional(),
  last_id: z.union([z.string(), z.null()]).optional(),
  has_more: z.boolean()
}).passthrough()

export const RealtimeTranscriptionSessionCreateResponseGASchema = z.object({
  type: z.enum(["transcription"]),
  id: z.string(),
  object: z.string(),
  expires_at: z.number().optional(),
  include: z.array(z.enum(["item.input_audio_transcription.logprobs"])).optional(),
  audio: z.object({
  input: z.object({
  format: RealtimeAudioFormatsSchema.optional(),
  transcription: AudioTranscriptionResponseSchema.optional(),
  noise_reduction: z.object({
  type: NoiseReductionTypeSchema.optional()
}).passthrough().optional(),
  turn_detection: z.union([z.object({
  type: z.string().optional(),
  threshold: z.number().optional(),
  prefix_padding_ms: z.number().optional(),
  silence_duration_ms: z.number().optional()
}).passthrough(), z.null()]).optional()
}).passthrough().optional()
}).passthrough().optional()
}).passthrough()

export const RealtimeMCPToolCallSchema = z.object({
  type: z.enum(["mcp_call"]),
  id: z.string(),
  server_label: z.string(),
  name: z.string(),
  arguments: z.string(),
  approval_request_id: z.union([z.string(), z.null()]).optional(),
  output: z.union([z.string(), z.null()]).optional(),
  error: z.union([z.union([RealtimeMCPProtocolErrorSchema, RealtimeMCPToolExecutionErrorSchema, RealtimeMCPHTTPErrorSchema]), z.null()]).optional()
}).passthrough()

export const RealtimeReasoningSchema = z.object({
  effort: RealtimeReasoningEffortSchema.optional()
}).passthrough()

export const RealtimeTranscriptionSessionCreateRequestGASchema = z.object({
  type: z.enum(["transcription"]),
  audio: z.object({
  input: z.object({
  format: RealtimeAudioFormatsSchema.optional(),
  transcription: AudioTranscriptionSchema.optional(),
  noise_reduction: z.object({
  type: NoiseReductionTypeSchema.optional()
}).passthrough().optional(),
  turn_detection: RealtimeTurnDetectionSchema.optional()
}).passthrough().optional()
}).passthrough().optional(),
  include: z.array(z.enum(["item.input_audio_transcription.logprobs"])).optional()
}).passthrough()

export const EvalResponsesSourceSchema = z.object({
  type: z.enum(["responses"]),
  metadata: z.union([z.record(z.string(), z.unknown()), z.null()]).optional(),
  model: z.union([z.string(), z.null()]).optional(),
  instructions_search: z.union([z.string(), z.null()]).optional(),
  created_after: z.union([z.number().min(0), z.null()]).optional(),
  created_before: z.union([z.number().min(0), z.null()]).optional(),
  reasoning_effort: z.union([ReasoningEffortSchema, z.null()]).optional(),
  temperature: z.union([z.number(), z.null()]).optional(),
  top_p: z.union([z.number(), z.null()]).optional(),
  users: z.union([z.array(z.string()), z.null()]).optional(),
  tools: z.union([z.array(z.string()), z.null()]).optional()
}).passthrough()

export const ReasoningSchema = z.object({
  effort: ReasoningEffortSchema.optional(),
  summary: z.union([z.enum(["auto", "concise", "detailed"]), z.null()]).optional(),
  generate_summary: z.union([z.enum(["auto", "concise", "detailed"]), z.null()]).optional()
}).passthrough()

export const ResponseErrorSchema = z.union([z.object({
  code: ResponseErrorCodeSchema,
  message: z.string()
}).passthrough(), z.null()])

export const ResponseFormatJsonSchemaSchema = z.object({
  type: z.enum(["json_schema"]),
  json_schema: z.object({
  description: z.string().optional(),
  name: z.string(),
  schema: ResponseFormatJsonSchemaSchemaSchema.optional(),
  strict: z.union([z.boolean(), z.null()]).optional()
}).passthrough()
}).passthrough()

export const TextResponseFormatJsonSchemaSchema = z.object({
  type: z.enum(["json_schema"]),
  description: z.string().optional(),
  name: z.string(),
  schema: ResponseFormatJsonSchemaSchemaSchema,
  strict: z.union([z.boolean(), z.null()]).optional()
}).passthrough()

export const ResponseTextDeltaEventSchema = z.object({
  type: z.enum(["response.output_text.delta"]),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  delta: z.string(),
  sequence_number: z.number(),
  logprobs: z.array(ResponseLogProbSchema)
}).passthrough()

export const ResponseTextDoneEventSchema = z.object({
  type: z.enum(["response.output_text.done"]),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  text: z.string(),
  sequence_number: z.number(),
  logprobs: z.array(ResponseLogProbSchema)
}).passthrough()

export const GroupRoleAssignmentSchema = z.object({
  object: z.enum(["group.role"]),
  group: GroupSchema,
  role: RoleSchema
}).passthrough()

export const PublicRoleListResourceSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(RoleSchema),
  has_more: z.boolean(),
  next: z.union([z.string(), z.null()])
}).passthrough()

export const RunStepDeltaStepDetailsToolCallsCodeObjectSchema = z.object({
  index: z.number(),
  id: z.string().optional(),
  type: z.enum(["code_interpreter"]),
  code_interpreter: z.object({
  input: z.string().optional(),
  outputs: z.array(z.union([RunStepDeltaStepDetailsToolCallsCodeOutputLogsObjectSchema, RunStepDeltaStepDetailsToolCallsCodeOutputImageObjectSchema])).optional()
}).passthrough().optional()
}).passthrough()

export const RunStepDetailsToolCallsCodeObjectSchema = z.object({
  id: z.string(),
  type: z.enum(["code_interpreter"]),
  code_interpreter: z.object({
  input: z.string(),
  outputs: z.array(z.union([RunStepDetailsToolCallsCodeOutputLogsObjectSchema, RunStepDetailsToolCallsCodeOutputImageObjectSchema]))
}).passthrough()
}).passthrough()

export const ModelResponsePropertiesSchema = z.object({
  metadata: MetadataSchema.optional(),
  top_logprobs: z.union([z.number().min(0).max(20), z.null()]).optional(),
  temperature: z.union([z.number().min(0).max(2), z.null()]).optional(),
  top_p: z.union([z.number().min(0).max(1), z.null()]).optional(),
  user: z.string().optional(),
  safety_identifier: z.string().max(64).optional(),
  prompt_cache_key: z.string().optional(),
  service_tier: ServiceTierSchema.optional(),
  prompt_cache_retention: z.union([z.enum(["in_memory", "24h"]), z.null()]).optional()
}).passthrough()

export const CreateSpeechResponseStreamEventSchema = z.union([SpeechAudioDeltaEventSchema, SpeechAudioDoneEventSchema])

export const StaticChunkingStrategyRequestParamSchema = z.object({
  type: z.enum(["static"]),
  static: StaticChunkingStrategySchema
}).passthrough()

export const StaticChunkingStrategyResponseParamSchema = z.object({
  type: z.enum(["static"]),
  static: StaticChunkingStrategySchema
}).passthrough()

export const CreateCompletionRequestSchema = z.object({
  model: z.union([z.string(), z.enum(["gpt-3.5-turbo-instruct", "davinci-002", "babbage-002"])]),
  prompt: z.union([z.string(), z.array(z.string()), z.array(z.number()).min(1), z.array(z.array(z.number()).min(1)).min(1)]),
  best_of: z.number().min(0).max(20).optional(),
  echo: z.boolean().optional(),
  frequency_penalty: z.number().min(-2).max(2).optional(),
  logit_bias: z.record(z.string(), z.number()).optional(),
  logprobs: z.number().min(0).max(5).optional(),
  max_tokens: z.number().min(0).optional(),
  n: z.number().min(1).max(128).optional(),
  presence_penalty: z.number().min(-2).max(2).optional(),
  seed: z.number().optional(),
  stop: StopConfigurationSchema.optional(),
  stream: z.boolean().optional(),
  stream_options: ChatCompletionStreamOptionsSchema.optional(),
  suffix: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().min(0).max(1).optional(),
  user: z.string().optional()
}).passthrough()

export const CreateTranscriptionResponseJsonSchema = z.object({
  text: z.string(),
  logprobs: z.array(z.object({
  token: z.string().optional(),
  logprob: z.number().optional(),
  bytes: z.array(z.number()).optional()
}).passthrough()).optional(),
  usage: z.union([TranscriptTextUsageTokensSchema, TranscriptTextUsageDurationSchema]).optional()
}).passthrough()

export const RealtimeBetaServerEventConversationItemInputAudioTranscriptionCompletedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.input_audio_transcription.completed"]),
  item_id: z.string(),
  content_index: z.number(),
  transcript: z.string(),
  logprobs: z.union([z.array(LogProbPropertiesSchema), z.null()]).optional(),
  usage: z.union([TranscriptTextUsageTokensSchema, TranscriptTextUsageDurationSchema])
}).passthrough()

export const RealtimeServerEventConversationItemInputAudioTranscriptionCompletedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.input_audio_transcription.completed"]),
  item_id: z.string(),
  content_index: z.number(),
  transcript: z.string(),
  logprobs: z.union([z.array(LogProbPropertiesSchema), z.null()]).optional(),
  usage: z.union([TranscriptTextUsageTokensSchema, TranscriptTextUsageDurationSchema])
}).passthrough()

export const TranscriptTextDoneEventSchema = z.object({
  type: z.enum(["transcript.text.done"]),
  text: z.string(),
  logprobs: z.array(z.object({
  token: z.string().optional(),
  logprob: z.number().optional(),
  bytes: z.array(z.number()).optional()
}).passthrough()).optional(),
  usage: TranscriptTextUsageTokensSchema.optional()
}).passthrough()

export const CreateTranscriptionResponseDiarizedJsonSchema = z.object({
  task: z.enum(["transcribe"]),
  duration: z.number(),
  text: z.string(),
  segments: z.array(TranscriptionDiarizedSegmentSchema),
  usage: z.union([TranscriptTextUsageTokensSchema, TranscriptTextUsageDurationSchema]).optional()
}).passthrough()

export const CreateTranslationResponseVerboseJsonSchema = z.object({
  language: z.string(),
  duration: z.number(),
  text: z.string(),
  segments: z.array(TranscriptionSegmentSchema).optional()
}).passthrough()

export const CreateTranscriptionResponseVerboseJsonSchema = z.object({
  language: z.string(),
  duration: z.number(),
  text: z.string(),
  words: z.array(TranscriptionWordSchema).optional(),
  segments: z.array(TranscriptionSegmentSchema).optional(),
  usage: TranscriptTextUsageDurationSchema.optional()
}).passthrough()

export const UsageTimeBucketSchema = z.object({
  object: z.enum(["bucket"]),
  start_time: z.number(),
  end_time: z.number(),
  results: z.array(z.union([UsageCompletionsResultSchema, UsageEmbeddingsResultSchema, UsageModerationsResultSchema, UsageImagesResultSchema, UsageAudioSpeechesResultSchema, UsageAudioTranscriptionsResultSchema, UsageVectorStoresResultSchema, UsageCodeInterpreterSessionsResultSchema, CostsResultSchema]))
}).passthrough()

export const UserListResponseSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(UserSchema),
  first_id: z.union([z.string(), z.null()]).optional(),
  last_id: z.union([z.string(), z.null()]).optional(),
  has_more: z.boolean()
}).passthrough()

export const UserRoleAssignmentSchema = z.object({
  object: z.enum(["user.role"]),
  user: UserSchema,
  role: RoleSchema
}).passthrough()

export const CreateTranscriptionRequestSchema = z.object({
  file: z.string(),
  model: z.union([z.string(), z.enum(["whisper-1", "gpt-4o-transcribe", "gpt-4o-mini-transcribe", "gpt-4o-mini-transcribe-2025-12-15", "gpt-4o-transcribe-diarize"])]),
  language: z.string().optional(),
  prompt: z.string().optional(),
  response_format: AudioResponseFormatSchema.optional(),
  temperature: z.number().optional(),
  include: z.array(TranscriptionIncludeSchema).optional(),
  timestamp_granularities: z.array(z.enum(["word", "segment"])).optional(),
  stream: z.union([z.boolean(), z.null()]).optional(),
  chunking_strategy: z.union([z.union([z.enum(["auto"]), VadConfigSchema]), z.null()]).optional(),
  known_speaker_names: z.array(z.string()).max(4).optional(),
  known_speaker_references: z.array(z.string()).max(4).optional()
}).passthrough()

export const TranscriptionChunkingStrategySchema = z.union([z.enum(["auto"]), VadConfigSchema])

export const UpdateVectorStoreRequestSchema = z.object({
  name: z.string().optional(),
  expires_after: VectorStoreExpirationAfterSchema.and(z.unknown()).optional(),
  metadata: MetadataSchema.optional()
}).passthrough()

export const VectorStoreObjectSchema = z.object({
  id: z.string(),
  object: z.enum(["vector_store"]),
  created_at: z.number(),
  name: z.string(),
  usage_bytes: z.number(),
  file_counts: z.object({
  in_progress: z.number(),
  completed: z.number(),
  failed: z.number(),
  cancelled: z.number(),
  total: z.number()
}).passthrough(),
  status: z.enum(["expired", "in_progress", "completed"]),
  expires_after: VectorStoreExpirationAfterSchema.optional(),
  expires_at: z.union([z.number(), z.null()]).optional(),
  last_active_at: z.union([z.number(), z.null()]),
  metadata: MetadataSchema
}).passthrough()

export const FileSearchToolCallSchema = z.object({
  id: z.string(),
  type: z.enum(["file_search_call"]),
  status: z.enum(["in_progress", "searching", "completed", "incomplete", "failed"]),
  queries: z.array(z.string()),
  results: z.union([z.array(z.object({
  file_id: z.string().optional(),
  text: z.string().optional(),
  filename: z.string().optional(),
  attributes: VectorStoreFileAttributesSchema.optional(),
  score: z.number().optional()
}).passthrough()), z.null()]).optional()
}).passthrough()

export const UpdateVectorStoreFileAttributesRequestSchema = z.object({
  attributes: VectorStoreFileAttributesSchema
}).passthrough()

export const VectorStoreSearchResultItemSchema = z.object({
  file_id: z.string(),
  filename: z.string(),
  score: z.number().min(0).max(1),
  attributes: VectorStoreFileAttributesSchema,
  content: z.array(VectorStoreSearchResultContentObjectSchema)
}).passthrough()

export const VoiceConsentListResourceSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(VoiceConsentResourceSchema),
  first_id: z.union([z.string(), z.null()]).optional(),
  last_id: z.union([z.string(), z.null()]).optional(),
  has_more: z.boolean()
}).passthrough()

export const RealtimeSessionCreateResponseSchema = z.object({
  id: z.string().optional(),
  object: z.string().optional(),
  expires_at: z.number().optional(),
  include: z.array(z.enum(["item.input_audio_transcription.logprobs"])).optional(),
  model: z.string().optional(),
  output_modalities: z.unknown().optional(),
  instructions: z.string().optional(),
  audio: z.object({
  input: z.object({
  format: RealtimeAudioFormatsSchema.optional(),
  transcription: AudioTranscriptionResponseSchema.optional(),
  noise_reduction: z.object({
  type: NoiseReductionTypeSchema.optional()
}).passthrough().optional(),
  turn_detection: z.object({
  type: z.string().optional(),
  threshold: z.number().optional(),
  prefix_padding_ms: z.number().optional(),
  silence_duration_ms: z.number().optional()
}).passthrough().optional()
}).passthrough().optional(),
  output: z.object({
  format: RealtimeAudioFormatsSchema.optional(),
  voice: VoiceIdsSharedSchema.optional(),
  speed: z.number().optional()
}).passthrough().optional()
}).passthrough().optional(),
  tracing: z.union([z.enum(["auto"]), z.object({
  workflow_name: z.string().optional(),
  group_id: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
}).passthrough()]).optional(),
  turn_detection: z.object({
  type: z.string().optional(),
  threshold: z.number().optional(),
  prefix_padding_ms: z.number().optional(),
  silence_duration_ms: z.number().optional()
}).passthrough().optional(),
  tools: z.array(RealtimeFunctionToolSchema).optional(),
  tool_choice: z.string().optional(),
  max_output_tokens: z.union([z.number(), z.enum(["inf"])]).optional()
}).passthrough()

export const VoiceIdsOrCustomVoiceSchema = z.union([VoiceIdsSharedSchema, z.object({
  id: z.string()
}).passthrough()])

export const WebSearchToolCallSchema = z.object({
  id: z.string(),
  type: z.enum(["web_search_call"]),
  status: z.enum(["in_progress", "searching", "completed", "failed"]),
  action: z.union([WebSearchActionSearchSchema, WebSearchActionOpenPageSchema, WebSearchActionFindSchema])
}).passthrough()

export const WebSearchToolSchema = z.object({
  type: z.enum(["web_search", "web_search_2025_08_26"]),
  filters: z.union([z.object({
  allowed_domains: z.union([z.array(z.string()), z.null()]).optional()
}).passthrough(), z.null()]).optional(),
  user_location: WebSearchApproximateLocationSchema.optional(),
  search_context_size: z.enum(["low", "medium", "high"]).optional()
}).passthrough()

export const InlineSkillParamSchema = z.object({
  type: z.enum(["inline"]),
  name: z.string(),
  description: z.string(),
  source: InlineSkillSourceParamSchema
}).passthrough()

export const ContainerNetworkPolicyAllowlistParamSchema = z.object({
  type: z.enum(["allowlist"]),
  allowed_domains: z.array(z.string()).min(1),
  domain_secrets: z.array(ContainerNetworkPolicyDomainSecretParamSchema).min(1).optional()
}).passthrough()

export const EvalItemContentItemSchema = z.union([EvalItemContentTextSchema, InputTextContentSchema, EvalItemContentOutputTextSchema, EvalItemInputImageSchema, InputAudioSchema])

export const AnnotationSchema = z.union([FileCitationBodySchema, UrlCitationBodySchema, ContainerFileCitationBodySchema, FilePathSchema])

export const LogProbSchema = z.object({
  token: z.string(),
  logprob: z.number(),
  bytes: z.array(z.number()),
  top_logprobs: z.array(TopLogProbSchema)
}).passthrough()

export const ReasoningItemSchema = z.object({
  type: z.enum(["reasoning"]),
  id: z.string(),
  encrypted_content: z.union([z.string(), z.null()]).optional(),
  summary: z.array(SummaryTextContentSchema),
  content: z.array(ReasoningTextContentSchema).optional(),
  status: z.enum(["in_progress", "completed", "incomplete"]).optional()
}).passthrough()

export const InputImageContentSchema = z.object({
  type: z.enum(["input_image"]),
  image_url: z.union([z.string(), z.null()]).optional(),
  file_id: z.union([z.string(), z.null()]).optional(),
  detail: ImageDetailSchema
}).passthrough()

export const ComputerScreenshotContentSchema = z.object({
  type: z.enum(["computer_screenshot"]),
  image_url: z.union([z.string(), z.null()]),
  file_id: z.union([z.string(), z.null()]),
  detail: ImageDetailSchema
}).passthrough()

export const InputFileContentSchema = z.object({
  type: z.enum(["input_file"]),
  file_id: z.union([z.string(), z.null()]).optional(),
  filename: z.string().optional(),
  file_data: z.string().optional(),
  file_url: z.string().optional(),
  detail: FileInputDetailSchema.optional()
}).passthrough()

export const CustomToolCallResourceSchema = CustomToolCallSchema.and(z.object({
  id: z.string(),
  status: FunctionCallStatusSchema,
  created_by: z.string().optional()
}).passthrough())

export const FunctionToolCallResourceSchema = FunctionToolCallSchema.and(z.object({
  id: z.string(),
  status: FunctionCallStatusSchema,
  created_by: z.string().optional()
}).passthrough())

export const ClickParamSchema = z.object({
  type: z.enum(["click"]),
  button: ClickButtonTypeSchema,
  x: z.number(),
  y: z.number(),
  keys: z.union([z.array(z.string()), z.null()]).optional()
}).passthrough()

export const DragParamSchema = z.object({
  type: z.enum(["drag"]),
  path: z.array(CoordParamSchema),
  keys: z.union([z.array(z.string()), z.null()]).optional()
}).passthrough()

export const ComputerToolCallOutputSchema = z.object({
  type: z.enum(["computer_call_output"]),
  id: z.string().optional(),
  call_id: z.string(),
  acknowledged_safety_checks: z.array(ComputerCallSafetyCheckParamSchema).optional(),
  output: ComputerScreenshotImageSchema,
  status: z.enum(["in_progress", "completed", "incomplete"]).optional()
}).passthrough()

export const ToolSearchCallSchema = z.object({
  type: z.enum(["tool_search_call"]),
  id: z.string(),
  call_id: z.union([z.string(), z.null()]),
  execution: ToolSearchExecutionTypeSchema,
  arguments: z.unknown(),
  status: FunctionCallStatusSchema,
  created_by: z.string().optional()
}).passthrough()

export const RankingOptionsSchema = z.object({
  ranker: RankerVersionTypeSchema.optional(),
  score_threshold: z.number().optional(),
  hybrid_search: HybridSearchOptionsSchema.optional()
}).passthrough()

export const ComputerUsePreviewToolSchema = z.object({
  type: z.enum(["computer_use_preview"]),
  environment: ComputerEnvironmentSchema,
  display_width: z.number(),
  display_height: z.number()
}).passthrough()

export const CreateImageEditRequestSchema = z.object({
  image: z.union([z.string(), z.array(z.string()).max(16)]),
  prompt: z.string(),
  mask: z.string().optional(),
  background: z.enum(["transparent", "opaque", "auto"]).optional(),
  model: z.union([z.string(), z.enum(["gpt-image-1.5", "dall-e-2", "gpt-image-1", "gpt-image-1-mini", "chatgpt-image-latest"])]).optional(),
  n: z.number().min(1).max(10).optional(),
  size: z.union([z.string(), z.enum(["256x256", "512x512", "1024x1024", "1536x1024", "1024x1536", "auto"])]).optional(),
  response_format: z.enum(["url", "b64_json"]).optional(),
  output_format: z.enum(["png", "jpeg", "webp"]).optional(),
  output_compression: z.number().optional(),
  user: z.string().optional(),
  input_fidelity: z.union([InputFidelitySchema, z.null()]).optional(),
  stream: z.boolean().optional(),
  partial_images: PartialImagesSchema.optional(),
  quality: z.enum(["standard", "low", "medium", "high", "auto"]).optional()
}).passthrough()

export const ImageGenToolSchema = z.object({
  type: z.enum(["image_generation"]),
  model: z.union([z.string(), z.enum(["gpt-image-1", "gpt-image-1-mini", "gpt-image-1.5"])]).optional(),
  quality: z.enum(["low", "medium", "high", "auto"]).optional(),
  size: z.union([z.string(), z.enum(["1024x1024", "1024x1536", "1536x1024", "auto"])]).optional(),
  output_format: z.enum(["png", "webp", "jpeg"]).optional(),
  output_compression: z.number().min(0).max(100).optional(),
  moderation: z.enum(["auto", "low"]).optional(),
  background: z.enum(["transparent", "opaque", "auto"]).optional(),
  input_fidelity: z.union([InputFidelitySchema, z.null()]).optional(),
  input_image_mask: z.object({
  image_url: z.string().optional(),
  file_id: z.string().optional()
}).passthrough().optional(),
  partial_images: z.number().min(0).max(3).optional(),
  action: ImageGenActionEnumSchema.optional()
}).passthrough()

export const LocalEnvironmentParamSchema = z.object({
  type: z.enum(["local"]),
  skills: z.array(LocalSkillParamSchema).max(200).optional()
}).passthrough()

export const CustomGrammarFormatParamSchema = z.object({
  type: z.enum(["grammar"]),
  syntax: GrammarSyntax1Schema,
  definition: z.string()
}).passthrough()

export const FunctionToolParamSchema = z.object({
  name: z.string().min(1).max(128).regex(new RegExp("^[a-zA-Z0-9_-]+$")),
  description: z.union([z.string(), z.null()]).optional(),
  parameters: z.union([EmptyModelParamSchema, z.null()]).optional(),
  strict: z.union([z.boolean(), z.null()]).optional(),
  type: z.enum(["function"]),
  defer_loading: z.boolean().optional()
}).passthrough()

export const ToolSearchToolParamSchema = z.object({
  type: z.enum(["tool_search"]),
  execution: ToolSearchExecutionTypeSchema.optional(),
  description: z.union([z.string(), z.null()]).optional(),
  parameters: z.union([EmptyModelParamSchema, z.null()]).optional()
}).passthrough()

export const WebSearchPreviewToolSchema = z.object({
  type: z.enum(["web_search_preview", "web_search_preview_2025_03_11"]),
  user_location: z.union([ApproximateLocationSchema, z.null()]).optional(),
  search_context_size: SearchContextSizeSchema.optional(),
  search_content_types: z.array(SearchContentTypeSchema).optional()
}).passthrough()

export const CodeInterpreterToolCallSchema = z.object({
  type: z.enum(["code_interpreter_call"]),
  id: z.string(),
  status: z.enum(["in_progress", "completed", "incomplete", "interpreting", "failed"]),
  container_id: z.string(),
  code: z.union([z.string(), z.null()]),
  outputs: z.union([z.array(z.union([CodeInterpreterOutputLogsSchema, CodeInterpreterOutputImageSchema])), z.null()])
}).passthrough()

export const LocalShellToolCallSchema = z.object({
  type: z.enum(["local_shell_call"]),
  id: z.string(),
  call_id: z.string(),
  action: LocalShellExecActionSchema,
  status: z.enum(["in_progress", "completed", "incomplete"])
}).passthrough()

export const FunctionShellCallSchema = z.object({
  type: z.enum(["shell_call"]),
  id: z.string(),
  call_id: z.string(),
  action: FunctionShellActionSchema,
  status: FunctionShellCallStatusSchema,
  environment: z.union([z.union([LocalEnvironmentResourceSchema, ContainerReferenceResourceSchema]), z.null()]),
  created_by: z.string().optional()
}).passthrough()

export const FunctionShellCallOutputContentSchema = z.object({
  stdout: z.string(),
  stderr: z.string(),
  outcome: z.union([FunctionShellCallOutputTimeoutOutcomeSchema, FunctionShellCallOutputExitOutcomeSchema]),
  created_by: z.string().optional()
}).passthrough()

export const ApplyPatchToolCallSchema = z.object({
  type: z.enum(["apply_patch_call"]),
  id: z.string(),
  call_id: z.string(),
  status: ApplyPatchCallStatusSchema,
  operation: z.union([ApplyPatchCreateFileOperationSchema, ApplyPatchDeleteFileOperationSchema, ApplyPatchUpdateFileOperationSchema]),
  created_by: z.string().optional()
}).passthrough()

export const ApplyPatchToolCallOutputSchema = z.object({
  type: z.enum(["apply_patch_call_output"]),
  id: z.string(),
  call_id: z.string(),
  status: ApplyPatchCallOutputStatusSchema,
  output: z.union([z.string(), z.null()]).optional(),
  created_by: z.string().optional()
}).passthrough()

export const MCPToolCallSchema = z.object({
  type: z.enum(["mcp_call"]),
  id: z.string(),
  server_label: z.string(),
  name: z.string(),
  arguments: z.string(),
  output: z.union([z.string(), z.null()]).optional(),
  error: z.union([z.string(), z.null()]).optional(),
  status: MCPToolCallStatusSchema.optional(),
  approval_request_id: z.union([z.string(), z.null()]).optional()
}).passthrough()

export const InputImageContentParamAutoParamSchema = z.object({
  type: z.enum(["input_image"]),
  image_url: z.union([z.string().max(20971520), z.null()]).optional(),
  file_id: z.union([z.string(), z.null()]).optional(),
  detail: z.union([DetailEnumSchema, z.null()]).optional()
}).passthrough()

export const ComputerCallOutputItemParamSchema = z.object({
  id: z.union([z.string(), z.null()]).optional(),
  call_id: z.string().min(1).max(64),
  type: z.enum(["computer_call_output"]),
  output: ComputerScreenshotImageSchema,
  acknowledged_safety_checks: z.union([z.array(ComputerCallSafetyCheckParamSchema), z.null()]).optional(),
  status: z.union([FunctionCallItemStatusSchema, z.null()]).optional()
}).passthrough()

export const ToolSearchCallItemParamSchema = z.object({
  id: z.union([z.string(), z.null()]).optional(),
  call_id: z.union([z.string().min(1).max(64), z.null()]).optional(),
  type: z.enum(["tool_search_call"]),
  execution: ToolSearchExecutionTypeSchema.optional(),
  arguments: EmptyModelParamSchema,
  status: z.union([FunctionCallItemStatusSchema, z.null()]).optional()
}).passthrough()

export const InputFileContentParamSchema = z.object({
  type: z.enum(["input_file"]),
  file_id: z.union([z.string(), z.null()]).optional(),
  filename: z.union([z.string(), z.null()]).optional(),
  file_data: z.union([z.string().max(73400320), z.null()]).optional(),
  file_url: z.union([z.string(), z.null()]).optional(),
  detail: FileDetailEnumSchema.optional()
}).passthrough()

export const FunctionShellCallOutputOutcomeParamSchema = z.union([FunctionShellCallOutputTimeoutOutcomeParamSchema, FunctionShellCallOutputExitOutcomeParamSchema])

export const ApplyPatchOperationParamSchema = z.union([ApplyPatchCreateFileOperationParamSchema, ApplyPatchDeleteFileOperationParamSchema, ApplyPatchUpdateFileOperationParamSchema])

export const ApplyPatchToolCallOutputItemParamSchema = z.object({
  type: z.enum(["apply_patch_call_output"]),
  id: z.union([z.string(), z.null()]).optional(),
  call_id: z.string().min(1).max(64),
  status: ApplyPatchCallOutputStatusParamSchema,
  output: z.union([z.string().max(10485760), z.null()]).optional()
}).passthrough()

export const ImageGenUsageSchema = z.object({
  input_tokens: z.number(),
  total_tokens: z.number(),
  output_tokens: z.number(),
  output_tokens_details: ImageGenOutputTokensDetailsSchema.optional(),
  input_tokens_details: ImageGenInputUsageDetailsSchema
}).passthrough()

export const ToolChoiceParamSchema = z.union([ToolChoiceOptionsSchema, ToolChoiceAllowedSchema, ToolChoiceTypesSchema, ToolChoiceFunctionSchema, ToolChoiceMCPSchema, ToolChoiceCustomSchema, SpecificApplyPatchParamSchema, SpecificFunctionShellParamSchema])

export const ConversationParamSchema = z.union([z.string(), ConversationParam2Schema])

export const DeletedConversationSchema = DeletedConversationResourceSchema

export const VideoResourceSchema = z.object({
  id: z.string(),
  object: z.enum(["video"]),
  model: VideoModelSchema,
  status: VideoStatusSchema,
  progress: z.number(),
  created_at: z.number(),
  completed_at: z.union([z.number(), z.null()]),
  expires_at: z.union([z.number(), z.null()]),
  prompt: z.union([z.string(), z.null()]),
  size: VideoSizeSchema,
  seconds: z.string(),
  remixed_from_video_id: z.union([z.string(), z.null()]),
  error: z.union([Error2Schema, z.null()])
}).passthrough()

export const CreateVideoMultipartBodySchema = z.object({
  model: VideoModelSchema.optional(),
  prompt: z.string().min(1).max(32000),
  input_reference: z.union([z.string(), ImageRefParam2Schema]).optional(),
  seconds: VideoSecondsSchema.optional(),
  size: VideoSizeSchema.optional()
}).passthrough()

export const CreateVideoJsonBodySchema = z.object({
  model: VideoModelSchema.optional(),
  prompt: z.string().min(1).max(32000),
  input_reference: ImageRefParam2Schema.optional(),
  seconds: VideoSecondsSchema.optional(),
  size: VideoSizeSchema.optional()
}).passthrough()

export const CreateVideoEditMultipartBodySchema = z.object({
  video: z.union([z.string(), VideoReferenceInputParamSchema]),
  prompt: z.string().min(1).max(32000)
}).passthrough()

export const CreateVideoEditJsonBodySchema = z.object({
  video: VideoReferenceInputParamSchema,
  prompt: z.string().min(1).max(32000)
}).passthrough()

export const CreateVideoExtendMultipartBodySchema = z.object({
  video: z.union([VideoReferenceInputParamSchema, z.string()]),
  prompt: z.string().min(1).max(32000),
  seconds: VideoSecondsSchema
}).passthrough()

export const CreateVideoExtendJsonBodySchema = z.object({
  video: VideoReferenceInputParamSchema,
  prompt: z.string().min(1).max(32000),
  seconds: VideoSecondsSchema
}).passthrough()

export const SkillListResourceSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(SkillResourceSchema),
  first_id: z.union([z.string(), z.null()]),
  last_id: z.union([z.string(), z.null()]),
  has_more: z.boolean()
}).passthrough()

export const SkillVersionListResourceSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(SkillVersionResourceSchema),
  first_id: z.union([z.string(), z.null()]),
  last_id: z.union([z.string(), z.null()]),
  has_more: z.boolean()
}).passthrough()

export const ChatkitWorkflowSchema = z.object({
  id: z.string(),
  version: z.union([z.string(), z.null()]),
  state_variables: z.union([z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.number()])), z.null()]),
  tracing: ChatkitWorkflowTracingSchema
}).passthrough()

export const ChatSessionChatkitConfigurationSchema = z.object({
  automatic_thread_titling: ChatSessionAutomaticThreadTitlingSchema,
  file_upload: ChatSessionFileUploadSchema,
  history: ChatSessionHistorySchema
}).passthrough()

export const WorkflowParamSchema = z.object({
  id: z.string(),
  version: z.string().optional(),
  state_variables: z.record(z.string(), z.union([z.string().max(10485760), z.number(), z.boolean(), z.number()])).optional(),
  tracing: WorkflowTracingParamSchema.optional()
}).passthrough()

export const ChatkitConfigurationParamSchema = z.object({
  automatic_thread_titling: AutomaticThreadTitlingParamSchema.optional(),
  file_upload: FileUploadParamSchema.optional(),
  history: HistoryParamSchema.optional()
}).passthrough()

export const AttachmentSchema = z.object({
  type: AttachmentTypeSchema,
  id: z.string(),
  name: z.string(),
  mime_type: z.string(),
  preview_url: z.union([z.string(), z.null()])
}).passthrough()

export const InferenceOptionsSchema = z.object({
  tool_choice: z.union([ToolChoiceSchema, z.null()]),
  model: z.union([z.string(), z.null()])
}).passthrough()

export const FileAnnotationSchema = z.object({
  type: z.enum(["file"]),
  source: FileAnnotationSourceSchema
}).passthrough()

export const UrlAnnotationSchema = z.object({
  type: z.enum(["url"]),
  source: UrlAnnotationSourceSchema
}).passthrough()

export const ClientToolCallItemSchema = z.object({
  id: z.string(),
  object: z.enum(["chatkit.thread_item"]),
  created_at: z.number(),
  thread_id: z.string(),
  type: z.enum(["chatkit.client_tool_call"]),
  status: ClientToolCallStatusSchema,
  call_id: z.string(),
  name: z.string(),
  arguments: z.string(),
  output: z.union([z.string(), z.null()])
}).passthrough()

export const TaskItemSchema = z.object({
  id: z.string(),
  object: z.enum(["chatkit.thread_item"]),
  created_at: z.number(),
  thread_id: z.string(),
  type: z.enum(["chatkit.task"]),
  task_type: TaskTypeSchema,
  heading: z.union([z.string(), z.null()]),
  summary: z.union([z.string(), z.null()])
}).passthrough()

export const TaskGroupTaskSchema = z.object({
  type: TaskTypeSchema,
  heading: z.union([z.string(), z.null()]),
  summary: z.union([z.string(), z.null()])
}).passthrough()

export const ThreadResourceSchema = z.object({
  id: z.string(),
  object: z.enum(["chatkit.thread"]),
  created_at: z.number(),
  title: z.union([z.string(), z.null()]),
  status: z.union([ActiveStatusSchema, LockedStatusSchema, ClosedStatusSchema]),
  user: z.string()
}).passthrough()

export const RealtimeBetaServerEventTranscriptionSessionCreatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["transcription_session.created"]),
  session: RealtimeTranscriptionSessionCreateResponseSchema
}).passthrough()

export const RealtimeBetaServerEventTranscriptionSessionUpdatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["transcription_session.updated"]),
  session: RealtimeTranscriptionSessionCreateResponseSchema
}).passthrough()

export const RealtimeServerEventTranscriptionSessionUpdatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["transcription_session.updated"]),
  session: RealtimeTranscriptionSessionCreateResponseSchema
}).passthrough()

export const AuditLogActorSchema = z.object({
  type: z.enum(["session", "api_key"]).optional(),
  session: AuditLogActorSessionSchema.optional(),
  api_key: AuditLogActorApiKeySchema.optional()
}).passthrough()

export const ChatCompletionToolChoiceOptionSchema = z.union([z.enum(["none", "auto", "required"]), ChatCompletionAllowedToolsChoiceSchema, ChatCompletionNamedToolChoiceSchema, ChatCompletionNamedToolChoiceCustomSchema])

export const ChatCompletionResponseMessageSchema = z.object({
  content: z.union([z.string(), z.null()]),
  refusal: z.union([z.string(), z.null()]),
  tool_calls: ChatCompletionMessageToolCallsSchema.optional(),
  annotations: z.array(z.object({
  type: z.enum(["url_citation"]),
  url_citation: z.object({
  end_index: z.number(),
  start_index: z.number(),
  url: z.string(),
  title: z.string()
}).passthrough()
}).passthrough()).optional(),
  role: z.enum(["assistant"]),
  function_call: z.object({
  arguments: z.string(),
  name: z.string()
}).passthrough().optional(),
  audio: z.union([z.object({
  id: z.string(),
  expires_at: z.number(),
  data: z.string(),
  transcript: z.string()
}).passthrough(), z.null()]).optional()
}).passthrough()

export const CreateChatCompletionStreamResponseSchema = z.object({
  id: z.string(),
  choices: z.array(z.object({
  delta: ChatCompletionStreamResponseDeltaSchema,
  logprobs: z.object({
  content: z.array(ChatCompletionTokenLogprobSchema),
  refusal: z.array(ChatCompletionTokenLogprobSchema)
}).passthrough().optional(),
  finish_reason: z.enum(["stop", "length", "tool_calls", "content_filter", "function_call"]),
  index: z.number()
}).passthrough()),
  created: z.number(),
  model: z.string(),
  service_tier: ServiceTierSchema.optional(),
  system_fingerprint: z.string().optional(),
  object: z.enum(["chat.completion.chunk"]),
  usage: CompletionUsageSchema.optional()
}).passthrough()

export const ChatCompletionRequestAssistantMessageSchema = z.object({
  content: z.union([z.union([z.string(), z.array(ChatCompletionRequestAssistantMessageContentPartSchema).min(1)]), z.null()]).optional(),
  refusal: z.union([z.string(), z.null()]).optional(),
  role: z.enum(["assistant"]),
  name: z.string().optional(),
  audio: z.union([z.object({
  id: z.string()
}).passthrough(), z.null()]).optional(),
  tool_calls: ChatCompletionMessageToolCallsSchema.optional(),
  function_call: z.union([z.object({
  arguments: z.string(),
  name: z.string()
}).passthrough(), z.null()]).optional()
}).passthrough()

export const ChatCompletionRequestSystemMessageSchema = z.object({
  content: z.union([z.string(), z.array(ChatCompletionRequestSystemMessageContentPartSchema).min(1)]),
  role: z.enum(["system"]),
  name: z.string().optional()
}).passthrough()

export const ChatCompletionRequestToolMessageSchema = z.object({
  role: z.enum(["tool"]),
  content: z.union([z.string(), z.array(ChatCompletionRequestToolMessageContentPartSchema).min(1)]),
  tool_call_id: z.string()
}).passthrough()

export const ChatCompletionRequestUserMessageSchema = z.object({
  content: z.union([z.string(), z.array(ChatCompletionRequestUserMessageContentPartSchema).min(1)]),
  role: z.enum(["user"]),
  name: z.string().optional()
}).passthrough()

export const VectorStoreSearchRequestSchema = z.object({
  query: z.union([z.string(), z.array(z.string())]),
  rewrite_query: z.boolean().optional(),
  max_num_results: z.number().min(1).max(50).optional(),
  filters: z.union([ComparisonFilterSchema, CompoundFilterSchema]).optional(),
  ranking_options: z.object({
  ranker: z.enum(["none", "auto", "default-2024-11-15"]).optional(),
  score_threshold: z.number().min(0).max(1).optional()
}).passthrough().optional()
}).passthrough()

export const FiltersSchema = z.union([ComparisonFilterSchema, CompoundFilterSchema])

export const EvalRunOutputItemListSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(EvalRunOutputItemSchema),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean()
}).passthrough()

export const AssistantToolsFileSearchSchema = z.object({
  type: z.enum(["file_search"]),
  file_search: z.object({
  max_num_results: z.number().min(1).max(50).optional(),
  ranking_options: FileSearchRankingOptionsSchema.optional()
}).passthrough().optional()
}).passthrough()

export const RunStepDetailsToolCallsFileSearchObjectSchema = z.object({
  id: z.string(),
  type: z.enum(["file_search"]),
  file_search: z.object({
  ranking_options: RunStepDetailsToolCallsFileSearchRankingOptionsObjectSchema.optional(),
  results: z.array(RunStepDetailsToolCallsFileSearchResultObjectSchema).optional()
}).passthrough()
}).passthrough()

export const AssistantToolsFunctionSchema = z.object({
  type: z.enum(["function"]),
  function: FunctionObjectSchema
}).passthrough()

export const ChatCompletionToolSchema = z.object({
  type: z.enum(["function"]),
  function: FunctionObjectSchema
}).passthrough()

export const ImageEditStreamEventSchema = z.union([ImageEditPartialImageEventSchema, ImageEditCompletedEventSchema])

export const ImageGenStreamEventSchema = z.union([ImageGenPartialImageEventSchema, ImageGenCompletedEventSchema])

export const MessageObjectSchema = z.object({
  id: z.string(),
  object: z.enum(["thread.message"]),
  created_at: z.number(),
  thread_id: z.string(),
  status: z.enum(["in_progress", "incomplete", "completed"]),
  incomplete_details: z.union([z.object({
  reason: z.enum(["content_filter", "max_tokens", "run_cancelled", "run_expired", "run_failed"])
}).passthrough(), z.null()]),
  completed_at: z.union([z.number(), z.null()]),
  incomplete_at: z.union([z.number(), z.null()]),
  role: z.enum(["user", "assistant"]),
  content: z.array(z.union([MessageContentImageFileObjectSchema, MessageContentImageUrlObjectSchema, MessageContentTextObjectSchema, MessageContentRefusalObjectSchema])),
  assistant_id: z.union([z.string(), z.null()]),
  run_id: z.union([z.string(), z.null()]),
  attachments: z.union([z.array(z.object({
  file_id: z.string().optional(),
  tools: z.array(z.union([AssistantToolsCodeSchema, AssistantToolsFileSearchTypeOnlySchema])).optional()
}).passthrough()), z.null()]),
  metadata: MetadataSchema
}).passthrough()

export const MessageDeltaObjectSchema = z.object({
  id: z.string(),
  object: z.enum(["thread.message.delta"]),
  delta: z.object({
  role: z.enum(["user", "assistant"]).optional(),
  content: z.array(z.union([MessageDeltaContentImageFileObjectSchema, MessageDeltaContentTextObjectSchema, MessageDeltaContentRefusalObjectSchema, MessageDeltaContentImageUrlObjectSchema])).optional()
}).passthrough()
}).passthrough()

export const ListBatchesResponseSchema = z.object({
  data: z.array(BatchSchema),
  first_id: z.string().optional(),
  last_id: z.string().optional(),
  has_more: z.boolean(),
  object: z.enum(["list"])
}).passthrough()

export const CreateThreadRequestSchema = z.object({
  messages: z.array(CreateMessageRequestSchema).optional(),
  tool_resources: z.union([z.object({
  code_interpreter: z.object({
  file_ids: z.array(z.string()).max(20).optional()
}).passthrough().optional(),
  file_search: z.union([z.unknown(), z.unknown()]).optional()
}).passthrough(), z.null()]).optional(),
  metadata: MetadataSchema.optional()
}).passthrough()

export const ThreadStreamEventSchema = z.union([z.object({
  enabled: z.boolean().optional(),
  event: z.enum(["thread.created"]),
  data: ThreadObjectSchema
}).passthrough()])

export const ModelIdsSchema = z.union([ModelIdsSharedSchema, ModelIdsResponsesSchema])

export const ModelIdsCompactionSchema = z.union([ModelIdsResponsesSchema, z.string(), z.null()])

export const RealtimeBetaClientEventTranscriptionSessionUpdateSchema = z.object({
  event_id: z.string().optional(),
  type: z.enum(["transcription_session.update"]),
  session: RealtimeTranscriptionSessionCreateRequestSchema
}).passthrough()

export const RealtimeClientEventTranscriptionSessionUpdateSchema = z.object({
  event_id: z.string().optional(),
  type: z.enum(["transcription_session.update"]),
  session: RealtimeTranscriptionSessionCreateRequestSchema
}).passthrough()

export const RealtimeTranslationClientSecretCreateResponseSchema = z.object({
  value: z.string(),
  expires_at: z.number(),
  session: RealtimeTranslationSessionSchema
}).passthrough()

export const RealtimeTranslationServerEventSessionCreatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["session.created"]),
  session: RealtimeTranslationSessionSchema
}).passthrough()

export const RealtimeTranslationServerEventSessionUpdatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["session.updated"]),
  session: RealtimeTranslationSessionSchema
}).passthrough()

export const RealtimeTranslationClientSecretCreateRequestSchema = z.object({
  expires_after: z.object({
  anchor: z.enum(["created_at"]).optional(),
  seconds: z.number().min(10).max(7200).optional()
}).passthrough().optional(),
  session: RealtimeTranslationSessionCreateRequestSchema
}).passthrough()

export const RealtimeTranslationClientEventSessionUpdateSchema = z.object({
  event_id: z.string().max(512).optional(),
  type: z.enum(["session.update"]),
  session: RealtimeTranslationSessionUpdateRequestSchema
}).passthrough()

export const ProjectApiKeyListResponseSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(ProjectApiKeySchema),
  first_id: z.union([z.string(), z.null()]).optional(),
  last_id: z.union([z.string(), z.null()]).optional(),
  has_more: z.boolean()
}).passthrough()

export const RealtimeConversationItemSchema = z.union([RealtimeConversationItemMessageSystemSchema, RealtimeConversationItemMessageUserSchema, RealtimeConversationItemMessageAssistantSchema, RealtimeConversationItemFunctionCallSchema, RealtimeConversationItemFunctionCallOutputSchema, RealtimeMCPApprovalResponseSchema, RealtimeMCPListToolsSchema, RealtimeMCPToolCallSchema, RealtimeMCPApprovalRequestSchema])

export const AssistantsApiResponseFormatOptionSchema = z.union([z.enum(["auto"]), ResponseFormatTextSchema, ResponseFormatJsonObjectSchema, ResponseFormatJsonSchemaSchema])

export const TextResponseFormatConfigurationSchema = z.union([ResponseFormatTextSchema, TextResponseFormatJsonSchemaSchema, ResponseFormatJsonObjectSchema])

export const RunStepDeltaStepDetailsToolCallsObjectSchema = z.object({
  type: z.enum(["tool_calls"]),
  tool_calls: z.array(z.union([RunStepDeltaStepDetailsToolCallsCodeObjectSchema, RunStepDeltaStepDetailsToolCallsFileSearchObjectSchema, RunStepDeltaStepDetailsToolCallsFunctionObjectSchema])).optional()
}).passthrough()

export const CreateModelResponsePropertiesSchema = ModelResponsePropertiesSchema.and(z.object({
  top_logprobs: z.number().min(0).max(20).optional()
}).passthrough())

export const ChunkingStrategyRequestParamSchema = z.union([AutoChunkingStrategyRequestParamSchema, StaticChunkingStrategyRequestParamSchema])

export const CreateVectorStoreRequestSchema = z.object({
  file_ids: z.array(z.string()).max(500).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  expires_after: VectorStoreExpirationAfterSchema.optional(),
  chunking_strategy: z.union([AutoChunkingStrategyRequestParamSchema, StaticChunkingStrategyRequestParamSchema]).optional(),
  metadata: MetadataSchema.optional()
}).passthrough()

export const VectorStoreFileObjectSchema = z.object({
  id: z.string(),
  object: z.enum(["vector_store.file"]),
  usage_bytes: z.number(),
  created_at: z.number(),
  vector_store_id: z.string(),
  status: z.enum(["in_progress", "completed", "cancelled", "failed"]),
  last_error: z.union([z.object({
  code: z.enum(["server_error", "unsupported_file", "invalid_file"]),
  message: z.string()
}).passthrough(), z.null()]),
  chunking_strategy: z.union([StaticChunkingStrategyResponseParamSchema, OtherChunkingStrategyResponseParamSchema]).optional(),
  attributes: VectorStoreFileAttributesSchema.optional()
}).passthrough()

export const CreateTranscriptionResponseStreamEventSchema = z.union([TranscriptTextSegmentEventSchema, TranscriptTextDeltaEventSchema, TranscriptTextDoneEventSchema])

export const UsageResponseSchema = z.object({
  object: z.enum(["page"]),
  data: z.array(UsageTimeBucketSchema),
  has_more: z.boolean(),
  next_page: z.union([z.string(), z.null()])
}).passthrough()

export const ListVectorStoresResponseSchema = z.unknown()

export const VectorStoreSearchResultsPageSchema = z.object({
  object: z.enum(["vector_store.search_results.page"]),
  search_query: z.array(z.string()),
  data: z.array(VectorStoreSearchResultItemSchema),
  has_more: z.boolean(),
  next_page: z.union([z.string(), z.null()])
}).passthrough()

export const CreateSpeechRequestSchema = z.object({
  model: z.union([z.string(), z.enum(["tts-1", "tts-1-hd", "gpt-4o-mini-tts", "gpt-4o-mini-tts-2025-12-15"])]),
  input: z.string().max(4096),
  instructions: z.string().max(4096).optional(),
  voice: VoiceIdsOrCustomVoiceSchema,
  response_format: z.enum(["mp3", "opus", "aac", "flac", "wav", "pcm"]).optional(),
  speed: z.number().min(0.25).max(4).optional(),
  stream_format: z.enum(["sse", "audio"]).optional()
}).passthrough()

export const CreateContainerBodySchema = z.object({
  name: z.string(),
  file_ids: z.array(z.string()).optional(),
  expires_after: z.object({
  anchor: z.enum(["last_active_at"]),
  minutes: z.number()
}).passthrough().optional(),
  skills: z.array(z.union([SkillReferenceParamSchema, InlineSkillParamSchema])).optional(),
  memory_limit: z.enum(["1g", "4g", "16g", "64g"]).optional(),
  network_policy: z.union([ContainerNetworkPolicyDisabledParamSchema, ContainerNetworkPolicyAllowlistParamSchema]).optional()
}).passthrough()

export const AutoCodeInterpreterToolParamSchema = z.object({
  type: z.enum(["auto"]),
  file_ids: z.array(z.string()).max(50).optional(),
  memory_limit: z.union([ContainerMemoryLimitSchema, z.null()]).optional(),
  network_policy: z.union([ContainerNetworkPolicyDisabledParamSchema, ContainerNetworkPolicyAllowlistParamSchema]).optional()
}).passthrough()

export const ContainerAutoParamSchema = z.object({
  type: z.enum(["container_auto"]),
  file_ids: z.array(z.string()).max(50).optional(),
  memory_limit: z.union([ContainerMemoryLimitSchema, z.null()]).optional(),
  network_policy: z.union([ContainerNetworkPolicyDisabledParamSchema, ContainerNetworkPolicyAllowlistParamSchema]).optional(),
  skills: z.array(z.union([SkillReferenceParamSchema, InlineSkillParamSchema])).max(200).optional()
}).passthrough()

export const EvalItemContentArraySchema = z.array(EvalItemContentItemSchema)

export const OutputTextContentSchema = z.object({
  type: z.enum(["output_text"]),
  text: z.string(),
  annotations: z.array(AnnotationSchema),
  logprobs: z.array(LogProbSchema)
}).passthrough()

export const FunctionAndCustomToolCallOutputSchema = z.union([InputTextContentSchema, InputImageContentSchema, InputFileContentSchema])

export const InputContentSchema = z.union([InputTextContentSchema, InputImageContentSchema, InputFileContentSchema])

export const ResponsePromptVariablesSchema = z.union([z.record(z.string(), z.union([z.string(), InputTextContentSchema, InputImageContentSchema, InputFileContentSchema])), z.null()])

export const ComputerActionSchema = z.union([ClickParamSchema, DoubleClickActionSchema, DragParamSchema, KeyPressActionSchema, MoveParamSchema, ScreenshotParamSchema, ScrollParamSchema, TypeParamSchema, WaitParamSchema])

export const ComputerToolCallOutputResourceSchema = ComputerToolCallOutputSchema.and(z.object({
  id: z.string(),
  status: ComputerCallOutputStatusSchema,
  created_by: z.string().optional()
}).passthrough())

export const FunctionShellCallItemParamSchema = z.object({
  id: z.union([z.string(), z.null()]).optional(),
  call_id: z.string().min(1).max(64),
  type: z.enum(["shell_call"]),
  action: FunctionShellActionParamSchema,
  status: z.union([FunctionShellCallItemStatusSchema, z.null()]).optional(),
  environment: z.union([z.union([LocalEnvironmentParamSchema, ContainerReferenceParamSchema]), z.null()]).optional()
}).passthrough()

export const CustomToolParamSchema = z.object({
  type: z.enum(["custom"]),
  name: z.string(),
  description: z.string().optional(),
  format: z.union([CustomTextFormatParamSchema, CustomGrammarFormatParamSchema]).optional(),
  defer_loading: z.boolean().optional()
}).passthrough()

export const FunctionShellCallOutputSchema = z.object({
  type: z.enum(["shell_call_output"]),
  id: z.string(),
  call_id: z.string(),
  status: FunctionShellCallOutputStatusEnumSchema,
  output: z.array(FunctionShellCallOutputContentSchema),
  max_output_length: z.union([z.number(), z.null()]),
  created_by: z.string().optional()
}).passthrough()

export const FunctionCallOutputItemParamSchema = z.object({
  id: z.union([z.string(), z.null()]).optional(),
  call_id: z.string().min(1).max(64),
  type: z.enum(["function_call_output"]),
  output: z.union([z.string().max(10485760), z.array(z.union([InputTextContentParamSchema, InputImageContentParamAutoParamSchema, InputFileContentParamSchema]))]),
  status: z.union([FunctionCallItemStatusSchema, z.null()]).optional()
}).passthrough()

export const FunctionShellCallOutputContentParamSchema = z.object({
  stdout: z.string().max(10485760),
  stderr: z.string().max(10485760),
  outcome: FunctionShellCallOutputOutcomeParamSchema
}).passthrough()

export const ApplyPatchToolCallItemParamSchema = z.object({
  type: z.enum(["apply_patch_call"]),
  id: z.union([z.string(), z.null()]).optional(),
  call_id: z.string().min(1).max(64),
  status: ApplyPatchCallStatusParamSchema,
  operation: ApplyPatchOperationParamSchema
}).passthrough()

export const ImagesResponseSchema = z.object({
  created: z.number(),
  data: z.array(ImageSchema).optional(),
  background: z.enum(["transparent", "opaque"]).optional(),
  output_format: z.enum(["png", "webp", "jpeg"]).optional(),
  size: z.enum(["1024x1024", "1024x1536", "1536x1024"]).optional(),
  quality: z.enum(["low", "medium", "high"]).optional(),
  usage: ImageGenUsageSchema.optional()
}).passthrough()

export const VideoListResourceSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(VideoResourceSchema),
  first_id: z.union([z.string(), z.null()]),
  last_id: z.union([z.string(), z.null()]),
  has_more: z.boolean()
}).passthrough()

export const ChatSessionResourceSchema = z.object({
  id: z.string(),
  object: z.enum(["chatkit.session"]),
  expires_at: z.number(),
  client_secret: z.string(),
  workflow: ChatkitWorkflowSchema,
  user: z.string(),
  rate_limits: ChatSessionRateLimitsSchema,
  max_requests_per_1_minute: z.number(),
  status: ChatSessionStatusSchema,
  chatkit_configuration: ChatSessionChatkitConfigurationSchema
}).passthrough()

export const CreateChatSessionBodySchema = z.object({
  workflow: WorkflowParamSchema,
  user: z.string().min(1),
  expires_after: ExpiresAfterParamSchema.optional(),
  rate_limits: RateLimitsParamSchema.optional(),
  chatkit_configuration: ChatkitConfigurationParamSchema.optional()
}).passthrough()

export const UserMessageItemSchema = z.object({
  id: z.string(),
  object: z.enum(["chatkit.thread_item"]),
  created_at: z.number(),
  thread_id: z.string(),
  type: z.enum(["chatkit.user_message"]),
  content: z.array(z.union([UserMessageInputTextSchema, UserMessageQuotedTextSchema])),
  attachments: z.array(AttachmentSchema),
  inference_options: z.union([InferenceOptionsSchema, z.null()])
}).passthrough()

export const ResponseOutputTextSchema = z.object({
  type: z.enum(["output_text"]),
  text: z.string(),
  annotations: z.array(z.union([FileAnnotationSchema, UrlAnnotationSchema]))
}).passthrough()

export const TaskGroupItemSchema = z.object({
  id: z.string(),
  object: z.enum(["chatkit.thread_item"]),
  created_at: z.number(),
  thread_id: z.string(),
  type: z.enum(["chatkit.task_group"]),
  tasks: z.array(TaskGroupTaskSchema)
}).passthrough()

export const ThreadListResourceSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(ThreadResourceSchema),
  first_id: z.union([z.string(), z.null()]),
  last_id: z.union([z.string(), z.null()]),
  has_more: z.boolean()
}).passthrough()

export const AuditLogSchema = z.object({
  id: z.string(),
  type: AuditLogEventTypeSchema,
  effective_at: z.number(),
  project: z.object({
  id: z.string().optional(),
  name: z.string().optional()
}).passthrough().optional(),
  actor: z.union([AuditLogActorSchema, z.null()]).optional(),
  'api_key.created': z.object({
  id: z.string().optional(),
  data: z.object({
  scopes: z.array(z.string()).optional()
}).passthrough().optional()
}).passthrough().optional(),
  'api_key.updated': z.object({
  id: z.string().optional(),
  changes_requested: z.object({
  scopes: z.array(z.string()).optional()
}).passthrough().optional()
}).passthrough().optional(),
  'api_key.deleted': z.object({
  id: z.string().optional()
}).passthrough().optional(),
  'checkpoint.permission.created': z.object({
  id: z.string().optional(),
  data: z.object({
  project_id: z.string().optional(),
  fine_tuned_model_checkpoint: z.string().optional()
}).passthrough().optional()
}).passthrough().optional(),
  'checkpoint.permission.deleted': z.object({
  id: z.string().optional()
}).passthrough().optional(),
  'external_key.registered': z.object({
  id: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional()
}).passthrough().optional(),
  'external_key.removed': z.object({
  id: z.string().optional()
}).passthrough().optional(),
  'group.created': z.object({
  id: z.string().optional(),
  data: z.object({
  group_name: z.string().optional()
}).passthrough().optional()
}).passthrough().optional(),
  'group.updated': z.object({
  id: z.string().optional(),
  changes_requested: z.object({
  group_name: z.string().optional()
}).passthrough().optional()
}).passthrough().optional(),
  'group.deleted': z.object({
  id: z.string().optional()
}).passthrough().optional(),
  'scim.enabled': z.object({
  id: z.string().optional()
}).passthrough().optional(),
  'scim.disabled': z.object({
  id: z.string().optional()
}).passthrough().optional(),
  'invite.sent': z.object({
  id: z.string().optional(),
  data: z.object({
  email: z.string().optional(),
  role: z.string().optional()
}).passthrough().optional()
}).passthrough().optional(),
  'invite.accepted': z.object({
  id: z.string().optional()
}).passthrough().optional(),
  'invite.deleted': z.object({
  id: z.string().optional()
}).passthrough().optional(),
  'ip_allowlist.created': z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  allowed_ips: z.array(z.string()).optional()
}).passthrough().optional(),
  'ip_allowlist.updated': z.object({
  id: z.string().optional(),
  allowed_ips: z.array(z.string()).optional()
}).passthrough().optional(),
  'ip_allowlist.deleted': z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  allowed_ips: z.array(z.string()).optional()
}).passthrough().optional(),
  'ip_allowlist.config.activated': z.object({
  configs: z.array(z.object({
  id: z.string().optional(),
  name: z.string().optional()
}).passthrough()).optional()
}).passthrough().optional(),
  'ip_allowlist.config.deactivated': z.object({
  configs: z.array(z.object({
  id: z.string().optional(),
  name: z.string().optional()
}).passthrough()).optional()
}).passthrough().optional(),
  'login.succeeded': z.record(z.string(), z.unknown()).optional(),
  'login.failed': z.object({
  error_code: z.string().optional(),
  error_message: z.string().optional()
}).passthrough().optional(),
  'logout.succeeded': z.record(z.string(), z.unknown()).optional(),
  'logout.failed': z.object({
  error_code: z.string().optional(),
  error_message: z.string().optional()
}).passthrough().optional(),
  'organization.updated': z.object({
  id: z.string().optional(),
  changes_requested: z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  name: z.string().optional(),
  threads_ui_visibility: z.string().optional(),
  usage_dashboard_visibility: z.string().optional(),
  api_call_logging: z.string().optional(),
  api_call_logging_project_ids: z.string().optional()
}).passthrough().optional()
}).passthrough().optional(),
  'project.created': z.object({
  id: z.string().optional(),
  data: z.object({
  name: z.string().optional(),
  title: z.string().optional()
}).passthrough().optional()
}).passthrough().optional(),
  'project.updated': z.object({
  id: z.string().optional(),
  changes_requested: z.object({
  title: z.string().optional()
}).passthrough().optional()
}).passthrough().optional(),
  'project.archived': z.object({
  id: z.string().optional()
}).passthrough().optional(),
  'project.deleted': z.object({
  id: z.string().optional()
}).passthrough().optional(),
  'rate_limit.updated': z.object({
  id: z.string().optional(),
  changes_requested: z.object({
  max_requests_per_1_minute: z.number().optional(),
  max_tokens_per_1_minute: z.number().optional(),
  max_images_per_1_minute: z.number().optional(),
  max_audio_megabytes_per_1_minute: z.number().optional(),
  max_requests_per_1_day: z.number().optional(),
  batch_1_day_max_input_tokens: z.number().optional()
}).passthrough().optional()
}).passthrough().optional(),
  'rate_limit.deleted': z.object({
  id: z.string().optional()
}).passthrough().optional(),
  'role.created': z.object({
  id: z.string().optional(),
  role_name: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  resource_type: z.string().optional(),
  resource_id: z.string().optional()
}).passthrough().optional(),
  'role.updated': z.object({
  id: z.string().optional(),
  changes_requested: z.object({
  role_name: z.string().optional(),
  resource_id: z.string().optional(),
  resource_type: z.string().optional(),
  permissions_added: z.array(z.string()).optional(),
  permissions_removed: z.array(z.string()).optional(),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
}).passthrough().optional()
}).passthrough().optional(),
  'role.deleted': z.object({
  id: z.string().optional()
}).passthrough().optional(),
  'role.assignment.created': z.object({
  id: z.string().optional(),
  principal_id: z.string().optional(),
  principal_type: z.string().optional(),
  resource_id: z.string().optional(),
  resource_type: z.string().optional()
}).passthrough().optional(),
  'role.assignment.deleted': z.object({
  id: z.string().optional(),
  principal_id: z.string().optional(),
  principal_type: z.string().optional(),
  resource_id: z.string().optional(),
  resource_type: z.string().optional()
}).passthrough().optional(),
  'service_account.created': z.object({
  id: z.string().optional(),
  data: z.object({
  role: z.string().optional()
}).passthrough().optional()
}).passthrough().optional(),
  'service_account.updated': z.object({
  id: z.string().optional(),
  changes_requested: z.object({
  role: z.string().optional()
}).passthrough().optional()
}).passthrough().optional(),
  'service_account.deleted': z.object({
  id: z.string().optional()
}).passthrough().optional(),
  'user.added': z.object({
  id: z.string().optional(),
  data: z.object({
  role: z.string().optional()
}).passthrough().optional()
}).passthrough().optional(),
  'user.updated': z.object({
  id: z.string().optional(),
  changes_requested: z.object({
  role: z.string().optional()
}).passthrough().optional()
}).passthrough().optional(),
  'user.deleted': z.object({
  id: z.string().optional()
}).passthrough().optional(),
  'certificate.created': z.object({
  id: z.string().optional(),
  name: z.string().optional()
}).passthrough().optional(),
  'certificate.updated': z.object({
  id: z.string().optional(),
  name: z.string().optional()
}).passthrough().optional(),
  'certificate.deleted': z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  certificate: z.string().optional()
}).passthrough().optional(),
  'certificates.activated': z.object({
  certificates: z.array(z.object({
  id: z.string().optional(),
  name: z.string().optional()
}).passthrough()).optional()
}).passthrough().optional(),
  'certificates.deactivated': z.object({
  certificates: z.array(z.object({
  id: z.string().optional(),
  name: z.string().optional()
}).passthrough()).optional()
}).passthrough().optional()
}).passthrough()

export const ChatCompletionMessageListSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(ChatCompletionResponseMessageSchema.and(z.object({
  id: z.string(),
  content_parts: z.union([z.array(z.union([ChatCompletionRequestMessageContentPartTextSchema, ChatCompletionRequestMessageContentPartImageSchema])), z.null()]).optional()
}).passthrough())),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean()
}).passthrough()

export const CreateChatCompletionResponseSchema = z.object({
  id: z.string(),
  choices: z.array(z.object({
  finish_reason: z.enum(["stop", "length", "tool_calls", "content_filter", "function_call"]),
  index: z.number(),
  message: ChatCompletionResponseMessageSchema,
  logprobs: z.union([z.object({
  content: z.union([z.array(ChatCompletionTokenLogprobSchema), z.null()]),
  refusal: z.union([z.array(ChatCompletionTokenLogprobSchema), z.null()])
}).passthrough(), z.null()])
}).passthrough()),
  created: z.number(),
  model: z.string(),
  service_tier: ServiceTierSchema.optional(),
  system_fingerprint: z.string().optional(),
  object: z.enum(["chat.completion"]),
  usage: CompletionUsageSchema.optional()
}).passthrough()

export const FineTuneChatCompletionRequestAssistantMessageSchema = z.object({
  weight: z.union([z.literal(0), z.literal(1)]).optional()
}).passthrough().and(ChatCompletionRequestAssistantMessageSchema)

export const ChatCompletionRequestMessageSchema = z.union([ChatCompletionRequestDeveloperMessageSchema, ChatCompletionRequestSystemMessageSchema, ChatCompletionRequestUserMessageSchema, ChatCompletionRequestAssistantMessageSchema, ChatCompletionRequestToolMessageSchema, ChatCompletionRequestFunctionMessageSchema])

export const FileSearchToolSchema = z.object({
  type: z.enum(["file_search"]),
  vector_store_ids: z.array(z.string()),
  max_num_results: z.number().optional(),
  ranking_options: RankingOptionsSchema.optional(),
  filters: z.union([FiltersSchema, z.null()]).optional()
}).passthrough()

export const RunStepDetailsToolCallsObjectSchema = z.object({
  type: z.enum(["tool_calls"]),
  tool_calls: z.array(z.union([RunStepDetailsToolCallsCodeObjectSchema, RunStepDetailsToolCallsFileSearchObjectSchema, RunStepDetailsToolCallsFunctionObjectSchema]))
}).passthrough()

export const ListMessagesResponseSchema = z.unknown()

export const MessageStreamEventSchema = z.union([z.object({
  event: z.enum(["thread.message.created"]),
  data: MessageObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.message.in_progress"]),
  data: MessageObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.message.delta"]),
  data: MessageDeltaObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.message.completed"]),
  data: MessageObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.message.incomplete"]),
  data: MessageObjectSchema
}).passthrough()])

export const RealtimeTranslationServerEventSchema = z.union([RealtimeServerEventErrorSchema, RealtimeTranslationServerEventSessionCreatedSchema, RealtimeTranslationServerEventSessionUpdatedSchema, RealtimeTranslationServerEventSessionClosedSchema, RealtimeTranslationServerEventSessionInputTranscriptDeltaSchema, RealtimeTranslationServerEventSessionOutputTranscriptDeltaSchema, RealtimeTranslationServerEventSessionOutputAudioDeltaSchema])

export const RealtimeTranslationClientEventSchema = z.union([RealtimeTranslationClientEventSessionUpdateSchema, RealtimeTranslationClientEventInputAudioBufferAppendSchema, RealtimeTranslationClientEventSessionCloseSchema])

export const RealtimeBetaClientEventConversationItemCreateSchema = z.object({
  event_id: z.string().max(512).optional(),
  type: z.enum(["conversation.item.create"]),
  previous_item_id: z.string().optional(),
  item: RealtimeConversationItemSchema
}).passthrough()

export const RealtimeBetaResponseSchema = z.object({
  id: z.string().optional(),
  object: z.enum(["realtime.response"]).optional(),
  status: z.enum(["completed", "cancelled", "failed", "incomplete", "in_progress"]).optional(),
  status_details: z.object({
  type: z.enum(["completed", "cancelled", "failed", "incomplete"]).optional(),
  reason: z.enum(["turn_detected", "client_cancelled", "max_output_tokens", "content_filter"]).optional(),
  error: z.object({
  type: z.string().optional(),
  code: z.string().optional()
}).passthrough().optional()
}).passthrough().optional(),
  output: z.array(RealtimeConversationItemSchema).optional(),
  metadata: MetadataSchema.optional(),
  usage: z.object({
  total_tokens: z.number().optional(),
  input_tokens: z.number().optional(),
  output_tokens: z.number().optional(),
  input_token_details: z.object({
  cached_tokens: z.number().optional(),
  text_tokens: z.number().optional(),
  image_tokens: z.number().optional(),
  audio_tokens: z.number().optional(),
  cached_tokens_details: z.object({
  text_tokens: z.number().optional(),
  image_tokens: z.number().optional(),
  audio_tokens: z.number().optional()
}).passthrough().optional()
}).passthrough().optional(),
  output_token_details: z.object({
  text_tokens: z.number().optional(),
  audio_tokens: z.number().optional()
}).passthrough().optional()
}).passthrough().optional(),
  conversation_id: z.string().optional(),
  voice: VoiceIdsSharedSchema.optional(),
  modalities: z.array(z.enum(["text", "audio"])).optional(),
  output_audio_format: z.enum(["pcm16", "g711_ulaw", "g711_alaw"]).optional(),
  temperature: z.number().optional(),
  max_output_tokens: z.union([z.number(), z.enum(["inf"])]).optional()
}).passthrough()

export const RealtimeBetaServerEventConversationItemCreatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.created"]),
  previous_item_id: z.union([z.string(), z.null()]).optional(),
  item: RealtimeConversationItemSchema
}).passthrough()

export const RealtimeBetaServerEventConversationItemRetrievedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.retrieved"]),
  item: RealtimeConversationItemSchema
}).passthrough()

export const RealtimeBetaServerEventResponseOutputItemAddedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.output_item.added"]),
  response_id: z.string(),
  output_index: z.number(),
  item: RealtimeConversationItemSchema
}).passthrough()

export const RealtimeBetaServerEventResponseOutputItemDoneSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.output_item.done"]),
  response_id: z.string(),
  output_index: z.number(),
  item: RealtimeConversationItemSchema
}).passthrough()

export const RealtimeClientEventConversationItemCreateSchema = z.object({
  event_id: z.string().max(512).optional(),
  type: z.enum(["conversation.item.create"]),
  previous_item_id: z.string().optional(),
  item: RealtimeConversationItemSchema
}).passthrough()

export const RealtimeResponseSchema = z.object({
  id: z.string().optional(),
  object: z.enum(["realtime.response"]).optional(),
  status: z.enum(["completed", "cancelled", "failed", "incomplete", "in_progress"]).optional(),
  status_details: z.object({
  type: z.enum(["completed", "cancelled", "failed", "incomplete"]).optional(),
  reason: z.enum(["turn_detected", "client_cancelled", "max_output_tokens", "content_filter"]).optional(),
  error: z.object({
  type: z.string().optional(),
  code: z.string().optional()
}).passthrough().optional()
}).passthrough().optional(),
  output: z.array(RealtimeConversationItemSchema).optional(),
  metadata: MetadataSchema.optional(),
  audio: z.object({
  output: z.object({
  format: RealtimeAudioFormatsSchema.optional(),
  voice: VoiceIdsSharedSchema.optional()
}).passthrough().optional()
}).passthrough().optional(),
  usage: z.object({
  total_tokens: z.number().optional(),
  input_tokens: z.number().optional(),
  output_tokens: z.number().optional(),
  input_token_details: z.object({
  cached_tokens: z.number().optional(),
  text_tokens: z.number().optional(),
  image_tokens: z.number().optional(),
  audio_tokens: z.number().optional(),
  cached_tokens_details: z.object({
  text_tokens: z.number().optional(),
  image_tokens: z.number().optional(),
  audio_tokens: z.number().optional()
}).passthrough().optional()
}).passthrough().optional(),
  output_token_details: z.object({
  text_tokens: z.number().optional(),
  audio_tokens: z.number().optional()
}).passthrough().optional()
}).passthrough().optional(),
  conversation_id: z.string().optional(),
  output_modalities: z.array(z.enum(["text", "audio"])).optional(),
  max_output_tokens: z.union([z.number(), z.enum(["inf"])]).optional()
}).passthrough()

export const RealtimeServerEventConversationItemAddedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.added"]),
  previous_item_id: z.union([z.string(), z.null()]).optional(),
  item: RealtimeConversationItemSchema
}).passthrough()

export const RealtimeServerEventConversationItemCreatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.created"]),
  previous_item_id: z.union([z.string(), z.null()]).optional(),
  item: RealtimeConversationItemSchema
}).passthrough()

export const RealtimeServerEventConversationItemDoneSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.done"]),
  previous_item_id: z.union([z.string(), z.null()]).optional(),
  item: RealtimeConversationItemSchema
}).passthrough()

export const RealtimeServerEventConversationItemRetrievedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["conversation.item.retrieved"]),
  item: RealtimeConversationItemSchema
}).passthrough()

export const RealtimeServerEventResponseOutputItemAddedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.output_item.added"]),
  response_id: z.string(),
  output_index: z.number(),
  item: RealtimeConversationItemSchema
}).passthrough()

export const RealtimeServerEventResponseOutputItemDoneSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.output_item.done"]),
  response_id: z.string(),
  output_index: z.number(),
  item: RealtimeConversationItemSchema
}).passthrough()

export const AssistantObjectSchema = z.object({
  id: z.string(),
  object: z.enum(["assistant"]),
  created_at: z.number(),
  name: z.union([z.string().max(256), z.null()]),
  description: z.union([z.string().max(512), z.null()]),
  model: z.string(),
  instructions: z.union([z.string().max(256000), z.null()]),
  tools: z.array(z.union([AssistantToolsCodeSchema, AssistantToolsFileSearchSchema, AssistantToolsFunctionSchema])).max(128),
  tool_resources: z.union([z.object({
  code_interpreter: z.object({
  file_ids: z.array(z.string()).max(20).optional()
}).passthrough().optional(),
  file_search: z.object({
  vector_store_ids: z.array(z.string()).max(1).optional()
}).passthrough().optional()
}).passthrough(), z.null()]).optional(),
  metadata: MetadataSchema,
  temperature: z.union([z.number().min(0).max(2), z.null()]).optional(),
  top_p: z.union([z.number().min(0).max(1), z.null()]).optional(),
  response_format: z.union([AssistantsApiResponseFormatOptionSchema, z.null()]).optional()
}).passthrough()

export const CreateAssistantRequestSchema = z.object({
  model: z.union([z.string(), AssistantSupportedModelsSchema]),
  name: z.union([z.string().max(256), z.null()]).optional(),
  description: z.union([z.string().max(512), z.null()]).optional(),
  instructions: z.union([z.string().max(256000), z.null()]).optional(),
  reasoning_effort: ReasoningEffortSchema.optional(),
  tools: z.array(z.union([AssistantToolsCodeSchema, AssistantToolsFileSearchSchema, AssistantToolsFunctionSchema])).max(128).optional(),
  tool_resources: z.union([z.object({
  code_interpreter: z.object({
  file_ids: z.array(z.string()).max(20).optional()
}).passthrough().optional(),
  file_search: z.union([z.unknown(), z.unknown()]).optional()
}).passthrough(), z.null()]).optional(),
  metadata: MetadataSchema.optional(),
  temperature: z.union([z.number().min(0).max(2), z.null()]).optional(),
  top_p: z.union([z.number().min(0).max(1), z.null()]).optional(),
  response_format: z.union([AssistantsApiResponseFormatOptionSchema, z.null()]).optional()
}).passthrough()

export const CreateRunRequestSchema = z.object({
  assistant_id: z.string(),
  model: z.union([z.string(), AssistantSupportedModelsSchema]).optional(),
  reasoning_effort: ReasoningEffortSchema.optional(),
  instructions: z.string().optional(),
  additional_instructions: z.string().optional(),
  additional_messages: z.array(CreateMessageRequestSchema).optional(),
  tools: z.array(z.union([AssistantToolsCodeSchema, AssistantToolsFileSearchSchema, AssistantToolsFunctionSchema])).max(20).optional(),
  metadata: MetadataSchema.optional(),
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().min(0).max(1).optional(),
  stream: z.boolean().optional(),
  max_prompt_tokens: z.number().min(256).optional(),
  max_completion_tokens: z.number().min(256).optional(),
  truncation_strategy: TruncationObjectSchema.and(z.unknown()).optional(),
  tool_choice: AssistantsApiToolChoiceOptionSchema.and(z.unknown()).optional(),
  parallel_tool_calls: ParallelToolCallsSchema.optional(),
  response_format: AssistantsApiResponseFormatOptionSchema.optional()
}).passthrough()

export const CreateThreadAndRunRequestSchema = z.object({
  assistant_id: z.string(),
  thread: CreateThreadRequestSchema.optional(),
  model: z.union([z.string(), z.enum(["gpt-5", "gpt-5-mini", "gpt-5-nano", "gpt-5-2025-08-07", "gpt-5-mini-2025-08-07", "gpt-5-nano-2025-08-07", "gpt-4.1", "gpt-4.1-mini", "gpt-4.1-nano", "gpt-4.1-2025-04-14", "gpt-4.1-mini-2025-04-14", "gpt-4.1-nano-2025-04-14", "gpt-4o", "gpt-4o-2024-11-20", "gpt-4o-2024-08-06", "gpt-4o-2024-05-13", "gpt-4o-mini", "gpt-4o-mini-2024-07-18", "gpt-4.5-preview", "gpt-4.5-preview-2025-02-27", "gpt-4-turbo", "gpt-4-turbo-2024-04-09", "gpt-4-0125-preview", "gpt-4-turbo-preview", "gpt-4-1106-preview", "gpt-4-vision-preview", "gpt-4", "gpt-4-0314", "gpt-4-0613", "gpt-4-32k", "gpt-4-32k-0314", "gpt-4-32k-0613", "gpt-3.5-turbo", "gpt-3.5-turbo-16k", "gpt-3.5-turbo-0613", "gpt-3.5-turbo-1106", "gpt-3.5-turbo-0125", "gpt-3.5-turbo-16k-0613"])]).optional(),
  instructions: z.string().optional(),
  tools: z.array(z.union([AssistantToolsCodeSchema, AssistantToolsFileSearchSchema, AssistantToolsFunctionSchema])).max(20).optional(),
  tool_resources: z.object({
  code_interpreter: z.object({
  file_ids: z.array(z.string()).max(20).optional()
}).passthrough().optional(),
  file_search: z.object({
  vector_store_ids: z.array(z.string()).max(1).optional()
}).passthrough().optional()
}).passthrough().optional(),
  metadata: MetadataSchema.optional(),
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().min(0).max(1).optional(),
  stream: z.boolean().optional(),
  max_prompt_tokens: z.number().min(256).optional(),
  max_completion_tokens: z.number().min(256).optional(),
  truncation_strategy: TruncationObjectSchema.and(z.unknown()).optional(),
  tool_choice: AssistantsApiToolChoiceOptionSchema.and(z.unknown()).optional(),
  parallel_tool_calls: ParallelToolCallsSchema.optional(),
  response_format: AssistantsApiResponseFormatOptionSchema.optional()
}).passthrough()

export const ModifyAssistantRequestSchema = z.object({
  model: z.union([z.string(), AssistantSupportedModelsSchema]).optional(),
  reasoning_effort: ReasoningEffortSchema.optional(),
  name: z.union([z.string().max(256), z.null()]).optional(),
  description: z.union([z.string().max(512), z.null()]).optional(),
  instructions: z.union([z.string().max(256000), z.null()]).optional(),
  tools: z.array(z.union([AssistantToolsCodeSchema, AssistantToolsFileSearchSchema, AssistantToolsFunctionSchema])).max(128).optional(),
  tool_resources: z.union([z.object({
  code_interpreter: z.object({
  file_ids: z.array(z.string()).max(20).optional()
}).passthrough().optional(),
  file_search: z.object({
  vector_store_ids: z.array(z.string()).max(1).optional()
}).passthrough().optional()
}).passthrough(), z.null()]).optional(),
  metadata: MetadataSchema.optional(),
  temperature: z.union([z.number().min(0).max(2), z.null()]).optional(),
  top_p: z.union([z.number().min(0).max(1), z.null()]).optional(),
  response_format: z.union([AssistantsApiResponseFormatOptionSchema, z.null()]).optional()
}).passthrough()

export const RunObjectSchema = z.object({
  id: z.string(),
  object: z.enum(["thread.run"]),
  created_at: z.number(),
  thread_id: z.string(),
  assistant_id: z.string(),
  status: z.enum(["queued", "in_progress", "requires_action", "cancelling", "cancelled", "failed", "completed", "incomplete", "expired"]),
  required_action: z.object({
  type: z.enum(["submit_tool_outputs"]),
  submit_tool_outputs: z.object({
  tool_calls: z.array(RunToolCallObjectSchema)
}).passthrough()
}).passthrough(),
  last_error: z.object({
  code: z.enum(["server_error", "rate_limit_exceeded", "invalid_prompt"]),
  message: z.string()
}).passthrough(),
  expires_at: z.number(),
  started_at: z.number(),
  cancelled_at: z.number(),
  failed_at: z.number(),
  completed_at: z.number(),
  incomplete_details: z.object({
  reason: z.enum(["max_completion_tokens", "max_prompt_tokens"]).optional()
}).passthrough(),
  model: z.string(),
  instructions: z.string(),
  tools: z.array(z.union([AssistantToolsCodeSchema, AssistantToolsFileSearchSchema, AssistantToolsFunctionSchema])).max(20),
  metadata: MetadataSchema,
  usage: RunCompletionUsageSchema,
  temperature: z.number().optional(),
  top_p: z.number().optional(),
  max_prompt_tokens: z.number().min(256),
  max_completion_tokens: z.number().min(256),
  truncation_strategy: TruncationObjectSchema.and(z.unknown()),
  tool_choice: AssistantsApiToolChoiceOptionSchema.and(z.unknown()),
  parallel_tool_calls: ParallelToolCallsSchema,
  response_format: AssistantsApiResponseFormatOptionSchema
}).passthrough()

export const ResponseTextParamSchema = z.object({
  format: TextResponseFormatConfigurationSchema.optional(),
  verbosity: VerbositySchema.optional()
}).passthrough()

export const RunStepDeltaObjectSchema = z.object({
  id: z.string(),
  object: z.enum(["thread.run.step.delta"]),
  delta: z.object({
  step_details: z.union([RunStepDeltaStepDetailsMessageCreationObjectSchema, RunStepDeltaStepDetailsToolCallsObjectSchema]).optional()
}).passthrough()
}).passthrough()

export const CreateVectorStoreFileRequestSchema = z.object({
  file_id: z.string(),
  chunking_strategy: ChunkingStrategyRequestParamSchema.optional(),
  attributes: VectorStoreFileAttributesSchema.optional()
}).passthrough()

export const ListVectorStoreFilesResponseSchema = z.unknown()

export const CodeInterpreterToolSchema = z.object({
  type: z.enum(["code_interpreter"]),
  container: z.union([z.string(), AutoCodeInterpreterToolParamSchema])
}).passthrough()

export const FunctionShellToolParamSchema = z.object({
  type: z.enum(["shell"]),
  environment: z.union([z.union([ContainerAutoParamSchema, LocalEnvironmentParamSchema, ContainerReferenceParamSchema]), z.null()]).optional()
}).passthrough()

export const EvalItemContentSchema = z.union([EvalItemContentItemSchema, EvalItemContentArraySchema])

export const OutputContentSchema = z.union([OutputTextContentSchema, RefusalContentSchema, ReasoningTextContentSchema])

export const OutputMessageContentSchema = z.union([OutputTextContentSchema, RefusalContentSchema])

export const MessageSchema = z.object({
  type: z.enum(["message"]),
  id: z.string(),
  status: MessageStatusSchema,
  role: MessageRoleSchema,
  content: z.array(z.union([InputTextContentSchema, OutputTextContentSchema, TextContentSchema, SummaryTextContentSchema, ReasoningTextContentSchema, RefusalContentSchema, InputImageContentSchema, ComputerScreenshotContentSchema, InputFileContentSchema])),
  phase: z.union([MessagePhase2Schema, z.null()]).optional()
}).passthrough()

export const CustomToolCallOutputSchema = z.object({
  type: z.enum(["custom_tool_call_output"]),
  id: z.string().optional(),
  call_id: z.string(),
  output: z.union([z.string(), z.array(FunctionAndCustomToolCallOutputSchema)])
}).passthrough()

export const FunctionToolCallOutputSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["function_call_output"]),
  call_id: z.string(),
  output: z.union([z.string(), z.array(FunctionAndCustomToolCallOutputSchema)]),
  status: z.enum(["in_progress", "completed", "incomplete"]).optional()
}).passthrough()

export const InputMessageContentListSchema = z.array(InputContentSchema)

export const PromptSchema = z.union([z.object({
  id: z.string(),
  version: z.union([z.string(), z.null()]).optional(),
  variables: ResponsePromptVariablesSchema.optional()
}).passthrough(), z.null()])

export const ComputerActionListSchema = z.array(ComputerActionSchema)

export const NamespaceToolParamSchema = z.object({
  type: z.enum(["namespace"]),
  name: z.string().min(1),
  description: z.string().min(1),
  tools: z.array(z.union([FunctionToolParamSchema, CustomToolParamSchema])).min(1)
}).passthrough()

export const FunctionShellCallOutputItemParamSchema = z.object({
  id: z.union([z.string(), z.null()]).optional(),
  call_id: z.string().min(1).max(64),
  type: z.enum(["shell_call_output"]),
  output: z.array(FunctionShellCallOutputContentParamSchema),
  status: z.union([FunctionShellCallItemStatusSchema, z.null()]).optional(),
  max_output_length: z.union([z.number(), z.null()]).optional()
}).passthrough()

export const AssistantMessageItemSchema = z.object({
  id: z.string(),
  object: z.enum(["chatkit.thread_item"]),
  created_at: z.number(),
  thread_id: z.string(),
  type: z.enum(["chatkit.assistant_message"]),
  content: z.array(ResponseOutputTextSchema)
}).passthrough()

export const ListAuditLogsResponseSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(AuditLogSchema),
  first_id: z.union([z.string(), z.null()]).optional(),
  last_id: z.union([z.string(), z.null()]).optional(),
  has_more: z.boolean()
}).passthrough()

export const ChatCompletionListSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(CreateChatCompletionResponseSchema),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean()
}).passthrough()

export const CreateChatCompletionRequestSchema = CreateModelResponsePropertiesSchema.and(z.object({
  messages: z.array(ChatCompletionRequestMessageSchema).min(1),
  model: ModelIdsSharedSchema,
  modalities: ResponseModalitiesSchema.optional(),
  verbosity: VerbositySchema.optional(),
  reasoning_effort: ReasoningEffortSchema.optional(),
  max_completion_tokens: z.number().optional(),
  frequency_penalty: z.number().min(-2).max(2).optional(),
  presence_penalty: z.number().min(-2).max(2).optional(),
  web_search_options: z.object({
  user_location: z.object({
  type: z.enum(["approximate"]),
  approximate: WebSearchLocationSchema
}).passthrough().optional(),
  search_context_size: WebSearchContextSizeSchema.optional()
}).passthrough().optional(),
  top_logprobs: z.number().min(0).max(20).optional(),
  response_format: z.union([ResponseFormatTextSchema, ResponseFormatJsonSchemaSchema, ResponseFormatJsonObjectSchema]).optional(),
  audio: z.object({
  voice: VoiceIdsOrCustomVoiceSchema,
  format: z.enum(["wav", "aac", "mp3", "flac", "opus", "pcm16"])
}).passthrough().optional(),
  store: z.boolean().optional(),
  stream: z.boolean().optional(),
  stop: StopConfigurationSchema.optional(),
  logit_bias: z.record(z.string(), z.number()).optional(),
  logprobs: z.boolean().optional(),
  max_tokens: z.number().optional(),
  n: z.number().min(1).max(128).optional(),
  prediction: z.union([PredictionContentSchema]).optional(),
  seed: z.number().min(-9223372036854776000).max(9223372036854776000).optional(),
  stream_options: ChatCompletionStreamOptionsSchema.optional(),
  tools: z.array(z.union([ChatCompletionToolSchema, CustomToolChatCompletionsSchema])).optional(),
  tool_choice: ChatCompletionToolChoiceOptionSchema.optional(),
  parallel_tool_calls: ParallelToolCallsSchema.optional(),
  function_call: z.union([z.enum(["none", "auto"]), ChatCompletionFunctionCallOptionSchema]).optional(),
  functions: z.array(ChatCompletionFunctionsSchema).min(1).max(128).optional()
}).passthrough())

export const RunStepObjectSchema = z.object({
  id: z.string(),
  object: z.enum(["thread.run.step"]),
  created_at: z.number(),
  assistant_id: z.string(),
  thread_id: z.string(),
  run_id: z.string(),
  type: z.enum(["message_creation", "tool_calls"]),
  status: z.enum(["in_progress", "cancelled", "failed", "completed", "expired"]),
  step_details: z.union([RunStepDetailsMessageCreationObjectSchema, RunStepDetailsToolCallsObjectSchema]),
  last_error: z.union([z.object({
  code: z.enum(["server_error", "rate_limit_exceeded"]),
  message: z.string()
}).passthrough(), z.null()]),
  expired_at: z.union([z.number(), z.null()]),
  cancelled_at: z.union([z.number(), z.null()]),
  failed_at: z.union([z.number(), z.null()]),
  completed_at: z.union([z.number(), z.null()]),
  metadata: MetadataSchema,
  usage: RunStepCompletionUsageSchema
}).passthrough()

export const RealtimeBetaServerEventResponseCreatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.created"]),
  response: RealtimeBetaResponseSchema
}).passthrough()

export const RealtimeBetaServerEventResponseDoneSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.done"]),
  response: RealtimeBetaResponseSchema
}).passthrough()

export const RealtimeServerEventResponseCreatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.created"]),
  response: RealtimeResponseSchema
}).passthrough()

export const RealtimeServerEventResponseDoneSchema = z.object({
  event_id: z.string(),
  type: z.enum(["response.done"]),
  response: RealtimeResponseSchema
}).passthrough()

export const ListAssistantsResponseSchema = z.object({
  object: z.string(),
  data: z.array(AssistantObjectSchema),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean()
}).passthrough()

export const ListRunsResponseSchema = z.object({
  object: z.string(),
  data: z.array(RunObjectSchema),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean()
}).passthrough()

export const RunStreamEventSchema = z.union([z.object({
  event: z.enum(["thread.run.created"]),
  data: RunObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.run.queued"]),
  data: RunObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.run.in_progress"]),
  data: RunObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.run.requires_action"]),
  data: RunObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.run.completed"]),
  data: RunObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.run.incomplete"]),
  data: RunObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.run.failed"]),
  data: RunObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.run.cancelling"]),
  data: RunObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.run.cancelled"]),
  data: RunObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.run.expired"]),
  data: RunObjectSchema
}).passthrough()])

export const CreateVectorStoreFileBatchRequestSchema = z.union([z.unknown(), z.unknown()])

export const EvalItemSchema = z.object({
  role: z.enum(["user", "assistant", "system", "developer"]),
  content: EvalItemContentSchema,
  type: z.enum(["message"]).optional()
}).passthrough()

export const ContentSchema = z.union([InputContentSchema, OutputContentSchema])

export const ResponseContentPartAddedEventSchema = z.object({
  type: z.enum(["response.content_part.added"]),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  part: OutputContentSchema,
  sequence_number: z.number()
}).passthrough()

export const ResponseContentPartDoneEventSchema = z.object({
  type: z.enum(["response.content_part.done"]),
  item_id: z.string(),
  output_index: z.number(),
  content_index: z.number(),
  sequence_number: z.number(),
  part: OutputContentSchema
}).passthrough()

export const OutputMessageSchema = z.object({
  id: z.string(),
  type: z.enum(["message"]),
  role: z.enum(["assistant"]),
  content: z.array(OutputMessageContentSchema),
  phase: z.union([MessagePhaseSchema, z.null()]).optional(),
  status: z.enum(["in_progress", "completed", "incomplete"])
}).passthrough()

export const CustomToolCallOutputResourceSchema = CustomToolCallOutputSchema.and(z.object({
  id: z.string(),
  status: FunctionCallOutputStatusEnumSchema,
  created_by: z.string().optional()
}).passthrough())

export const FunctionToolCallOutputResourceSchema = FunctionToolCallOutputSchema.and(z.object({
  id: z.string(),
  status: FunctionCallOutputStatusEnumSchema,
  created_by: z.string().optional()
}).passthrough())

export const EasyInputMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system", "developer"]),
  content: z.union([z.string(), InputMessageContentListSchema]),
  phase: z.union([MessagePhaseSchema, z.null()]).optional(),
  type: z.enum(["message"]).optional()
}).passthrough()

export const InputMessageSchema = z.object({
  type: z.enum(["message"]).optional(),
  role: z.enum(["user", "system", "developer"]),
  status: z.enum(["in_progress", "completed", "incomplete"]).optional(),
  content: InputMessageContentListSchema
}).passthrough()

export const RealtimeBetaResponseCreateParamsSchema = z.object({
  modalities: z.array(z.enum(["text", "audio"])).optional(),
  instructions: z.string().optional(),
  voice: VoiceIdsOrCustomVoiceSchema.optional(),
  output_audio_format: z.enum(["pcm16", "g711_ulaw", "g711_alaw"]).optional(),
  tools: z.array(z.object({
  type: z.enum(["function"]).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  parameters: z.record(z.string(), z.unknown()).optional()
}).passthrough()).optional(),
  tool_choice: z.union([ToolChoiceOptionsSchema, ToolChoiceFunctionSchema, ToolChoiceMCPSchema]).optional(),
  temperature: z.number().optional(),
  max_output_tokens: z.union([z.number(), z.enum(["inf"])]).optional(),
  conversation: z.union([z.string(), z.enum(["auto", "none"])]).optional(),
  metadata: MetadataSchema.optional(),
  prompt: PromptSchema.optional(),
  input: z.array(RealtimeConversationItemSchema).optional()
}).passthrough()

export const RealtimeResponseCreateParamsSchema = z.object({
  output_modalities: z.array(z.enum(["text", "audio"])).optional(),
  instructions: z.string().optional(),
  audio: z.object({
  output: z.object({
  format: RealtimeAudioFormatsSchema.optional(),
  voice: VoiceIdsOrCustomVoiceSchema.optional()
}).passthrough().optional()
}).passthrough().optional(),
  tools: z.array(z.union([RealtimeFunctionToolSchema, MCPToolSchema])).optional(),
  tool_choice: z.union([ToolChoiceOptionsSchema, ToolChoiceFunctionSchema, ToolChoiceMCPSchema]).optional(),
  parallel_tool_calls: z.boolean().optional(),
  reasoning: RealtimeReasoningSchema.optional(),
  max_output_tokens: z.union([z.number(), z.enum(["inf"])]).optional(),
  conversation: z.union([z.string(), z.enum(["auto", "none"])]).optional(),
  metadata: MetadataSchema.optional(),
  prompt: PromptSchema.optional(),
  input: z.array(RealtimeConversationItemSchema).optional()
}).passthrough()

export const RealtimeSessionSchema = z.object({
  id: z.string().optional(),
  object: z.enum(["realtime.session"]).optional(),
  modalities: z.unknown().optional(),
  model: z.union([z.string(), z.enum(["gpt-realtime", "gpt-realtime-1.5", "gpt-realtime-2025-08-28", "gpt-4o-realtime-preview", "gpt-4o-realtime-preview-2024-10-01", "gpt-4o-realtime-preview-2024-12-17", "gpt-4o-realtime-preview-2025-06-03", "gpt-4o-mini-realtime-preview", "gpt-4o-mini-realtime-preview-2024-12-17", "gpt-realtime-mini", "gpt-realtime-mini-2025-10-06", "gpt-realtime-mini-2025-12-15", "gpt-audio-1.5", "gpt-audio-mini", "gpt-audio-mini-2025-10-06", "gpt-audio-mini-2025-12-15"])]).optional(),
  instructions: z.string().optional(),
  voice: VoiceIdsSharedSchema.optional(),
  input_audio_format: z.enum(["pcm16", "g711_ulaw", "g711_alaw"]).optional(),
  output_audio_format: z.enum(["pcm16", "g711_ulaw", "g711_alaw"]).optional(),
  input_audio_transcription: z.union([AudioTranscriptionResponseSchema, z.null()]).optional(),
  turn_detection: RealtimeTurnDetectionSchema.optional(),
  input_audio_noise_reduction: z.object({
  type: NoiseReductionTypeSchema.optional()
}).passthrough().optional(),
  speed: z.number().min(0.25).max(1.5).optional(),
  tracing: z.union([z.union([z.enum(["auto"]), z.object({
  workflow_name: z.string().optional(),
  group_id: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
}).passthrough()]), z.null()]).optional(),
  tools: z.array(RealtimeFunctionToolSchema).optional(),
  tool_choice: z.string().optional(),
  temperature: z.number().optional(),
  max_response_output_tokens: z.union([z.number(), z.enum(["inf"])]).optional(),
  expires_at: z.number().optional(),
  prompt: z.union([PromptSchema, z.null()]).optional(),
  include: z.union([z.array(z.enum(["item.input_audio_transcription.logprobs"])), z.null()]).optional()
}).passthrough()

export const RealtimeSessionCreateRequestSchema = z.object({
  client_secret: z.object({
  value: z.string(),
  expires_at: z.number()
}).passthrough(),
  modalities: z.unknown().optional(),
  instructions: z.string().optional(),
  voice: VoiceIdsOrCustomVoiceSchema.optional(),
  input_audio_format: z.string().optional(),
  output_audio_format: z.string().optional(),
  input_audio_transcription: z.object({
  model: z.string().optional()
}).passthrough().optional(),
  speed: z.number().min(0.25).max(1.5).optional(),
  tracing: z.union([z.enum(["auto"]), z.object({
  workflow_name: z.string().optional(),
  group_id: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
}).passthrough()]).optional(),
  turn_detection: z.object({
  type: z.string().optional(),
  threshold: z.number().optional(),
  prefix_padding_ms: z.number().optional(),
  silence_duration_ms: z.number().optional()
}).passthrough().optional(),
  tools: z.array(z.object({
  type: z.enum(["function"]).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  parameters: z.record(z.string(), z.unknown()).optional()
}).passthrough()).optional(),
  tool_choice: z.string().optional(),
  temperature: z.number().optional(),
  max_response_output_tokens: z.union([z.number(), z.enum(["inf"])]).optional(),
  truncation: RealtimeTruncationSchema.optional(),
  prompt: PromptSchema.optional()
}).passthrough()

export const RealtimeSessionCreateRequestGASchema = z.object({
  type: z.enum(["realtime"]),
  output_modalities: z.array(z.enum(["text", "audio"])).optional(),
  model: z.union([z.string(), z.enum(["gpt-realtime", "gpt-realtime-1.5", "gpt-realtime-2", "gpt-realtime-2025-08-28", "gpt-4o-realtime-preview", "gpt-4o-realtime-preview-2024-10-01", "gpt-4o-realtime-preview-2024-12-17", "gpt-4o-realtime-preview-2025-06-03", "gpt-4o-mini-realtime-preview", "gpt-4o-mini-realtime-preview-2024-12-17", "gpt-realtime-mini", "gpt-realtime-mini-2025-10-06", "gpt-realtime-mini-2025-12-15", "gpt-audio-1.5", "gpt-audio-mini", "gpt-audio-mini-2025-10-06", "gpt-audio-mini-2025-12-15"])]).optional(),
  instructions: z.string().optional(),
  audio: z.object({
  input: z.object({
  format: RealtimeAudioFormatsSchema.optional(),
  transcription: AudioTranscriptionSchema.optional(),
  noise_reduction: z.object({
  type: NoiseReductionTypeSchema.optional()
}).passthrough().optional(),
  turn_detection: RealtimeTurnDetectionSchema.optional()
}).passthrough().optional(),
  output: z.object({
  format: RealtimeAudioFormatsSchema.optional(),
  voice: VoiceIdsOrCustomVoiceSchema.optional(),
  speed: z.number().min(0.25).max(1.5).optional()
}).passthrough().optional()
}).passthrough().optional(),
  include: z.array(z.enum(["item.input_audio_transcription.logprobs"])).optional(),
  tracing: z.union([z.enum(["auto"]), z.object({
  workflow_name: z.string().optional(),
  group_id: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
}).passthrough()]).optional(),
  tools: z.array(z.union([RealtimeFunctionToolSchema, MCPToolSchema])).optional(),
  tool_choice: z.union([ToolChoiceOptionsSchema, ToolChoiceFunctionSchema, ToolChoiceMCPSchema]).optional(),
  parallel_tool_calls: z.boolean().optional(),
  reasoning: RealtimeReasoningSchema.optional(),
  max_output_tokens: z.union([z.number(), z.enum(["inf"])]).optional(),
  truncation: RealtimeTruncationSchema.optional(),
  prompt: PromptSchema.optional()
}).passthrough()

export const RealtimeSessionCreateResponseGASchema = z.object({
  type: z.enum(["realtime"]),
  id: z.string(),
  object: z.enum(["realtime.session"]),
  expires_at: z.number().optional(),
  output_modalities: z.array(z.enum(["text", "audio"])).optional(),
  model: z.union([z.string(), z.enum(["gpt-realtime", "gpt-realtime-1.5", "gpt-realtime-2", "gpt-realtime-2025-08-28", "gpt-4o-realtime-preview", "gpt-4o-realtime-preview-2024-10-01", "gpt-4o-realtime-preview-2024-12-17", "gpt-4o-realtime-preview-2025-06-03", "gpt-4o-mini-realtime-preview", "gpt-4o-mini-realtime-preview-2024-12-17", "gpt-realtime-mini", "gpt-realtime-mini-2025-10-06", "gpt-realtime-mini-2025-12-15", "gpt-audio-1.5", "gpt-audio-mini", "gpt-audio-mini-2025-10-06", "gpt-audio-mini-2025-12-15"])]).optional(),
  instructions: z.string().optional(),
  audio: z.object({
  input: z.object({
  format: RealtimeAudioFormatsSchema.optional(),
  transcription: AudioTranscriptionResponseSchema.optional(),
  noise_reduction: z.object({
  type: NoiseReductionTypeSchema.optional()
}).passthrough().optional(),
  turn_detection: RealtimeTurnDetectionSchema.optional()
}).passthrough().optional(),
  output: z.object({
  format: RealtimeAudioFormatsSchema.optional(),
  voice: VoiceIdsSharedSchema.optional(),
  speed: z.number().min(0.25).max(1.5).optional()
}).passthrough().optional()
}).passthrough().optional(),
  include: z.array(z.enum(["item.input_audio_transcription.logprobs"])).optional(),
  tracing: z.union([z.union([z.enum(["auto"]), z.object({
  workflow_name: z.string().optional(),
  group_id: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
}).passthrough()]), z.null()]).optional(),
  tools: z.array(z.union([RealtimeFunctionToolSchema, MCPToolSchema])).optional(),
  tool_choice: z.union([ToolChoiceOptionsSchema, ToolChoiceFunctionSchema, ToolChoiceMCPSchema]).optional(),
  reasoning: RealtimeReasoningSchema.optional(),
  max_output_tokens: z.union([z.number(), z.enum(["inf"])]).optional(),
  truncation: RealtimeTruncationSchema.optional(),
  prompt: PromptSchema.optional()
}).passthrough()

export const ComputerToolCallSchema = z.object({
  type: z.enum(["computer_call"]),
  id: z.string(),
  call_id: z.string(),
  action: ComputerActionSchema.optional(),
  actions: ComputerActionListSchema.optional(),
  pending_safety_checks: z.array(ComputerCallSafetyCheckParamSchema),
  status: z.enum(["in_progress", "completed", "incomplete"])
}).passthrough()

export const ToolSchema = z.union([FunctionToolSchema, FileSearchToolSchema, ComputerToolSchema, ComputerUsePreviewToolSchema, WebSearchToolSchema, MCPToolSchema, CodeInterpreterToolSchema, ImageGenToolSchema, LocalShellToolParamSchema, FunctionShellToolParamSchema, CustomToolParamSchema, NamespaceToolParamSchema, ToolSearchToolParamSchema, WebSearchPreviewToolSchema, ApplyPatchToolParamSchema])

export const ThreadItemSchema = z.union([UserMessageItemSchema, AssistantMessageItemSchema, WidgetMessageItemSchema, ClientToolCallItemSchema, TaskItemSchema, TaskGroupItemSchema])

export const ListRunStepsResponseSchema = z.unknown()

export const RunStepStreamEventSchema = z.union([z.object({
  event: z.enum(["thread.run.step.created"]),
  data: RunStepObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.run.step.in_progress"]),
  data: RunStepObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.run.step.delta"]),
  data: RunStepDeltaObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.run.step.completed"]),
  data: RunStepObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.run.step.failed"]),
  data: RunStepObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.run.step.cancelled"]),
  data: RunStepObjectSchema
}).passthrough(), z.object({
  event: z.enum(["thread.run.step.expired"]),
  data: RunStepObjectSchema
}).passthrough()])

export const CreateEvalItemSchema = z.union([z.object({
  role: z.string(),
  content: z.string()
}).passthrough(), EvalItemSchema])

export const GraderLabelModelSchema = z.object({
  type: z.enum(["label_model"]),
  name: z.string(),
  model: z.string(),
  input: z.array(EvalItemSchema),
  labels: z.array(z.string()),
  passing_labels: z.array(z.string())
}).passthrough()

export const GraderScoreModelSchema = z.object({
  type: z.enum(["score_model"]),
  name: z.string(),
  model: z.string(),
  sampling_params: z.object({
  seed: z.union([z.number(), z.null()]).optional(),
  top_p: z.union([z.number(), z.null()]).optional(),
  temperature: z.union([z.number(), z.null()]).optional(),
  max_completions_tokens: z.union([z.number().min(1), z.null()]).optional(),
  reasoning_effort: ReasoningEffortSchema.optional()
}).passthrough().optional(),
  input: z.array(EvalItemSchema),
  range: z.array(z.number()).optional()
}).passthrough()

export const CreateEvalCompletionsRunDataSourceSchema = z.object({
  type: z.enum(["completions"]),
  input_messages: z.union([z.object({
  type: z.enum(["template"]),
  template: z.array(z.union([EasyInputMessageSchema, EvalItemSchema]))
}).passthrough(), z.object({
  type: z.enum(["item_reference"]),
  item_reference: z.string()
}).passthrough()]).optional(),
  sampling_params: z.object({
  reasoning_effort: ReasoningEffortSchema.optional(),
  temperature: z.number().optional(),
  max_completion_tokens: z.number().optional(),
  top_p: z.number().optional(),
  seed: z.number().optional(),
  response_format: z.union([ResponseFormatTextSchema, ResponseFormatJsonSchemaSchema, ResponseFormatJsonObjectSchema]).optional(),
  tools: z.array(ChatCompletionToolSchema).optional()
}).passthrough().optional(),
  model: z.string().optional(),
  source: z.union([EvalJsonlFileContentSourceSchema, EvalJsonlFileIdSourceSchema, EvalStoredCompletionsSourceSchema])
}).passthrough()

export const InputMessageResourceSchema = InputMessageSchema.and(z.object({
  id: z.string()
}).passthrough())

export const RealtimeBetaClientEventResponseCreateSchema = z.object({
  event_id: z.string().optional(),
  type: z.enum(["response.create"]),
  response: RealtimeBetaResponseCreateParamsSchema.optional()
}).passthrough()

export const RealtimeClientEventResponseCreateSchema = z.object({
  event_id: z.string().max(512).optional(),
  type: z.enum(["response.create"]),
  response: RealtimeResponseCreateParamsSchema.optional()
}).passthrough()

export const RealtimeBetaServerEventSessionCreatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["session.created"]),
  session: RealtimeSessionSchema
}).passthrough()

export const RealtimeBetaServerEventSessionUpdatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["session.updated"]),
  session: RealtimeSessionSchema
}).passthrough()

export const RealtimeBetaClientEventSessionUpdateSchema = z.object({
  event_id: z.string().optional(),
  type: z.enum(["session.update"]),
  session: RealtimeSessionCreateRequestSchema
}).passthrough()

export const RealtimeCallCreateRequestSchema = z.object({
  sdp: z.string(),
  session: RealtimeSessionCreateRequestGASchema.optional()
}).passthrough()

export const RealtimeClientEventSessionUpdateSchema = z.object({
  event_id: z.string().max(512).optional(),
  type: z.enum(["session.update"]),
  session: z.union([RealtimeSessionCreateRequestGASchema, RealtimeTranscriptionSessionCreateRequestGASchema])
}).passthrough()

export const RealtimeCreateClientSecretRequestSchema = z.object({
  expires_after: z.object({
  anchor: z.enum(["created_at"]).optional(),
  seconds: z.number().min(10).max(7200).optional()
}).passthrough().optional(),
  session: z.union([RealtimeSessionCreateRequestGASchema, RealtimeTranscriptionSessionCreateRequestGASchema]).optional()
}).passthrough()

export const RealtimeCreateClientSecretResponseSchema = z.object({
  value: z.string(),
  expires_at: z.number(),
  session: z.union([RealtimeSessionCreateResponseGASchema, RealtimeTranscriptionSessionCreateResponseGASchema])
}).passthrough()

export const RealtimeServerEventSessionCreatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["session.created"]),
  session: z.union([RealtimeSessionCreateResponseGASchema, RealtimeTranscriptionSessionCreateResponseGASchema])
}).passthrough()

export const RealtimeServerEventSessionUpdatedSchema = z.object({
  event_id: z.string(),
  type: z.enum(["session.updated"]),
  session: z.union([RealtimeSessionCreateResponseGASchema, RealtimeTranscriptionSessionCreateResponseGASchema])
}).passthrough()

export const CreateEvalResponsesRunDataSourceSchema = z.object({
  type: z.enum(["responses"]),
  input_messages: z.union([z.object({
  type: z.enum(["template"]),
  template: z.array(z.union([z.object({
  role: z.string(),
  content: z.string()
}).passthrough(), EvalItemSchema]))
}).passthrough(), z.object({
  type: z.enum(["item_reference"]),
  item_reference: z.string()
}).passthrough()]).optional(),
  sampling_params: z.object({
  reasoning_effort: ReasoningEffortSchema.optional(),
  temperature: z.number().optional(),
  max_completion_tokens: z.number().optional(),
  top_p: z.number().optional(),
  seed: z.number().optional(),
  tools: z.array(ToolSchema).optional(),
  text: z.object({
  format: TextResponseFormatConfigurationSchema.optional()
}).passthrough().optional()
}).passthrough().optional(),
  model: z.string().optional(),
  source: z.union([EvalJsonlFileContentSourceSchema, EvalJsonlFileIdSourceSchema, EvalResponsesSourceSchema])
}).passthrough()

export const ToolsArraySchema = z.array(ToolSchema)

export const ToolSearchOutputSchema = z.object({
  type: z.enum(["tool_search_output"]),
  id: z.string(),
  call_id: z.union([z.string(), z.null()]),
  execution: ToolSearchExecutionTypeSchema,
  tools: z.array(ToolSchema),
  status: FunctionCallOutputStatusEnumSchema,
  created_by: z.string().optional()
}).passthrough()

export const ToolSearchOutputItemParamSchema = z.object({
  id: z.union([z.string(), z.null()]).optional(),
  call_id: z.union([z.string().min(1).max(64), z.null()]).optional(),
  type: z.enum(["tool_search_output"]),
  execution: ToolSearchExecutionTypeSchema.optional(),
  tools: z.array(ToolSchema),
  status: z.union([FunctionCallItemStatusSchema, z.null()]).optional()
}).passthrough()

export const ThreadItemListResourceSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(ThreadItemSchema),
  first_id: z.union([z.string(), z.null()]),
  last_id: z.union([z.string(), z.null()]),
  has_more: z.boolean()
}).passthrough()

export const AssistantStreamEventSchema = z.union([ThreadStreamEventSchema, RunStreamEventSchema, RunStepStreamEventSchema, MessageStreamEventSchema, ErrorEventSchema, DoneEventSchema])

export const CreateEvalLabelModelGraderSchema = z.object({
  type: z.enum(["label_model"]),
  name: z.string(),
  model: z.string(),
  input: z.array(CreateEvalItemSchema),
  labels: z.array(z.string()),
  passing_labels: z.array(z.string())
}).passthrough()

export const EvalGraderLabelModelSchema = GraderLabelModelSchema

export const EvalGraderScoreModelSchema = GraderScoreModelSchema.and(z.object({
  pass_threshold: z.number().optional()
}).passthrough())

export const GraderMultiSchema = z.object({
  type: z.enum(["multi"]),
  name: z.string(),
  graders: z.union([GraderStringCheckSchema, GraderTextSimilaritySchema, GraderPythonSchema, GraderScoreModelSchema, GraderLabelModelSchema]),
  calculate_output: z.string()
}).passthrough()

export const RealtimeClientEventSchema = z.union([RealtimeClientEventConversationItemCreateSchema, RealtimeClientEventConversationItemDeleteSchema, RealtimeClientEventConversationItemRetrieveSchema, RealtimeClientEventConversationItemTruncateSchema, RealtimeClientEventInputAudioBufferAppendSchema, RealtimeClientEventInputAudioBufferClearSchema, RealtimeClientEventOutputAudioBufferClearSchema, RealtimeClientEventInputAudioBufferCommitSchema, RealtimeClientEventResponseCancelSchema, RealtimeClientEventResponseCreateSchema, RealtimeClientEventSessionUpdateSchema])

export const RealtimeServerEventSchema = z.union([RealtimeServerEventConversationCreatedSchema, RealtimeServerEventConversationItemCreatedSchema, RealtimeServerEventConversationItemDeletedSchema, RealtimeServerEventConversationItemInputAudioTranscriptionCompletedSchema, RealtimeServerEventConversationItemInputAudioTranscriptionDeltaSchema, RealtimeServerEventConversationItemInputAudioTranscriptionFailedSchema, RealtimeServerEventConversationItemRetrievedSchema, RealtimeServerEventConversationItemTruncatedSchema, RealtimeServerEventErrorSchema, RealtimeServerEventInputAudioBufferClearedSchema, RealtimeServerEventInputAudioBufferCommittedSchema, RealtimeServerEventInputAudioBufferDtmfEventReceivedSchema, RealtimeServerEventInputAudioBufferSpeechStartedSchema, RealtimeServerEventInputAudioBufferSpeechStoppedSchema, RealtimeServerEventRateLimitsUpdatedSchema, RealtimeServerEventResponseAudioDeltaSchema, RealtimeServerEventResponseAudioDoneSchema, RealtimeServerEventResponseAudioTranscriptDeltaSchema, RealtimeServerEventResponseAudioTranscriptDoneSchema, RealtimeServerEventResponseContentPartAddedSchema, RealtimeServerEventResponseContentPartDoneSchema, RealtimeServerEventResponseCreatedSchema, RealtimeServerEventResponseDoneSchema, RealtimeServerEventResponseFunctionCallArgumentsDeltaSchema, RealtimeServerEventResponseFunctionCallArgumentsDoneSchema, RealtimeServerEventResponseOutputItemAddedSchema, RealtimeServerEventResponseOutputItemDoneSchema, RealtimeServerEventResponseTextDeltaSchema, RealtimeServerEventResponseTextDoneSchema, RealtimeServerEventSessionCreatedSchema, RealtimeServerEventSessionUpdatedSchema, RealtimeServerEventOutputAudioBufferStartedSchema, RealtimeServerEventOutputAudioBufferStoppedSchema, RealtimeServerEventOutputAudioBufferClearedSchema, RealtimeServerEventConversationItemAddedSchema, RealtimeServerEventConversationItemDoneSchema, RealtimeServerEventInputAudioBufferTimeoutTriggeredSchema, RealtimeServerEventConversationItemInputAudioTranscriptionSegmentSchema, RealtimeServerEventMCPListToolsInProgressSchema, RealtimeServerEventMCPListToolsCompletedSchema, RealtimeServerEventMCPListToolsFailedSchema, RealtimeServerEventResponseMCPCallArgumentsDeltaSchema, RealtimeServerEventResponseMCPCallArgumentsDoneSchema, RealtimeServerEventResponseMCPCallInProgressSchema, RealtimeServerEventResponseMCPCallCompletedSchema, RealtimeServerEventResponseMCPCallFailedSchema])

export const CreateEvalRunRequestSchema = z.object({
  name: z.string().optional(),
  metadata: MetadataSchema.optional(),
  data_source: z.union([CreateEvalJsonlRunDataSourceSchema, CreateEvalCompletionsRunDataSourceSchema, CreateEvalResponsesRunDataSourceSchema])
}).passthrough()

export const EvalRunSchema = z.object({
  object: z.enum(["eval.run"]),
  id: z.string(),
  eval_id: z.string(),
  status: z.string(),
  model: z.string(),
  name: z.string(),
  created_at: z.number(),
  report_url: z.string(),
  result_counts: z.object({
  total: z.number(),
  errored: z.number(),
  failed: z.number(),
  passed: z.number()
}).passthrough(),
  per_model_usage: z.array(z.object({
  model_name: z.string(),
  invocation_count: z.number(),
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  total_tokens: z.number(),
  cached_tokens: z.number()
}).passthrough()),
  per_testing_criteria_results: z.array(z.object({
  testing_criteria: z.string(),
  passed: z.number(),
  failed: z.number()
}).passthrough()),
  data_source: z.union([CreateEvalJsonlRunDataSourceSchema, CreateEvalCompletionsRunDataSourceSchema, CreateEvalResponsesRunDataSourceSchema]),
  metadata: MetadataSchema,
  error: EvalApiErrorSchema
}).passthrough()

export const ResponsePropertiesSchema = z.object({
  previous_response_id: z.union([z.string(), z.null()]).optional(),
  model: ModelIdsResponsesSchema.optional(),
  reasoning: z.union([ReasoningSchema, z.null()]).optional(),
  background: z.union([z.boolean(), z.null()]).optional(),
  max_tool_calls: z.union([z.number(), z.null()]).optional(),
  text: ResponseTextParamSchema.optional(),
  tools: ToolsArraySchema.optional(),
  tool_choice: ToolChoiceParamSchema.optional(),
  prompt: PromptSchema.optional(),
  truncation: z.union([z.enum(["auto", "disabled"]), z.null()]).optional()
}).passthrough()

export const ConversationItemSchema = z.union([MessageSchema, FunctionToolCallResourceSchema, FunctionToolCallOutputResourceSchema, FileSearchToolCallSchema, WebSearchToolCallSchema, ImageGenToolCallSchema, ComputerToolCallSchema, ComputerToolCallOutputResourceSchema, ToolSearchCallSchema, ToolSearchOutputSchema, ReasoningItemSchema, CompactionBodySchema, CodeInterpreterToolCallSchema, LocalShellToolCallSchema, LocalShellToolCallOutputSchema, FunctionShellCallSchema, FunctionShellCallOutputSchema, ApplyPatchToolCallSchema, ApplyPatchToolCallOutputSchema, MCPListToolsSchema, MCPApprovalRequestSchema, MCPApprovalResponseResourceSchema, MCPToolCallSchema, CustomToolCallSchema, CustomToolCallOutputSchema])

export const ItemResourceSchema = z.union([InputMessageResourceSchema, OutputMessageSchema, FileSearchToolCallSchema, ComputerToolCallSchema, ComputerToolCallOutputResourceSchema, WebSearchToolCallSchema, FunctionToolCallResourceSchema, FunctionToolCallOutputResourceSchema, ToolSearchCallSchema, ToolSearchOutputSchema, ReasoningItemSchema, CompactionBodySchema, ImageGenToolCallSchema, CodeInterpreterToolCallSchema, LocalShellToolCallSchema, LocalShellToolCallOutputSchema, FunctionShellCallSchema, FunctionShellCallOutputSchema, ApplyPatchToolCallSchema, ApplyPatchToolCallOutputSchema, MCPListToolsSchema, MCPApprovalRequestSchema, MCPApprovalResponseResourceSchema, MCPToolCallSchema, CustomToolCallResourceSchema, CustomToolCallOutputResourceSchema])

export const OutputItemSchema = z.union([OutputMessageSchema, FileSearchToolCallSchema, FunctionToolCallSchema, FunctionToolCallOutputResourceSchema, WebSearchToolCallSchema, ComputerToolCallSchema, ComputerToolCallOutputResourceSchema, ReasoningItemSchema, ToolSearchCallSchema, ToolSearchOutputSchema, CompactionBodySchema, ImageGenToolCallSchema, CodeInterpreterToolCallSchema, LocalShellToolCallSchema, LocalShellToolCallOutputSchema, FunctionShellCallSchema, FunctionShellCallOutputSchema, ApplyPatchToolCallSchema, ApplyPatchToolCallOutputSchema, MCPToolCallSchema, MCPListToolsSchema, MCPApprovalRequestSchema, MCPApprovalResponseResourceSchema, CustomToolCallSchema, CustomToolCallOutputResourceSchema])

export const ItemFieldSchema = z.union([MessageSchema, FunctionToolCallSchema, ToolSearchCallSchema, ToolSearchOutputSchema, FunctionToolCallOutputSchema, FileSearchToolCallSchema, WebSearchToolCallSchema, ImageGenToolCallSchema, ComputerToolCallSchema, ComputerToolCallOutputResourceSchema, ReasoningItemSchema, CompactionBodySchema, CodeInterpreterToolCallSchema, LocalShellToolCallSchema, LocalShellToolCallOutputSchema, FunctionShellCallSchema, FunctionShellCallOutputSchema, ApplyPatchToolCallSchema, ApplyPatchToolCallOutputSchema, MCPListToolsSchema, MCPApprovalRequestSchema, MCPApprovalResponseResourceSchema, MCPToolCallSchema, CustomToolCallSchema, CustomToolCallOutputSchema])

export const ItemSchema = z.union([InputMessageSchema, OutputMessageSchema, FileSearchToolCallSchema, ComputerToolCallSchema, ComputerCallOutputItemParamSchema, WebSearchToolCallSchema, FunctionToolCallSchema, FunctionCallOutputItemParamSchema, ToolSearchCallItemParamSchema, ToolSearchOutputItemParamSchema, ReasoningItemSchema, CompactionSummaryItemParamSchema, ImageGenToolCallSchema, CodeInterpreterToolCallSchema, LocalShellToolCallSchema, LocalShellToolCallOutputSchema, FunctionShellCallItemParamSchema, FunctionShellCallOutputItemParamSchema, ApplyPatchToolCallItemParamSchema, ApplyPatchToolCallOutputItemParamSchema, MCPListToolsSchema, MCPApprovalRequestSchema, MCPApprovalResponseSchema, MCPToolCallSchema, CustomToolCallOutputSchema, CustomToolCallSchema])

export const CreateEvalRequestSchema = z.object({
  name: z.string().optional(),
  metadata: MetadataSchema.optional(),
  data_source_config: z.union([CreateEvalCustomDataSourceConfigSchema, CreateEvalLogsDataSourceConfigSchema, CreateEvalStoredCompletionsDataSourceConfigSchema]),
  testing_criteria: z.array(z.union([CreateEvalLabelModelGraderSchema, EvalGraderStringCheckSchema, EvalGraderTextSimilaritySchema, EvalGraderPythonSchema, EvalGraderScoreModelSchema]))
}).passthrough()

export const EvalSchema = z.object({
  object: z.enum(["eval"]),
  id: z.string(),
  name: z.string(),
  data_source_config: z.union([EvalCustomDataSourceConfigSchema, EvalLogsDataSourceConfigSchema, EvalStoredCompletionsDataSourceConfigSchema]),
  testing_criteria: z.array(z.union([EvalGraderLabelModelSchema, EvalGraderStringCheckSchema, EvalGraderTextSimilaritySchema, EvalGraderPythonSchema, EvalGraderScoreModelSchema])),
  created_at: z.number(),
  metadata: MetadataSchema
}).passthrough()

export const FineTuneReinforcementMethodSchema = z.object({
  grader: z.union([GraderStringCheckSchema, GraderTextSimilaritySchema, GraderPythonSchema, GraderScoreModelSchema, GraderMultiSchema]),
  hyperparameters: FineTuneReinforcementHyperparametersSchema.optional()
}).passthrough()

export const RunGraderRequestSchema = z.object({
  grader: z.union([GraderStringCheckSchema, GraderTextSimilaritySchema, GraderPythonSchema, GraderScoreModelSchema, GraderMultiSchema]),
  item: z.record(z.string(), z.unknown()).optional(),
  model_sample: z.string()
}).passthrough()

export const ValidateGraderRequestSchema = z.object({
  grader: z.union([GraderStringCheckSchema, GraderTextSimilaritySchema, GraderPythonSchema, GraderScoreModelSchema, GraderMultiSchema])
}).passthrough()

export const ValidateGraderResponseSchema = z.object({
  grader: z.union([GraderStringCheckSchema, GraderTextSimilaritySchema, GraderPythonSchema, GraderScoreModelSchema, GraderMultiSchema]).optional()
}).passthrough()

export const EvalRunListSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(EvalRunSchema),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean()
}).passthrough()

export const ConversationItemListSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(ConversationItemSchema),
  has_more: z.boolean(),
  first_id: z.string(),
  last_id: z.string()
}).passthrough()

export const ResponseItemListSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(ItemResourceSchema),
  has_more: z.boolean(),
  first_id: z.string(),
  last_id: z.string()
}).passthrough()

export const ResponseOutputItemAddedEventSchema = z.object({
  type: z.enum(["response.output_item.added"]),
  output_index: z.number(),
  sequence_number: z.number(),
  item: OutputItemSchema
}).passthrough()

export const ResponseOutputItemDoneEventSchema = z.object({
  type: z.enum(["response.output_item.done"]),
  output_index: z.number(),
  sequence_number: z.number(),
  item: OutputItemSchema
}).passthrough()

export const CompactResourceSchema = z.object({
  id: z.string(),
  object: z.enum(["response.compaction"]),
  output: z.array(ItemFieldSchema),
  created_at: z.number(),
  usage: ResponseUsageSchema
}).passthrough()

export const InputItemSchema = z.union([EasyInputMessageSchema, ItemSchema, ItemReferenceParamSchema])

export const EvalListSchema = z.object({
  object: z.enum(["list"]),
  data: z.array(EvalSchema),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean()
}).passthrough()

export const FineTuneMethodSchema = z.object({
  type: z.enum(["supervised", "dpo", "reinforcement"]),
  supervised: FineTuneSupervisedMethodSchema.optional(),
  dpo: FineTuneDPOMethodSchema.optional(),
  reinforcement: FineTuneReinforcementMethodSchema.optional()
}).passthrough()

export const InputParamSchema = z.union([z.string(), z.array(InputItemSchema)])

export const ResponseSchema = ModelResponsePropertiesSchema.and(ResponsePropertiesSchema).and(z.object({
  id: z.string(),
  object: z.enum(["response"]),
  status: z.enum(["completed", "failed", "in_progress", "cancelled", "queued", "incomplete"]).optional(),
  created_at: z.number(),
  completed_at: z.union([z.number(), z.null()]).optional(),
  error: ResponseErrorSchema,
  incomplete_details: z.union([z.object({
  reason: z.enum(["max_output_tokens", "content_filter"]).optional()
}).passthrough(), z.null()]),
  output: z.array(OutputItemSchema),
  instructions: z.union([z.union([z.string(), z.array(InputItemSchema)]), z.null()]),
  output_text: z.union([z.string(), z.null()]).optional(),
  usage: ResponseUsageSchema.optional(),
  parallel_tool_calls: z.boolean(),
  conversation: z.union([Conversation2Schema, z.null()]).optional(),
  max_output_tokens: z.union([z.number(), z.null()]).optional()
}).passthrough())

export const CreateConversationBodySchema = z.object({
  metadata: z.union([MetadataSchema, z.null()]).optional(),
  items: z.union([z.array(InputItemSchema).max(20), z.null()]).optional()
}).passthrough()

export const TokenCountsBodySchema = z.object({
  model: z.union([z.string(), z.null()]).optional(),
  input: z.union([z.union([z.string().max(10485760), z.array(InputItemSchema)]), z.null()]).optional(),
  previous_response_id: z.union([z.string(), z.null()]).optional(),
  tools: z.union([z.array(ToolSchema), z.null()]).optional(),
  text: z.union([ResponseTextParamSchema, z.null()]).optional(),
  reasoning: z.union([ReasoningSchema, z.null()]).optional(),
  truncation: TruncationEnumSchema.optional(),
  instructions: z.union([z.string(), z.null()]).optional(),
  conversation: z.union([ConversationParamSchema, z.null()]).optional(),
  tool_choice: z.union([ToolChoiceParamSchema, z.null()]).optional(),
  parallel_tool_calls: z.union([z.boolean(), z.null()]).optional()
}).passthrough()

export const CompactResponseMethodPublicBodySchema = z.object({
  model: ModelIdsCompactionSchema,
  input: z.union([z.union([z.string().max(10485760), z.array(InputItemSchema)]), z.null()]).optional(),
  previous_response_id: z.union([z.string(), z.null()]).optional(),
  instructions: z.union([z.string(), z.null()]).optional(),
  prompt_cache_key: z.union([z.string().max(64), z.null()]).optional(),
  prompt_cache_retention: z.union([PromptCacheRetentionEnumSchema, z.null()]).optional(),
  service_tier: z.union([ServiceTierEnumSchema, z.null()]).optional()
}).passthrough()

export const CreateFineTuningJobRequestSchema = z.object({
  model: z.union([z.string(), z.enum(["babbage-002", "davinci-002", "gpt-3.5-turbo", "gpt-4o-mini"])]),
  training_file: z.string(),
  hyperparameters: z.object({
  batch_size: z.union([z.enum(["auto"]), z.number().min(1).max(256)]).optional(),
  learning_rate_multiplier: z.union([z.enum(["auto"]), z.number().min(0)]).optional(),
  n_epochs: z.union([z.enum(["auto"]), z.number().min(1).max(50)]).optional()
}).passthrough().optional(),
  suffix: z.string().min(1).max(64).optional(),
  validation_file: z.string().optional(),
  integrations: z.array(z.object({
  type: z.union([z.enum(["wandb"])]),
  wandb: z.object({
  project: z.string(),
  name: z.string().optional(),
  entity: z.string().optional(),
  tags: z.array(z.string()).optional()
}).passthrough()
}).passthrough()).optional(),
  seed: z.number().min(0).max(2147483647).optional(),
  method: FineTuneMethodSchema.optional(),
  metadata: MetadataSchema.optional()
}).passthrough()

export const FineTuningJobSchema = z.object({
  id: z.string(),
  created_at: z.number(),
  error: z.union([z.object({
  code: z.string(),
  message: z.string(),
  param: z.union([z.string(), z.null()])
}).passthrough(), z.null()]),
  fine_tuned_model: z.union([z.string(), z.null()]),
  finished_at: z.union([z.number(), z.null()]),
  hyperparameters: z.object({
  batch_size: z.union([z.union([z.enum(["auto"]), z.number().min(1).max(256)]), z.null()]).optional(),
  learning_rate_multiplier: z.union([z.enum(["auto"]), z.number().min(0)]).optional(),
  n_epochs: z.union([z.enum(["auto"]), z.number().min(1).max(50)]).optional()
}).passthrough(),
  model: z.string(),
  object: z.enum(["fine_tuning.job"]),
  organization_id: z.string(),
  result_files: z.array(z.string()),
  status: z.enum(["validating_files", "queued", "running", "succeeded", "failed", "cancelled"]),
  trained_tokens: z.union([z.number(), z.null()]),
  training_file: z.string(),
  validation_file: z.union([z.string(), z.null()]),
  integrations: z.union([z.array(z.union([FineTuningIntegrationSchema])).max(5), z.null()]).optional(),
  seed: z.number(),
  estimated_finish: z.union([z.number(), z.null()]).optional(),
  method: FineTuneMethodSchema.optional(),
  metadata: MetadataSchema.optional()
}).passthrough()

export const CreateResponseSchema = CreateModelResponsePropertiesSchema.and(ResponsePropertiesSchema).and(z.object({
  input: InputParamSchema.optional(),
  include: z.union([z.array(IncludeEnumSchema), z.null()]).optional(),
  parallel_tool_calls: z.union([z.boolean(), z.null()]).optional(),
  store: z.union([z.boolean(), z.null()]).optional(),
  instructions: z.union([z.string(), z.null()]).optional(),
  stream: z.union([z.boolean(), z.null()]).optional(),
  stream_options: ResponseStreamOptionsSchema.optional(),
  conversation: z.union([ConversationParamSchema, z.null()]).optional(),
  context_management: z.union([z.array(ContextManagementParamSchema).min(1), z.null()]).optional(),
  max_output_tokens: z.union([z.number().min(16), z.null()]).optional()
}).passthrough())

export const ResponseCompletedEventSchema = z.object({
  type: z.enum(["response.completed"]),
  response: ResponseSchema,
  sequence_number: z.number()
}).passthrough()

export const ResponseCreatedEventSchema = z.object({
  type: z.enum(["response.created"]),
  response: ResponseSchema,
  sequence_number: z.number()
}).passthrough()

export const ResponseFailedEventSchema = z.object({
  type: z.enum(["response.failed"]),
  sequence_number: z.number(),
  response: ResponseSchema
}).passthrough()

export const ResponseInProgressEventSchema = z.object({
  type: z.enum(["response.in_progress"]),
  response: ResponseSchema,
  sequence_number: z.number()
}).passthrough()

export const ResponseIncompleteEventSchema = z.object({
  type: z.enum(["response.incomplete"]),
  response: ResponseSchema,
  sequence_number: z.number()
}).passthrough()

export const ResponseQueuedEventSchema = z.object({
  type: z.enum(["response.queued"]),
  response: ResponseSchema,
  sequence_number: z.number()
}).passthrough()

export const ListPaginatedFineTuningJobsResponseSchema = z.object({
  data: z.array(FineTuningJobSchema),
  has_more: z.boolean(),
  object: z.enum(["list"])
}).passthrough()

export const ResponsesClientEventResponseCreateSchema = z.object({
  type: z.enum(["response.create"])
}).passthrough().and(CreateResponseSchema)

export const ResponseStreamEventSchema = z.union([ResponseAudioDeltaEventSchema, ResponseAudioDoneEventSchema, ResponseAudioTranscriptDeltaEventSchema, ResponseAudioTranscriptDoneEventSchema, ResponseCodeInterpreterCallCodeDeltaEventSchema, ResponseCodeInterpreterCallCodeDoneEventSchema, ResponseCodeInterpreterCallCompletedEventSchema, ResponseCodeInterpreterCallInProgressEventSchema, ResponseCodeInterpreterCallInterpretingEventSchema, ResponseCompletedEventSchema, ResponseContentPartAddedEventSchema, ResponseContentPartDoneEventSchema, ResponseCreatedEventSchema, ResponseErrorEventSchema, ResponseFileSearchCallCompletedEventSchema, ResponseFileSearchCallInProgressEventSchema, ResponseFileSearchCallSearchingEventSchema, ResponseFunctionCallArgumentsDeltaEventSchema, ResponseFunctionCallArgumentsDoneEventSchema, ResponseInProgressEventSchema, ResponseFailedEventSchema, ResponseIncompleteEventSchema, ResponseOutputItemAddedEventSchema, ResponseOutputItemDoneEventSchema, ResponseReasoningSummaryPartAddedEventSchema, ResponseReasoningSummaryPartDoneEventSchema, ResponseReasoningSummaryTextDeltaEventSchema, ResponseReasoningSummaryTextDoneEventSchema, ResponseReasoningTextDeltaEventSchema, ResponseReasoningTextDoneEventSchema, ResponseRefusalDeltaEventSchema, ResponseRefusalDoneEventSchema, ResponseTextDeltaEventSchema, ResponseTextDoneEventSchema, ResponseWebSearchCallCompletedEventSchema, ResponseWebSearchCallInProgressEventSchema, ResponseWebSearchCallSearchingEventSchema, ResponseImageGenCallCompletedEventSchema, ResponseImageGenCallGeneratingEventSchema, ResponseImageGenCallInProgressEventSchema, ResponseImageGenCallPartialImageEventSchema, ResponseMCPCallArgumentsDeltaEventSchema, ResponseMCPCallArgumentsDoneEventSchema, ResponseMCPCallCompletedEventSchema, ResponseMCPCallFailedEventSchema, ResponseMCPCallInProgressEventSchema, ResponseMCPListToolsCompletedEventSchema, ResponseMCPListToolsFailedEventSchema, ResponseMCPListToolsInProgressEventSchema, ResponseOutputTextAnnotationAddedEventSchema, ResponseQueuedEventSchema, ResponseCustomToolCallInputDeltaEventSchema, ResponseCustomToolCallInputDoneEventSchema])

export const ResponsesClientEventSchema = z.union([ResponsesClientEventResponseCreateSchema])

export const ResponsesServerEventSchema = z.union([ResponseStreamEventSchema])
