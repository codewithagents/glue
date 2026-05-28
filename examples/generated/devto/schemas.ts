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

export const ArticleFlareTagSchema = z.object({
  name: z.string().optional(),
  bg_color_hex: z.string().optional(),
  text_color_hex: z.string().optional()
}).passthrough()

export const VideoArticleSchema = z.object({
  type_of: z.string().optional(),
  id: z.number().optional(),
  path: z.string().optional(),
  cloudinary_video_url: z.string().optional(),
  title: z.string().optional(),
  user_id: z.number().optional(),
  video_duration_in_minutes: z.string().optional(),
  video_source_url: z.string().optional(),
  user: z.object({
  name: z.string().optional()
}).passthrough().optional()
}).passthrough()

export const ArticleSchema = z.object({
  article: z.object({
  title: z.string().optional(),
  body_markdown: z.string().optional(),
  published: z.boolean().optional(),
  series: z.string().optional(),
  main_image: z.string().optional(),
  canonical_url: z.string().optional(),
  description: z.string().optional(),
  tags: z.string().optional(),
  organization_id: z.number().optional()
}).passthrough().optional()
}).passthrough()

export const OrganizationSchema = z.object({
  type_of: z.string().optional(),
  username: z.string().optional(),
  name: z.string().optional(),
  summary: z.string().optional(),
  twitter_username: z.string().optional(),
  github_username: z.string().optional(),
  url: z.string().optional(),
  location: z.string().optional(),
  joined_at: z.string().optional(),
  tech_stack: z.string().optional(),
  tag_line: z.string().optional(),
  story: z.string().optional()
}).passthrough()

export const FollowedTagSchema = z.object({
  id: z.number(),
  name: z.string(),
  points: z.number()
}).passthrough()

export const TagSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  bg_color_hex: z.string().optional(),
  text_color_hex: z.string().optional()
}).passthrough()

export const PageSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  body_markdown: z.string().optional(),
  body_json: z.string().optional(),
  is_top_level_path: z.boolean().optional(),
  social_image: z.record(z.string(), z.unknown()).optional(),
  template: z.enum(["contained", "full_within_layout", "nav_bar_included", "json", "css", "txt"])
}).passthrough()

export const ProfileImageSchema = z.object({
  type_of: z.string().optional(),
  image_of: z.string().optional(),
  profile_image: z.string().optional(),
  profile_image_90: z.string().optional()
}).passthrough()

export const SharedUserSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  twitter_username: z.string().optional(),
  github_username: z.string().optional(),
  website_url: z.string().url().optional(),
  profile_image: z.string().optional(),
  profile_image_90: z.string().optional()
}).passthrough()

export const SharedOrganizationSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  slug: z.string().optional(),
  profile_image: z.string().url().optional(),
  profile_image_90: z.string().url().optional()
}).passthrough()

export const UserSchema = z.object({
  type_of: z.string().optional(),
  id: z.number().optional(),
  username: z.string().optional(),
  name: z.string().optional(),
  summary: z.string().optional(),
  twitter_username: z.string().optional(),
  github_username: z.string().optional(),
  website_url: z.string().optional(),
  location: z.string().optional(),
  joined_at: z.string().optional(),
  profile_image: z.string().optional()
}).passthrough()

export const ExtendedUserSchema = z.object({
  type_of: z.string().optional(),
  id: z.number().optional(),
  username: z.string().optional(),
  name: z.string().optional(),
  summary: z.string().optional(),
  twitter_username: z.string().optional(),
  github_username: z.string().optional(),
  email: z.string().optional(),
  website_url: z.string().optional(),
  location: z.string().optional(),
  joined_at: z.string().optional(),
  profile_image: z.string().optional(),
  badge_ids: z.array(z.number()).optional()
}).passthrough()

export const MyUserSchema = z.object({
  type_of: z.string().optional(),
  id: z.number().optional(),
  username: z.string().optional(),
  name: z.string().optional(),
  summary: z.string().optional(),
  twitter_username: z.string().optional(),
  github_username: z.string().optional(),
  email: z.string().optional(),
  website_url: z.string().optional(),
  location: z.string().optional(),
  joined_at: z.string().optional(),
  profile_image: z.string().optional(),
  badge_ids: z.array(z.number()).optional(),
  followers_count: z.number().optional()
}).passthrough()

export const SharedPodcastSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  image_url: z.string().url().optional()
}).passthrough()

export const CommentSchema = z.object({
  type_of: z.string().optional(),
  id_code: z.string().optional(),
  created_at: z.string().optional(),
  image_url: z.string().url().optional()
}).passthrough()

export const UserInviteParamSchema = z.object({
  email: z.string().optional(),
  name: z.string().optional()
}).passthrough()

export const BillboardSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  body_markdown: z.string(),
  approved: z.boolean().optional(),
  published: z.boolean().optional(),
  expires_at: z.string().optional(),
  organization_id: z.number().optional(),
  creator_id: z.number().optional(),
  placement_area: z.enum(["sidebar_left", "sidebar_left_2", "sidebar_right", "sidebar_right_second", "sidebar_right_third", "feed_first", "feed_second", "feed_third", "home_hero", "footer", "page_fixed_bottom", "post_fixed_bottom", "post_body_bottom", "post_sidebar", "post_comments", "post_comments_mid", "digest_first", "digest_second"]),
  tag_list: z.string().optional(),
  exclude_article_ids: z.string().optional(),
  audience_segment_id: z.number().optional(),
  audience_segment_type: z.enum(["manual", "trusted", "posted", "no_posts_yet", "dark_theme", "light_theme", "no_experience", "experience1", "experience2", "experience3", "experience4", "experience5"]).optional(),
  target_geolocations: z.array(z.string()).optional(),
  display_to: z.enum(["all", "logged_in", "logged_out"]).optional(),
  type_of: z.enum(["in_house", "community", "external"]).optional()
}).passthrough()

export const SegmentSchema = z.object({
  id: z.number().optional(),
  type_of: z.enum(["manual"]).optional(),
  user_count: z.number().optional()
}).passthrough()

export const SegmentUserIdsSchema = z.object({
  user_ids: z.array(z.number()).max(10000).optional()
}).passthrough()

export const AgentSessionIndexSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  tool_name: z.string(),
  total_messages: z.number(),
  published: z.boolean(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  url: z.string().url()
}).passthrough()

export const AgentSessionShowSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  tool_name: z.string(),
  total_messages: z.number(),
  curated_count: z.number(),
  published: z.boolean(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  messages: z.array(z.record(z.string(), z.unknown())),
  slices: z.array(z.record(z.string(), z.unknown())),
  created_at: z.string(),
  updated_at: z.string(),
  url: z.string().url()
}).passthrough()

export const PollOptionSchema = z.object({
  type_of: z.enum(["poll_option"]),
  id: z.number(),
  markdown: z.string(),
  processed_html: z.string(),
  position: z.number(),
  poll_votes_count: z.number(),
  supplementary_text: z.string().optional()
}).passthrough()

export const SurveySchema = z.object({
  type_of: z.enum(["survey"]),
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  survey_type_of: z.enum(["community_pulse", "industry", "fun"]),
  active: z.boolean().optional(),
  display_title: z.boolean(),
  allow_resubmission: z.boolean(),
  created_at: z.string(),
  updated_at: z.string()
}).passthrough()

export const PollVoteSchema = z.object({
  type_of: z.enum(["poll_vote"]),
  id: z.number(),
  poll_id: z.number(),
  poll_option_id: z.number(),
  user_id: z.number(),
  user_email: z.string().email(),
  session_start: z.number(),
  created_at: z.string()
}).passthrough()

export const PollTextResponseSchema = z.object({
  type_of: z.enum(["poll_text_response"]),
  id: z.number(),
  poll_id: z.number(),
  user_id: z.number(),
  user_email: z.string().email(),
  text_content: z.string(),
  session_start: z.number(),
  created_at: z.string()
}).passthrough()

export const ArticleIndexSchema = z.object({
  type_of: z.string(),
  id: z.number(),
  title: z.string(),
  description: z.string(),
  cover_image: z.string().url(),
  readable_publish_date: z.string(),
  social_image: z.string().url(),
  tag_list: z.array(z.string()),
  tags: z.string(),
  slug: z.string(),
  path: z.string(),
  url: z.string().url(),
  canonical_url: z.string().url(),
  positive_reactions_count: z.number(),
  public_reactions_count: z.number(),
  created_at: z.string(),
  edited_at: z.string(),
  crossposted_at: z.string(),
  published_at: z.string(),
  last_comment_at: z.string(),
  published_timestamp: z.string(),
  reading_time_minutes: z.number(),
  user: SharedUserSchema,
  flare_tag: ArticleFlareTagSchema.optional(),
  organization: SharedOrganizationSchema.optional()
}).passthrough()

export const PodcastEpisodeIndexSchema = z.object({
  type_of: z.string(),
  id: z.number(),
  class_name: z.string(),
  path: z.string(),
  title: z.string(),
  image_url: z.string().url(),
  podcast: SharedPodcastSchema
}).passthrough()

export const PollSchema = z.object({
  type_of: z.enum(["poll"]),
  id: z.number(),
  prompt_markdown: z.string(),
  prompt_html: z.string(),
  poll_type_of: z.enum(["single_choice", "multiple_choice", "scale", "text_input"]),
  position: z.number(),
  poll_votes_count: z.number(),
  poll_skips_count: z.number(),
  poll_options_count: z.number(),
  scale_min: z.number().optional(),
  scale_max: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  poll_options: z.array(PollOptionSchema)
}).passthrough()

export const SurveyWithPollsSchema = SurveySchema.and(z.object({
  polls: z.array(PollSchema)
}).passthrough())
