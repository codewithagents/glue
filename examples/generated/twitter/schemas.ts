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

export const AggregateSchema = z.number()

export const CashtagFieldsSchema = z.object({
  tag: z.string()
}).passthrough()

export const ComplianceJobNameSchema = z.string().max(64)

export const ComplianceJobStatusSchema = z.enum(["created", "in_progress", "failed", "complete", "expired"])

export const ComplianceJobTypeSchema = z.enum(["tweets", "users"])

export const ContextAnnotationDomainFieldsSchema = z.object({
  description: z.string().optional(),
  id: z.string().regex(new RegExp("^[0-9]{1,19}$")),
  name: z.string().optional()
}).passthrough()

export const ContextAnnotationEntityFieldsSchema = z.object({
  description: z.string().optional(),
  id: z.string().regex(new RegExp("^[0-9]{1,19}$")),
  name: z.string().optional()
}).passthrough()

export const CountryCodeSchema = z.string().regex(new RegExp("^[A-Z]{2}$"))

export const CreatedAtSchema = z.string()

export const DmConversationIdSchema = z.string().regex(new RegExp("^([0-9]{1,19}-[0-9]{1,19}|[0-9]{15,19})$"))

export const DmEventIdSchema = z.string().regex(new RegExp("^[0-9]{1,19}$"))

export const DownloadExpirationSchema = z.string()

export const DownloadUrlSchema = z.string()

export const EndSchema = z.string()

export const EntityIndicesInclusiveExclusiveSchema = z.object({
  end: z.number().min(0),
  start: z.number().min(0)
}).passthrough()

export const EntityIndicesInclusiveInclusiveSchema = z.object({
  end: z.number().min(0),
  start: z.number().min(0)
}).passthrough()

export const ErrorSchema = z.object({
  code: z.number(),
  message: z.string()
}).passthrough()

export const HashtagFieldsSchema = z.object({
  tag: z.string()
}).passthrough()

export const HttpStatusCodeSchema = z.number().min(100).max(599)

export const JobIdSchema = z.string().regex(new RegExp("^[0-9]{1,19}$"))

export const ListCreateRequestSchema = z.object({
  description: z.string().min(0).max(100).optional(),
  name: z.string().min(1).max(25),
  private: z.boolean().optional()
}).passthrough()

export const ListIdSchema = z.string().regex(new RegExp("^[0-9]{1,19}$"))

export const ListUpdateRequestSchema = z.object({
  description: z.string().min(0).max(100).optional(),
  name: z.string().min(1).max(25).optional(),
  private: z.boolean().optional()
}).passthrough()

export const MediaHeightSchema = z.number().min(0)

export const MediaIdSchema = z.string().regex(new RegExp("^[0-9]{1,19}$"))

export const MediaKeySchema = z.string().regex(new RegExp("^([0-9]+)_([0-9]+)$"))

export const MediaWidthSchema = z.number().min(0)

export const NewestIdSchema = z.string()

export const NextTokenSchema = z.string().min(1)

export const OldestIdSchema = z.string()

export const PaginationToken32Schema = z.string().min(16)

export const PaginationToken36Schema = z.string().min(1)

export const PaginationTokenLongSchema = z.string().min(1).max(19)

export const PlaceIdSchema = z.string()

export const PlaceTypeSchema = z.enum(["poi", "neighborhood", "city", "admin", "country", "unknown"])

export const PollIdSchema = z.string().regex(new RegExp("^[0-9]{1,19}$"))

export const PollOptionLabelSchema = z.string().min(1).max(25)

export const PositionSchema = z.array(z.number()).min(2).max(2)

export const PreviousTokenSchema = z.string().min(1)

export const ProblemSchema = z.object({
  detail: z.string().optional(),
  status: z.number().optional(),
  title: z.string(),
  type: z.string()
}).passthrough()

export const ReplySettingsSchema = z.enum(["everyone", "mentionedUsers", "following", "other"])

export const ResultCountSchema = z.number()

export const RuleIdSchema = z.string().regex(new RegExp("^[0-9]{1,19}$"))

export const RuleTagSchema = z.string()

export const RuleValueSchema = z.string()

export const RulesRequestSummarySchema = z.union([z.object({
  created: z.number(),
  invalid: z.number(),
  not_created: z.number(),
  valid: z.number()
}).passthrough(), z.object({
  deleted: z.number(),
  not_deleted: z.number()
}).passthrough()])

export const SpaceIdSchema = z.string().regex(new RegExp("^[a-zA-Z0-9]{1,13}$"))

export const StartSchema = z.string()

export const TopicIdSchema = z.string()

export const TweetCountSchema = z.number()

export const TweetHideRequestSchema = z.object({
  hidden: z.boolean()
}).passthrough()

export const TweetHideResponseSchema = z.object({
  data: z.object({
  hidden: z.boolean().optional()
}).passthrough().optional()
}).passthrough()

export const TweetIdSchema = z.string().regex(new RegExp("^[0-9]{1,19}$"))

export const TweetTextSchema = z.string()

export const UploadExpirationSchema = z.string()

export const UploadUrlSchema = z.string()

export const UrlSchema = z.string()

export const UserIdSchema = z.string().regex(new RegExp("^[0-9]{1,19}$"))

export const UserIdMatchesAuthenticatedUserSchema = z.string()

export const UserNameSchema = z.string().regex(new RegExp("^[A-Za-z0-9_]{1,15}$"))

export const VariantSchema = z.object({
  bit_rate: z.number().optional(),
  content_type: z.string().optional(),
  url: z.string().optional()
}).passthrough()

export const CreateComplianceJobRequestSchema = z.object({
  name: ComplianceJobNameSchema.optional(),
  resumable: z.boolean().optional(),
  type: z.enum(["tweets", "users"])
}).passthrough()

export const ContextAnnotationSchema = z.object({
  domain: ContextAnnotationDomainFieldsSchema,
  entity: ContextAnnotationEntityFieldsSchema
}).passthrough()

export const TweetWithheldSchema = z.object({
  copyright: z.boolean(),
  country_codes: z.array(CountryCodeSchema).min(1),
  scope: z.enum(["tweet", "user"]).optional()
}).passthrough()

export const UserWithheldSchema = z.object({
  country_codes: z.array(CountryCodeSchema).min(1),
  scope: z.enum(["user"]).optional()
}).passthrough()

export const CashtagEntitySchema = EntityIndicesInclusiveExclusiveSchema.and(CashtagFieldsSchema)

export const HashtagEntitySchema = EntityIndicesInclusiveExclusiveSchema.and(HashtagFieldsSchema)

export const ListFollowedRequestSchema = z.object({
  list_id: ListIdSchema
}).passthrough()

export const ListPinnedRequestSchema = z.object({
  list_id: ListIdSchema
}).passthrough()

export const DmMediaAttachmentSchema = z.object({
  media_id: MediaIdSchema
}).passthrough()

export const MediaSchema = z.object({
  height: MediaHeightSchema.optional(),
  media_key: MediaKeySchema.optional(),
  type: z.string(),
  width: MediaWidthSchema.optional()
}).passthrough()

export const PollOptionSchema = z.object({
  label: PollOptionLabelSchema,
  position: z.number(),
  votes: z.number()
}).passthrough()

export const PointSchema = z.object({
  coordinates: PositionSchema,
  type: z.enum(["Point"])
}).passthrough()

export const BlockUserMutationResponseSchema = z.object({
  data: z.object({
  blocking: z.boolean().optional()
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const BookmarkMutationResponseSchema = z.object({
  data: z.object({
  bookmarked: z.boolean().optional()
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const ClientDisconnectedProblemSchema = ProblemSchema

export const ClientForbiddenProblemSchema = ProblemSchema.and(z.object({
  reason: z.enum(["official-client-forbidden", "client-not-enrolled"]).optional(),
  registration_url: z.string().optional()
}).passthrough())

export const ConflictProblemSchema = ProblemSchema

export const ConnectionExceptionProblemSchema = ProblemSchema.and(z.object({
  connection_issue: z.enum(["TooManyConnections", "ProvisioningSubscription", "RuleConfigurationIssue", "RulesInvalidIssue"]).optional()
}).passthrough())

export const CreateDmEventResponseSchema = z.object({
  data: z.object({
  dm_conversation_id: DmConversationIdSchema,
  dm_event_id: DmEventIdSchema
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const DisallowedResourceProblemSchema = ProblemSchema.and(z.object({
  resource_id: z.string(),
  resource_type: z.enum(["user", "tweet", "media", "list", "space"]),
  section: z.enum(["data", "includes"])
}).passthrough())

export const DuplicateRuleProblemSchema = ProblemSchema.and(z.object({
  id: z.string().optional(),
  value: z.string().optional()
}).passthrough())

export const FieldUnauthorizedProblemSchema = ProblemSchema.and(z.object({
  field: z.string(),
  resource_type: z.enum(["user", "tweet", "media", "list", "space"]),
  section: z.enum(["data", "includes"])
}).passthrough())

export const GenericProblemSchema = ProblemSchema

export const InvalidRequestProblemSchema = ProblemSchema.and(z.object({
  errors: z.array(z.object({
  message: z.string().optional(),
  parameters: z.record(z.string(), z.array(z.string())).optional()
}).passthrough()).min(1).optional()
}).passthrough())

export const InvalidRuleProblemSchema = ProblemSchema

export const ListCreateResponseSchema = z.object({
  data: z.object({
  id: ListIdSchema,
  name: z.string()
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const ListDeleteResponseSchema = z.object({
  data: z.object({
  deleted: z.boolean().optional()
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const ListFollowedResponseSchema = z.object({
  data: z.object({
  following: z.boolean().optional()
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const ListMutateResponseSchema = z.object({
  data: z.object({
  is_member: z.boolean().optional()
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const ListPinnedResponseSchema = z.object({
  data: z.object({
  pinned: z.boolean().optional()
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const ListUnpinResponseSchema = z.object({
  data: z.object({
  pinned: z.boolean().optional()
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const ListUpdateResponseSchema = z.object({
  data: z.object({
  updated: z.boolean().optional()
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const MuteUserMutationResponseSchema = z.object({
  data: z.object({
  muting: z.boolean().optional()
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const NonCompliantRulesProblemSchema = ProblemSchema

export const Oauth1PermissionsProblemSchema = ProblemSchema

export const OperationalDisconnectProblemSchema = ProblemSchema.and(z.object({
  disconnect_type: z.enum(["OperationalDisconnect", "UpstreamOperationalDisconnect", "ForceDisconnect", "UpstreamUncleanDisconnect", "SlowReader", "InternalError", "ClientApplicationStateDegraded", "InvalidRules"]).optional()
}).passthrough())

export const ResourceNotFoundProblemSchema = ProblemSchema.and(z.object({
  parameter: z.string().min(1),
  resource_id: z.string(),
  resource_type: z.enum(["user", "tweet", "media", "list", "space"]),
  value: z.string()
}).passthrough())

export const ResourceUnauthorizedProblemSchema = ProblemSchema.and(z.object({
  parameter: z.string(),
  resource_id: z.string(),
  resource_type: z.enum(["user", "tweet", "media", "list", "space"]),
  section: z.enum(["data", "includes"]),
  value: z.string()
}).passthrough())

export const ResourceUnavailableProblemSchema = ProblemSchema.and(z.object({
  parameter: z.string().min(1),
  resource_id: z.string(),
  resource_type: z.enum(["user", "tweet", "media", "list", "space"])
}).passthrough())

export const RulesCapProblemSchema = ProblemSchema

export const TweetDeleteResponseSchema = z.object({
  data: z.object({
  deleted: z.boolean()
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const UnsupportedAuthenticationProblemSchema = ProblemSchema

export const UsageCapExceededProblemSchema = ProblemSchema.and(z.object({
  period: z.enum(["Daily", "Monthly"]).optional(),
  scope: z.enum(["Account", "Product"]).optional()
}).passthrough())

export const UsersFollowingCreateResponseSchema = z.object({
  data: z.object({
  following: z.boolean().optional(),
  pending_follow: z.boolean().optional()
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const UsersFollowingDeleteResponseSchema = z.object({
  data: z.object({
  following: z.boolean().optional()
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const UsersLikesCreateResponseSchema = z.object({
  data: z.object({
  liked: z.boolean().optional()
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const UsersLikesDeleteResponseSchema = z.object({
  data: z.object({
  liked: z.boolean().optional()
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const UsersRetweetsCreateResponseSchema = z.object({
  data: z.object({
  retweeted: z.boolean().optional()
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const UsersRetweetsDeleteResponseSchema = z.object({
  data: z.object({
  retweeted: z.boolean().optional()
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const DeleteRulesRequestSchema = z.object({
  delete: z.object({
  ids: z.array(RuleIdSchema).optional(),
  values: z.array(RuleValueSchema).optional()
}).passthrough()
}).passthrough()

export const RuleSchema = z.object({
  id: RuleIdSchema.optional(),
  tag: RuleTagSchema.optional(),
  value: RuleValueSchema
}).passthrough()

export const RuleNoIdSchema = z.object({
  tag: RuleTagSchema.optional(),
  value: RuleValueSchema
}).passthrough()

export const RulesResponseMetadataSchema = z.object({
  next_token: NextTokenSchema.optional(),
  result_count: z.number().optional(),
  sent: z.string(),
  summary: RulesRequestSummarySchema.optional()
}).passthrough()

export const TopicSchema = z.object({
  description: z.string().optional(),
  id: TopicIdSchema,
  name: z.string()
}).passthrough()

export const SearchCountSchema = z.object({
  end: EndSchema,
  start: StartSchema,
  tweet_count: TweetCountSchema
}).passthrough()

export const BookmarkAddRequestSchema = z.object({
  tweet_id: TweetIdSchema
}).passthrough()

export const TweetEditComplianceObjectSchemaSchema = z.object({
  edit_tweet_ids: z.array(TweetIdSchema).min(1),
  event_at: z.string(),
  initial_tweet_id: TweetIdSchema,
  tweet: z.object({
  id: TweetIdSchema
}).passthrough()
}).passthrough()

export const UsersLikesCreateRequestSchema = z.object({
  tweet_id: TweetIdSchema
}).passthrough()

export const UsersRetweetsCreateRequestSchema = z.object({
  tweet_id: TweetIdSchema
}).passthrough()

export const TweetCreateResponseSchema = z.object({
  data: z.object({
  id: TweetIdSchema,
  text: TweetTextSchema
}).passthrough().optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const ComplianceJobSchema = z.object({
  created_at: CreatedAtSchema,
  download_expires_at: DownloadExpirationSchema,
  download_url: DownloadUrlSchema,
  id: JobIdSchema,
  name: ComplianceJobNameSchema.optional(),
  status: ComplianceJobStatusSchema,
  type: ComplianceJobTypeSchema,
  upload_expires_at: UploadExpirationSchema,
  upload_url: UploadUrlSchema
}).passthrough()

export const UrlImageSchema = z.object({
  height: MediaHeightSchema.optional(),
  url: UrlSchema.optional(),
  width: MediaWidthSchema.optional()
}).passthrough()

export const BlockUserRequestSchema = z.object({
  target_user_id: UserIdSchema
}).passthrough()

export const DmEventSchema = z.object({
  attachments: z.object({
  card_ids: z.array(z.string()).min(1).optional(),
  media_keys: z.array(MediaKeySchema).min(1).optional()
}).passthrough().optional(),
  created_at: z.string().optional(),
  dm_conversation_id: DmConversationIdSchema.optional(),
  event_type: z.string(),
  id: DmEventIdSchema,
  participant_ids: z.array(UserIdSchema).min(1).optional(),
  referenced_tweets: z.array(z.object({
  id: TweetIdSchema
}).passthrough()).min(1).optional(),
  sender_id: UserIdSchema.optional(),
  text: z.string().optional()
}).passthrough()

export const DmParticipantsSchema = z.array(UserIdSchema).min(2).max(49)

export const ListSchema = z.object({
  created_at: z.string().optional(),
  description: z.string().optional(),
  follower_count: z.number().optional(),
  id: ListIdSchema,
  member_count: z.number().optional(),
  name: z.string(),
  owner_id: UserIdSchema.optional(),
  private: z.boolean().optional()
}).passthrough()

export const ListAddUserRequestSchema = z.object({
  user_id: UserIdSchema
}).passthrough()

export const MuteUserRequestSchema = z.object({
  target_user_id: UserIdSchema
}).passthrough()

export const SpaceSchema = z.object({
  created_at: z.string().optional(),
  creator_id: UserIdSchema.optional(),
  ended_at: z.string().optional(),
  host_ids: z.array(UserIdSchema).optional(),
  id: SpaceIdSchema,
  invited_user_ids: z.array(UserIdSchema).optional(),
  is_ticketed: z.boolean().optional(),
  lang: z.string().optional(),
  participant_count: z.number().optional(),
  scheduled_start: z.string().optional(),
  speaker_ids: z.array(UserIdSchema).optional(),
  started_at: z.string().optional(),
  state: z.enum(["live", "scheduled", "ended"]),
  subscriber_count: z.number().optional(),
  title: z.string().optional(),
  topics: z.array(z.object({
  description: z.string().optional(),
  id: z.string(),
  name: z.string()
}).passthrough()).optional(),
  updated_at: z.string().optional()
}).passthrough()

export const TweetComplianceSchemaSchema = z.object({
  event_at: z.string(),
  quote_tweet_id: TweetIdSchema.optional(),
  tweet: z.object({
  author_id: UserIdSchema,
  id: TweetIdSchema
}).passthrough()
}).passthrough()

export const TweetCreateRequestSchema = z.object({
  card_uri: z.string().optional(),
  direct_message_deep_link: z.string().optional(),
  for_super_followers_only: z.boolean().optional(),
  geo: z.object({
  place_id: z.string().optional()
}).passthrough().optional(),
  media: z.object({
  media_ids: z.array(MediaIdSchema).min(1).max(4),
  tagged_user_ids: z.array(UserIdSchema).min(0).max(10).optional()
}).passthrough().optional(),
  nullcast: z.boolean().optional(),
  poll: z.object({
  duration_minutes: z.number().min(5).max(10080),
  options: z.array(z.string().min(1).max(25)).min(2).max(4),
  reply_settings: z.enum(["following", "mentionedUsers"]).optional()
}).passthrough().optional(),
  quote_tweet_id: TweetIdSchema.optional(),
  reply: z.object({
  exclude_reply_user_ids: z.array(UserIdSchema).optional(),
  in_reply_to_tweet_id: TweetIdSchema
}).passthrough().optional(),
  reply_settings: z.enum(["following", "mentionedUsers"]).optional(),
  text: TweetTextSchema.optional()
}).passthrough()

export const TweetNoticeSchema = z.object({
  application: z.string(),
  details: z.string().optional(),
  event_at: z.string(),
  event_type: z.string(),
  extended_details_url: z.string().optional(),
  label_title: z.string().optional(),
  tweet: z.object({
  author_id: UserIdSchema,
  id: TweetIdSchema
}).passthrough()
}).passthrough()

export const TweetTakedownComplianceSchemaSchema = z.object({
  event_at: z.string(),
  quote_tweet_id: TweetIdSchema.optional(),
  tweet: z.object({
  author_id: UserIdSchema,
  id: TweetIdSchema
}).passthrough(),
  withheld_in_countries: z.array(CountryCodeSchema).min(1)
}).passthrough()

export const TweetUnviewableSchema = z.object({
  application: z.string(),
  event_at: z.string(),
  tweet: z.object({
  author_id: UserIdSchema,
  id: TweetIdSchema
}).passthrough()
}).passthrough()

export const UserComplianceSchemaSchema = z.object({
  event_at: z.string(),
  user: z.object({
  id: UserIdSchema
}).passthrough()
}).passthrough()

export const UserProfileModificationObjectSchemaSchema = z.object({
  event_at: z.string(),
  new_value: z.string(),
  profile_field: z.string(),
  user: z.object({
  id: UserIdSchema
}).passthrough()
}).passthrough()

export const UserScrubGeoObjectSchemaSchema = z.object({
  event_at: z.string(),
  up_to_tweet_id: TweetIdSchema,
  user: z.object({
  id: UserIdSchema
}).passthrough()
}).passthrough()

export const UserTakedownComplianceSchemaSchema = z.object({
  event_at: z.string(),
  user: z.object({
  id: UserIdSchema
}).passthrough(),
  withheld_in_countries: z.array(CountryCodeSchema).min(1)
}).passthrough()

export const UsersFollowingCreateRequestSchema = z.object({
  target_user_id: UserIdSchema
}).passthrough()

export const MentionFieldsSchema = z.object({
  id: UserIdSchema.optional(),
  username: UserNameSchema
}).passthrough()

export const VariantsSchema = z.array(VariantSchema)

export const DmAttachmentsSchema = z.array(DmMediaAttachmentSchema)

export const PhotoSchema = MediaSchema.and(z.object({
  alt_text: z.string().optional(),
  url: z.string().optional()
}).passthrough())

export const PollSchema = z.object({
  duration_minutes: z.number().min(5).max(10080).optional(),
  end_datetime: z.string().optional(),
  id: PollIdSchema,
  options: z.array(PollOptionSchema).min(2).max(4),
  voting_status: z.enum(["open", "closed"]).optional()
}).passthrough()

export const GeoSchema = z.object({
  bbox: z.array(z.number().min(-180).max(180)).min(4).max(4),
  geometry: PointSchema.optional(),
  properties: z.record(z.string(), z.unknown()),
  type: z.enum(["Feature"])
}).passthrough()

export const AddRulesRequestSchema = z.object({
  add: z.array(RuleNoIdSchema)
}).passthrough()

export const AddOrDeleteRulesResponseSchema = z.object({
  data: z.array(RuleSchema).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  meta: RulesResponseMetadataSchema
}).passthrough()

export const RulesLookupResponseSchema = z.object({
  data: z.array(RuleSchema).optional(),
  meta: RulesResponseMetadataSchema
}).passthrough()

export const Get2TweetsCountsAllResponseSchema = z.object({
  data: z.array(SearchCountSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  meta: z.object({
  newest_id: NewestIdSchema.optional(),
  next_token: NextTokenSchema.optional(),
  oldest_id: OldestIdSchema.optional(),
  total_tweet_count: AggregateSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2TweetsCountsRecentResponseSchema = z.object({
  data: z.array(SearchCountSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  meta: z.object({
  newest_id: NewestIdSchema.optional(),
  next_token: NextTokenSchema.optional(),
  oldest_id: OldestIdSchema.optional(),
  total_tweet_count: AggregateSchema.optional()
}).passthrough().optional()
}).passthrough()

export const TweetEditComplianceSchemaSchema = z.object({
  tweet_edit: TweetEditComplianceObjectSchemaSchema
}).passthrough()

export const CreateComplianceJobResponseSchema = z.object({
  data: ComplianceJobSchema.optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const Get2ComplianceJobsIdResponseSchema = z.object({
  data: ComplianceJobSchema.optional(),
  errors: z.array(ProblemSchema).min(1).optional()
}).passthrough()

export const Get2ComplianceJobsResponseSchema = z.object({
  data: z.array(ComplianceJobSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  meta: z.object({
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const UrlFieldsSchema = z.object({
  description: z.string().optional(),
  display_url: z.string().optional(),
  expanded_url: UrlSchema.optional(),
  images: z.array(UrlImageSchema).min(1).optional(),
  media_key: MediaKeySchema.optional(),
  status: HttpStatusCodeSchema.optional(),
  title: z.string().optional(),
  unwound_url: z.string().optional(),
  url: UrlSchema
}).passthrough()

export const TweetDeleteComplianceSchemaSchema = z.object({
  delete: TweetComplianceSchemaSchema
}).passthrough()

export const TweetDropComplianceSchemaSchema = z.object({
  drop: TweetComplianceSchemaSchema
}).passthrough()

export const TweetUndropComplianceSchemaSchema = z.object({
  undrop: TweetComplianceSchemaSchema
}).passthrough()

export const TweetNoticeSchemaSchema = z.object({
  public_tweet_notice: TweetNoticeSchema
}).passthrough()

export const TweetWithheldComplianceSchemaSchema = z.object({
  withheld: TweetTakedownComplianceSchemaSchema
}).passthrough()

export const TweetUnviewableSchemaSchema = z.object({
  public_tweet_unviewable: TweetUnviewableSchema
}).passthrough()

export const UserDeleteComplianceSchemaSchema = z.object({
  user_delete: UserComplianceSchemaSchema
}).passthrough()

export const UserProtectComplianceSchemaSchema = z.object({
  user_protect: UserComplianceSchemaSchema
}).passthrough()

export const UserSuspendComplianceSchemaSchema = z.object({
  user_suspend: UserComplianceSchemaSchema
}).passthrough()

export const UserUndeleteComplianceSchemaSchema = z.object({
  user_undelete: UserComplianceSchemaSchema
}).passthrough()

export const UserUnprotectComplianceSchemaSchema = z.object({
  user_unprotect: UserComplianceSchemaSchema
}).passthrough()

export const UserUnsuspendComplianceSchemaSchema = z.object({
  user_unsuspend: UserComplianceSchemaSchema
}).passthrough()

export const UserProfileModificationComplianceSchemaSchema = z.object({
  user_profile_modification: UserProfileModificationObjectSchemaSchema
}).passthrough()

export const UserScrubGeoSchemaSchema = z.object({
  scrub_geo: UserScrubGeoObjectSchemaSchema
}).passthrough()

export const UserWithheldComplianceSchemaSchema = z.object({
  user_withheld: UserTakedownComplianceSchemaSchema
}).passthrough()

export const MentionEntitySchema = EntityIndicesInclusiveExclusiveSchema.and(MentionFieldsSchema)

export const AnimatedGifSchema = MediaSchema.and(z.object({
  preview_image_url: z.string().optional(),
  variants: VariantsSchema.optional()
}).passthrough())

export const VideoSchema = MediaSchema.and(z.object({
  duration_ms: z.number().optional(),
  non_public_metrics: z.object({
  playback_0_count: z.number().optional(),
  playback_100_count: z.number().optional(),
  playback_25_count: z.number().optional(),
  playback_50_count: z.number().optional(),
  playback_75_count: z.number().optional()
}).passthrough().optional(),
  organic_metrics: z.object({
  playback_0_count: z.number().optional(),
  playback_100_count: z.number().optional(),
  playback_25_count: z.number().optional(),
  playback_50_count: z.number().optional(),
  playback_75_count: z.number().optional(),
  view_count: z.number().optional()
}).passthrough().optional(),
  preview_image_url: z.string().optional(),
  promoted_metrics: z.object({
  playback_0_count: z.number().optional(),
  playback_100_count: z.number().optional(),
  playback_25_count: z.number().optional(),
  playback_50_count: z.number().optional(),
  playback_75_count: z.number().optional(),
  view_count: z.number().optional()
}).passthrough().optional(),
  public_metrics: z.object({
  view_count: z.number().optional()
}).passthrough().optional(),
  variants: VariantsSchema.optional()
}).passthrough())

export const CreateAttachmentsMessageRequestSchema = z.object({
  attachments: DmAttachmentsSchema,
  text: z.string().min(1).optional()
}).passthrough()

export const CreateTextMessageRequestSchema = z.object({
  attachments: DmAttachmentsSchema.optional(),
  text: z.string().min(1)
}).passthrough()

export const PlaceSchema = z.object({
  contained_within: z.array(PlaceIdSchema).min(1).optional(),
  country: z.string().optional(),
  country_code: CountryCodeSchema.optional(),
  full_name: z.string(),
  geo: GeoSchema.optional(),
  id: PlaceIdSchema,
  name: z.string().optional(),
  place_type: PlaceTypeSchema.optional()
}).passthrough()

export const AddOrDeleteRulesRequestSchema = z.union([AddRulesRequestSchema, DeleteRulesRequestSchema])

export const UrlEntitySchema = EntityIndicesInclusiveExclusiveSchema.and(UrlFieldsSchema)

export const TweetComplianceDataSchema = z.union([TweetDeleteComplianceSchemaSchema, TweetWithheldComplianceSchemaSchema, TweetDropComplianceSchemaSchema, TweetUndropComplianceSchemaSchema, TweetEditComplianceSchemaSchema])

export const TweetLabelDataSchema = z.union([TweetNoticeSchemaSchema, TweetUnviewableSchemaSchema])

export const UserComplianceDataSchema = z.union([UserProtectComplianceSchemaSchema, UserUnprotectComplianceSchemaSchema, UserDeleteComplianceSchemaSchema, UserUndeleteComplianceSchemaSchema, UserSuspendComplianceSchemaSchema, UserUnsuspendComplianceSchemaSchema, UserWithheldComplianceSchemaSchema, UserScrubGeoSchemaSchema, UserProfileModificationComplianceSchemaSchema])

export const CreateMessageRequestSchema = z.union([CreateTextMessageRequestSchema, CreateAttachmentsMessageRequestSchema])

export const FullTextEntitiesSchema = z.object({
  annotations: z.array(EntityIndicesInclusiveInclusiveSchema.and(z.object({
  normalized_text: z.string().optional(),
  probability: z.number().min(0).max(1).optional(),
  type: z.string().optional()
}).passthrough())).min(1).optional(),
  cashtags: z.array(CashtagEntitySchema).min(1).optional(),
  hashtags: z.array(HashtagEntitySchema).min(1).optional(),
  mentions: z.array(MentionEntitySchema).min(1).optional(),
  urls: z.array(UrlEntitySchema).min(1).optional()
}).passthrough()

export const TweetComplianceStreamResponseSchema = z.union([z.object({
  data: TweetComplianceDataSchema
}).passthrough(), z.object({
  errors: z.array(ProblemSchema).min(1)
}).passthrough()])

export const TweetLabelStreamResponseSchema = z.union([z.object({
  data: TweetLabelDataSchema
}).passthrough(), z.object({
  errors: z.array(ProblemSchema).min(1)
}).passthrough()])

export const UserComplianceStreamResponseSchema = z.union([z.object({
  data: UserComplianceDataSchema
}).passthrough(), z.object({
  errors: z.array(ProblemSchema).min(1)
}).passthrough()])

export const CreateDmConversationRequestSchema = z.object({
  conversation_type: z.enum(["Group"]),
  message: CreateMessageRequestSchema,
  participant_ids: DmParticipantsSchema
}).passthrough()

export const TweetSchema = z.object({
  attachments: z.object({
  media_keys: z.array(MediaKeySchema).min(1).optional(),
  poll_ids: z.array(PollIdSchema).min(1).optional()
}).passthrough().optional(),
  author_id: UserIdSchema.optional(),
  context_annotations: z.array(ContextAnnotationSchema).min(1).optional(),
  conversation_id: TweetIdSchema.optional(),
  created_at: z.string().optional(),
  edit_controls: z.object({
  editable_until: z.string(),
  edits_remaining: z.number(),
  is_edit_eligible: z.boolean()
}).passthrough().optional(),
  edit_history_tweet_ids: z.array(TweetIdSchema).min(1),
  entities: FullTextEntitiesSchema.optional(),
  geo: z.object({
  coordinates: PointSchema.optional(),
  place_id: PlaceIdSchema.optional()
}).passthrough().optional(),
  id: TweetIdSchema,
  in_reply_to_user_id: UserIdSchema.optional(),
  lang: z.string().optional(),
  non_public_metrics: z.object({
  impression_count: z.number().optional()
}).passthrough().optional(),
  organic_metrics: z.object({
  impression_count: z.number(),
  like_count: z.number(),
  reply_count: z.number(),
  retweet_count: z.number()
}).passthrough().optional(),
  possibly_sensitive: z.boolean().optional(),
  promoted_metrics: z.object({
  impression_count: z.number().optional(),
  like_count: z.number().optional(),
  reply_count: z.number().optional(),
  retweet_count: z.number().optional()
}).passthrough().optional(),
  public_metrics: z.object({
  impression_count: z.number(),
  like_count: z.number(),
  quote_count: z.number().optional(),
  reply_count: z.number(),
  retweet_count: z.number()
}).passthrough().optional(),
  referenced_tweets: z.array(z.object({
  id: TweetIdSchema,
  type: z.enum(["retweeted", "quoted", "replied_to"])
}).passthrough()).min(1).optional(),
  reply_settings: ReplySettingsSchema.optional(),
  source: z.string().optional(),
  text: TweetTextSchema,
  withheld: TweetWithheldSchema.optional()
}).passthrough()

export const UserSchema = z.object({
  created_at: z.string().optional(),
  description: z.string().optional(),
  entities: z.object({
  description: FullTextEntitiesSchema.optional(),
  url: z.object({
  urls: z.array(UrlEntitySchema).min(1).optional()
}).passthrough().optional()
}).passthrough().optional(),
  id: UserIdSchema,
  location: z.string().optional(),
  name: z.string(),
  pinned_tweet_id: TweetIdSchema.optional(),
  profile_image_url: z.string().optional(),
  protected: z.boolean().optional(),
  public_metrics: z.object({
  followers_count: z.number(),
  following_count: z.number(),
  listed_count: z.number(),
  tweet_count: z.number()
}).passthrough().optional(),
  url: z.string().optional(),
  username: UserNameSchema,
  verified: z.boolean().optional(),
  verified_type: z.string().optional(),
  withheld: UserWithheldSchema.optional()
}).passthrough()

export const ExpansionsSchema = z.object({
  media: z.array(MediaSchema).min(1).optional(),
  places: z.array(PlaceSchema).min(1).optional(),
  polls: z.array(PollSchema).min(1).optional(),
  topics: z.array(TopicSchema).min(1).optional(),
  tweets: z.array(TweetSchema).min(1).optional(),
  users: z.array(UserSchema).min(1).optional()
}).passthrough()

export const FilteredStreamingTweetResponseSchema = z.object({
  data: TweetSchema.optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  matching_rules: z.array(z.object({
  id: RuleIdSchema,
  tag: RuleTagSchema.optional()
}).passthrough()).optional()
}).passthrough()

export const Get2DmConversationsIdDmEventsResponseSchema = z.object({
  data: z.array(DmEventSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2DmConversationsWithParticipantIdDmEventsResponseSchema = z.object({
  data: z.array(DmEventSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2DmEventsResponseSchema = z.object({
  data: z.array(DmEventSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2ListsIdFollowersResponseSchema = z.object({
  data: z.array(UserSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2ListsIdMembersResponseSchema = z.object({
  data: z.array(UserSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2ListsIdResponseSchema = z.object({
  data: ListSchema.optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional()
}).passthrough()

export const Get2ListsIdTweetsResponseSchema = z.object({
  data: z.array(TweetSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2SpacesByCreatorIdsResponseSchema = z.object({
  data: z.array(SpaceSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2SpacesIdBuyersResponseSchema = z.object({
  data: z.array(UserSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2SpacesIdResponseSchema = z.object({
  data: SpaceSchema.optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional()
}).passthrough()

export const Get2SpacesIdTweetsResponseSchema = z.object({
  data: z.array(TweetSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2SpacesResponseSchema = z.object({
  data: z.array(SpaceSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional()
}).passthrough()

export const Get2SpacesSearchResponseSchema = z.object({
  data: z.array(SpaceSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2TweetsFirehoseStreamResponseSchema = z.object({
  data: TweetSchema.optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional()
}).passthrough()

export const Get2TweetsIdLikingUsersResponseSchema = z.object({
  data: z.array(UserSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2TweetsIdQuoteTweetsResponseSchema = z.object({
  data: z.array(TweetSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2TweetsIdResponseSchema = z.object({
  data: TweetSchema.optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional()
}).passthrough()

export const Get2TweetsIdRetweetedByResponseSchema = z.object({
  data: z.array(UserSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2TweetsResponseSchema = z.object({
  data: z.array(TweetSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional()
}).passthrough()

export const Get2TweetsSample10StreamResponseSchema = z.object({
  data: TweetSchema.optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional()
}).passthrough()

export const Get2TweetsSampleStreamResponseSchema = z.object({
  data: TweetSchema.optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional()
}).passthrough()

export const Get2TweetsSearchAllResponseSchema = z.object({
  data: z.array(TweetSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  newest_id: NewestIdSchema.optional(),
  next_token: NextTokenSchema.optional(),
  oldest_id: OldestIdSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2TweetsSearchRecentResponseSchema = z.object({
  data: z.array(TweetSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  newest_id: NewestIdSchema.optional(),
  next_token: NextTokenSchema.optional(),
  oldest_id: OldestIdSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2TweetsSearchStreamResponseSchema = z.object({
  data: TweetSchema.optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional()
}).passthrough()

export const Get2UsersByResponseSchema = z.object({
  data: z.array(UserSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional()
}).passthrough()

export const Get2UsersByUsernameUsernameResponseSchema = z.object({
  data: UserSchema.optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional()
}).passthrough()

export const Get2UsersIdBlockingResponseSchema = z.object({
  data: z.array(UserSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2UsersIdBookmarksResponseSchema = z.object({
  data: z.array(TweetSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2UsersIdFollowedListsResponseSchema = z.object({
  data: z.array(ListSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2UsersIdFollowersResponseSchema = z.object({
  data: z.array(UserSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2UsersIdFollowingResponseSchema = z.object({
  data: z.array(UserSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2UsersIdLikedTweetsResponseSchema = z.object({
  data: z.array(TweetSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2UsersIdListMembershipsResponseSchema = z.object({
  data: z.array(ListSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2UsersIdMentionsResponseSchema = z.object({
  data: z.array(TweetSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  newest_id: NewestIdSchema.optional(),
  next_token: NextTokenSchema.optional(),
  oldest_id: OldestIdSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2UsersIdMutingResponseSchema = z.object({
  data: z.array(UserSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2UsersIdOwnedListsResponseSchema = z.object({
  data: z.array(ListSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  next_token: NextTokenSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2UsersIdPinnedListsResponseSchema = z.object({
  data: z.array(ListSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2UsersIdResponseSchema = z.object({
  data: UserSchema.optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional()
}).passthrough()

export const Get2UsersIdTimelinesReverseChronologicalResponseSchema = z.object({
  data: z.array(TweetSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  newest_id: NewestIdSchema.optional(),
  next_token: NextTokenSchema.optional(),
  oldest_id: OldestIdSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2UsersIdTweetsResponseSchema = z.object({
  data: z.array(TweetSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional(),
  meta: z.object({
  newest_id: NewestIdSchema.optional(),
  next_token: NextTokenSchema.optional(),
  oldest_id: OldestIdSchema.optional(),
  previous_token: PreviousTokenSchema.optional(),
  result_count: ResultCountSchema.optional()
}).passthrough().optional()
}).passthrough()

export const Get2UsersMeResponseSchema = z.object({
  data: UserSchema.optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional()
}).passthrough()

export const Get2UsersResponseSchema = z.object({
  data: z.array(UserSchema).min(1).optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional()
}).passthrough()

export const StreamingTweetResponseSchema = z.object({
  data: TweetSchema.optional(),
  errors: z.array(ProblemSchema).min(1).optional(),
  includes: ExpansionsSchema.optional()
}).passthrough()
