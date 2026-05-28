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

export const TrackRestrictionObjectSchema = z.object({
  reason: z.string().optional()
}).passthrough()

export const AlbumRestrictionObjectSchema = z.object({
  reason: z.enum(["market", "product", "explicit"]).optional()
}).passthrough()

export const EpisodeRestrictionObjectSchema = z.object({
  reason: z.string().optional()
}).passthrough()

export const ChapterRestrictionObjectSchema = z.object({
  reason: z.string().optional()
}).passthrough()

export const DisallowsObjectSchema = z.object({
  interrupting_playback: z.boolean().optional(),
  pausing: z.boolean().optional(),
  resuming: z.boolean().optional(),
  seeking: z.boolean().optional(),
  skipping_next: z.boolean().optional(),
  skipping_prev: z.boolean().optional(),
  toggling_repeat_context: z.boolean().optional(),
  toggling_shuffle: z.boolean().optional(),
  toggling_repeat_track: z.boolean().optional(),
  transferring_playback: z.boolean().optional()
}).passthrough()

export const ErrorObjectSchema = z.object({
  status: z.number().min(400).max(599),
  message: z.string()
}).passthrough()

export const TimeIntervalObjectSchema = z.object({
  start: z.number().optional(),
  duration: z.number().optional(),
  confidence: z.number().min(0).max(1).optional()
}).passthrough()

export const SegmentObjectSchema = z.object({
  start: z.number().optional(),
  duration: z.number().optional(),
  confidence: z.number().min(0).max(1).optional(),
  loudness_start: z.number().optional(),
  loudness_max: z.number().optional(),
  loudness_max_time: z.number().optional(),
  loudness_end: z.number().optional(),
  pitches: z.array(z.number().min(0).max(1)).optional(),
  timbre: z.array(z.number()).optional()
}).passthrough()

export const TimeSignatureSchema = z.number().min(3).max(7)

export const TempoSchema = z.number()

export const LoudnessSchema = z.number()

export const KeySchema = z.number().min(-1).max(11)

export const ModeSchema = z.number()

export const DeviceObjectSchema = z.object({
  id: z.string().optional(),
  is_active: z.boolean().optional(),
  is_private_session: z.boolean().optional(),
  is_restricted: z.boolean().optional(),
  name: z.string().optional(),
  type: z.string().optional(),
  volume_percent: z.number().min(0).max(100).optional(),
  supports_volume: z.boolean().optional()
}).passthrough()

export const CursorObjectSchema = z.object({
  after: z.string().optional(),
  before: z.string().optional()
}).passthrough()

export const PagingObjectSchema = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string(),
  offset: z.number(),
  previous: z.string(),
  total: z.number()
}).passthrough()

export const RecommendationSeedObjectSchema = z.object({
  afterFilteringSize: z.number().optional(),
  afterRelinkingSize: z.number().optional(),
  href: z.string().optional(),
  id: z.string().optional(),
  initialPoolSize: z.number().optional(),
  type: z.string().optional()
}).passthrough()

export const PlaylistTracksRefObjectSchema = z.object({
  href: z.string().optional(),
  total: z.number().optional()
}).passthrough()

export const ResumePointObjectSchema = z.object({
  fully_played: z.boolean().optional(),
  resume_position_ms: z.number().optional()
}).passthrough()

export const CopyrightObjectSchema = z.object({
  text: z.string().optional(),
  type: z.string().optional()
}).passthrough()

export const AuthorObjectSchema = z.object({
  name: z.string().optional()
}).passthrough()

export const NarratorObjectSchema = z.object({
  name: z.string().optional()
}).passthrough()

export const ExternalIdObjectSchema = z.object({
  isrc: z.string().optional(),
  ean: z.string().optional(),
  upc: z.string().optional()
}).passthrough()

export const ExternalUrlObjectSchema = z.object({
  spotify: z.string().optional()
}).passthrough()

export const FollowersObjectSchema = z.object({
  href: z.string().optional(),
  total: z.number().optional()
}).passthrough()

export const ImageObjectSchema = z.object({
  url: z.string(),
  height: z.number(),
  width: z.number()
}).passthrough()

export const ExplicitContentSettingsObjectSchema = z.object({
  filter_enabled: z.boolean().optional(),
  filter_locked: z.boolean().optional()
}).passthrough()

export const SectionObjectSchema = z.object({
  start: z.number().optional(),
  duration: z.number().optional(),
  confidence: z.number().min(0).max(1).optional(),
  loudness: z.number().optional(),
  tempo: z.number().optional(),
  tempo_confidence: z.number().min(0).max(1).optional(),
  key: z.number().optional(),
  key_confidence: z.number().min(0).max(1).optional(),
  mode: z.union([z.literal(-1), z.literal(0), z.literal(1)]).optional(),
  mode_confidence: z.number().min(0).max(1).optional(),
  time_signature: TimeSignatureSchema.optional(),
  time_signature_confidence: z.number().min(0).max(1).optional()
}).passthrough()

export const AudioFeaturesObjectSchema = z.object({
  acousticness: z.number().min(0).max(1).optional(),
  analysis_url: z.string().optional(),
  danceability: z.number().optional(),
  duration_ms: z.number().optional(),
  energy: z.number().optional(),
  id: z.string().optional(),
  instrumentalness: z.number().optional(),
  key: KeySchema.optional(),
  liveness: z.number().optional(),
  loudness: LoudnessSchema.optional(),
  mode: ModeSchema.optional(),
  speechiness: z.number().optional(),
  tempo: TempoSchema.optional(),
  time_signature: TimeSignatureSchema.optional(),
  track_href: z.string().optional(),
  type: z.enum(["audio_features"]).optional(),
  uri: z.string().optional(),
  valence: z.number().min(0).max(1).optional()
}).passthrough()

export const CursorPagingObjectSchema = z.object({
  href: z.string().optional(),
  limit: z.number().optional(),
  next: z.string().optional(),
  cursors: CursorObjectSchema.optional(),
  total: z.number().optional()
}).passthrough()

export const LinkedTrackObjectSchema = z.object({
  external_urls: ExternalUrlObjectSchema.optional(),
  href: z.string().optional(),
  id: z.string().optional(),
  type: z.string().optional(),
  uri: z.string().optional()
}).passthrough()

export const SimplifiedArtistObjectSchema = z.object({
  external_urls: ExternalUrlObjectSchema.optional(),
  href: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  type: z.enum(["artist"]).optional(),
  uri: z.string().optional()
}).passthrough()

export const PlaylistUserObjectSchema = z.object({
  external_urls: ExternalUrlObjectSchema.optional(),
  href: z.string().optional(),
  id: z.string().optional(),
  type: z.enum(["user"]).optional(),
  uri: z.string().optional()
}).passthrough()

export const ContextObjectSchema = z.object({
  type: z.string().optional(),
  href: z.string().optional(),
  external_urls: ExternalUrlObjectSchema.optional(),
  uri: z.string().optional()
}).passthrough()

export const ArtistObjectSchema = z.object({
  external_urls: ExternalUrlObjectSchema.optional(),
  followers: FollowersObjectSchema.optional(),
  genres: z.array(z.string()).optional(),
  href: z.string().optional(),
  id: z.string().optional(),
  images: z.array(ImageObjectSchema).optional(),
  name: z.string().optional(),
  popularity: z.number().optional(),
  type: z.enum(["artist"]).optional(),
  uri: z.string().optional()
}).passthrough()

export const PublicUserObjectSchema = z.object({
  display_name: z.string().optional(),
  external_urls: ExternalUrlObjectSchema.optional(),
  followers: FollowersObjectSchema.optional(),
  href: z.string().optional(),
  id: z.string().optional(),
  images: z.array(ImageObjectSchema).optional(),
  type: z.enum(["user"]).optional(),
  uri: z.string().optional()
}).passthrough()

export const CategoryObjectSchema = z.object({
  href: z.string(),
  icons: z.array(ImageObjectSchema),
  id: z.string(),
  name: z.string()
}).passthrough()

export const EpisodeBaseSchema = z.object({
  audio_preview_url: z.string(),
  description: z.string(),
  html_description: z.string(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_urls: ExternalUrlObjectSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(ImageObjectSchema),
  is_externally_hosted: z.boolean(),
  is_playable: z.boolean(),
  language: z.string().optional(),
  languages: z.array(z.string()),
  name: z.string(),
  release_date: z.string(),
  release_date_precision: z.enum(["year", "month", "day"]),
  resume_point: ResumePointObjectSchema.optional(),
  type: z.enum(["episode"]),
  uri: z.string(),
  restrictions: EpisodeRestrictionObjectSchema.optional()
}).passthrough()

export const ShowBaseSchema = z.object({
  available_markets: z.array(z.string()),
  copyrights: z.array(CopyrightObjectSchema),
  description: z.string(),
  html_description: z.string(),
  explicit: z.boolean(),
  external_urls: ExternalUrlObjectSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(ImageObjectSchema),
  is_externally_hosted: z.boolean(),
  languages: z.array(z.string()),
  media_type: z.string(),
  name: z.string(),
  publisher: z.string(),
  type: z.enum(["show"]),
  uri: z.string(),
  total_episodes: z.number()
}).passthrough()

export const AudiobookBaseSchema = z.object({
  authors: z.array(AuthorObjectSchema),
  available_markets: z.array(z.string()),
  copyrights: z.array(CopyrightObjectSchema),
  description: z.string(),
  html_description: z.string(),
  edition: z.string().optional(),
  explicit: z.boolean(),
  external_urls: ExternalUrlObjectSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(ImageObjectSchema),
  languages: z.array(z.string()),
  media_type: z.string(),
  name: z.string(),
  narrators: z.array(NarratorObjectSchema),
  publisher: z.string(),
  type: z.enum(["audiobook"]),
  uri: z.string(),
  total_chapters: z.number()
}).passthrough()

export const AlbumBaseSchema = z.object({
  album_type: z.enum(["album", "single", "compilation"]),
  total_tracks: z.number(),
  available_markets: z.array(z.string()),
  external_urls: ExternalUrlObjectSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(ImageObjectSchema),
  name: z.string(),
  release_date: z.string(),
  release_date_precision: z.enum(["year", "month", "day"]),
  restrictions: AlbumRestrictionObjectSchema.optional(),
  type: z.enum(["album"]),
  uri: z.string()
}).passthrough()

export const ChapterBaseSchema = z.object({
  audio_preview_url: z.string(),
  available_markets: z.array(z.string()).optional(),
  chapter_number: z.number(),
  description: z.string(),
  html_description: z.string(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_urls: ExternalUrlObjectSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(ImageObjectSchema),
  is_playable: z.boolean(),
  languages: z.array(z.string()),
  name: z.string(),
  release_date: z.string(),
  release_date_precision: z.enum(["year", "month", "day"]),
  resume_point: ResumePointObjectSchema.optional(),
  type: z.enum(["episode"]),
  uri: z.string(),
  restrictions: ChapterRestrictionObjectSchema.optional()
}).passthrough()

export const PrivateUserObjectSchema = z.object({
  country: z.string().optional(),
  display_name: z.string().optional(),
  email: z.string().optional(),
  explicit_content: ExplicitContentSettingsObjectSchema.optional(),
  external_urls: ExternalUrlObjectSchema.optional(),
  followers: FollowersObjectSchema.optional(),
  href: z.string().optional(),
  id: z.string().optional(),
  images: z.array(ImageObjectSchema).optional(),
  product: z.string().optional(),
  type: z.string().optional(),
  uri: z.string().optional()
}).passthrough()

export const AudioAnalysisObjectSchema = z.object({
  meta: z.object({
  analyzer_version: z.string().optional(),
  platform: z.string().optional(),
  detailed_status: z.string().optional(),
  status_code: z.number().optional(),
  timestamp: z.number().optional(),
  analysis_time: z.number().optional(),
  input_process: z.string().optional()
}).passthrough().optional(),
  track: z.object({
  num_samples: z.number().optional(),
  duration: z.number().optional(),
  sample_md5: z.string().optional(),
  offset_seconds: z.number().optional(),
  window_seconds: z.number().optional(),
  analysis_sample_rate: z.number().optional(),
  analysis_channels: z.number().optional(),
  end_of_fade_in: z.number().optional(),
  start_of_fade_out: z.number().optional(),
  loudness: LoudnessSchema.optional(),
  tempo: TempoSchema.optional(),
  tempo_confidence: z.number().min(0).max(1).optional(),
  time_signature: TimeSignatureSchema.optional(),
  time_signature_confidence: z.number().min(0).max(1).optional(),
  key: KeySchema.optional(),
  key_confidence: z.number().min(0).max(1).optional(),
  mode: ModeSchema.optional(),
  mode_confidence: z.number().min(0).max(1).optional(),
  codestring: z.string().optional(),
  code_version: z.number().optional(),
  echoprintstring: z.string().optional(),
  echoprint_version: z.number().optional(),
  synchstring: z.string().optional(),
  synch_version: z.number().optional(),
  rhythmstring: z.string().optional(),
  rhythm_version: z.number().optional()
}).passthrough().optional(),
  bars: z.array(TimeIntervalObjectSchema).optional(),
  beats: z.array(TimeIntervalObjectSchema).optional(),
  sections: z.array(SectionObjectSchema).optional(),
  segments: z.array(SegmentObjectSchema).optional(),
  tatums: z.array(TimeIntervalObjectSchema).optional()
}).passthrough()

export const SimplifiedTrackObjectSchema = z.object({
  artists: z.array(SimplifiedArtistObjectSchema).optional(),
  available_markets: z.array(z.string()).optional(),
  disc_number: z.number().optional(),
  duration_ms: z.number().optional(),
  explicit: z.boolean().optional(),
  external_urls: ExternalUrlObjectSchema.optional(),
  href: z.string().optional(),
  id: z.string().optional(),
  is_playable: z.boolean().optional(),
  linked_from: LinkedTrackObjectSchema.optional(),
  restrictions: TrackRestrictionObjectSchema.optional(),
  name: z.string().optional(),
  preview_url: z.string().optional(),
  track_number: z.number().optional(),
  type: z.string().optional(),
  uri: z.string().optional(),
  is_local: z.boolean().optional()
}).passthrough()

export const PlaylistOwnerObjectSchema = PlaylistUserObjectSchema.and(z.object({
  display_name: z.string().optional()
}).passthrough())

export const CursorPagingSimplifiedArtistObjectSchema = CursorPagingObjectSchema.and(z.object({
  items: z.array(ArtistObjectSchema).optional()
}).passthrough())

export const PagingArtistObjectSchema = PagingObjectSchema.and(z.object({
  items: z.array(ArtistObjectSchema).optional()
}).passthrough())

export const SimplifiedEpisodeObjectSchema = EpisodeBaseSchema

export const SimplifiedShowObjectSchema = ShowBaseSchema

export const SimplifiedAudiobookObjectSchema = AudiobookBaseSchema

export const SimplifiedAlbumObjectSchema = AlbumBaseSchema.and(z.object({
  artists: z.array(SimplifiedArtistObjectSchema)
}).passthrough())

export const SimplifiedChapterObjectSchema = ChapterBaseSchema

export const PagingSimplifiedTrackObjectSchema = PagingObjectSchema.and(z.object({
  items: z.array(SimplifiedTrackObjectSchema).optional()
}).passthrough())

export const SimplifiedPlaylistObjectSchema = z.object({
  collaborative: z.boolean().optional(),
  description: z.string().optional(),
  external_urls: ExternalUrlObjectSchema.optional(),
  href: z.string().optional(),
  id: z.string().optional(),
  images: z.array(ImageObjectSchema).optional(),
  name: z.string().optional(),
  owner: PlaylistOwnerObjectSchema.optional(),
  public: z.boolean().optional(),
  snapshot_id: z.string().optional(),
  items: PlaylistTracksRefObjectSchema.optional(),
  tracks: PlaylistTracksRefObjectSchema.optional(),
  type: z.string().optional(),
  uri: z.string().optional()
}).passthrough()

export const PagingSimplifiedEpisodeObjectSchema = PagingObjectSchema.and(z.object({
  items: z.array(SimplifiedEpisodeObjectSchema).optional()
}).passthrough())

export const PagingSimplifiedShowObjectSchema = PagingObjectSchema.and(z.object({
  items: z.array(SimplifiedShowObjectSchema).optional()
}).passthrough())

export const SavedShowObjectSchema = z.object({
  added_at: z.string().optional(),
  show: SimplifiedShowObjectSchema.optional()
}).passthrough()

export const EpisodeObjectSchema = EpisodeBaseSchema.and(z.object({
  show: SimplifiedShowObjectSchema
}).passthrough())

export const PagingSimplifiedAudiobookObjectSchema = PagingObjectSchema.and(z.object({
  items: z.array(SimplifiedAudiobookObjectSchema).optional()
}).passthrough())

export const ChapterObjectSchema = ChapterBaseSchema.and(z.object({
  audiobook: SimplifiedAudiobookObjectSchema
}).passthrough())

export const PagingSimplifiedAlbumObjectSchema = PagingObjectSchema.and(z.object({
  items: z.array(SimplifiedAlbumObjectSchema).optional()
}).passthrough())

export const TrackObjectSchema = z.object({
  album: SimplifiedAlbumObjectSchema.optional(),
  artists: z.array(SimplifiedArtistObjectSchema).optional(),
  available_markets: z.array(z.string()).optional(),
  disc_number: z.number().optional(),
  duration_ms: z.number().optional(),
  explicit: z.boolean().optional(),
  external_ids: ExternalIdObjectSchema.optional(),
  external_urls: ExternalUrlObjectSchema.optional(),
  href: z.string().optional(),
  id: z.string().optional(),
  is_playable: z.boolean().optional(),
  linked_from: LinkedTrackObjectSchema.optional(),
  restrictions: TrackRestrictionObjectSchema.optional(),
  name: z.string().optional(),
  popularity: z.number().optional(),
  preview_url: z.string().optional(),
  track_number: z.number().optional(),
  type: z.enum(["track"]).optional(),
  uri: z.string().optional(),
  is_local: z.boolean().optional()
}).passthrough()

export const ArtistDiscographyAlbumObjectSchema = SimplifiedAlbumObjectSchema.and(z.object({
  album_group: z.enum(["album", "single", "compilation", "appears_on"])
}).passthrough())

export const PagingSimplifiedChapterObjectSchema = PagingObjectSchema.and(z.object({
  items: z.array(SimplifiedChapterObjectSchema).optional()
}).passthrough())

export const AlbumObjectSchema = AlbumBaseSchema.and(z.object({
  artists: z.array(SimplifiedArtistObjectSchema).optional(),
  tracks: PagingSimplifiedTrackObjectSchema.optional(),
  copyrights: z.array(CopyrightObjectSchema).optional(),
  external_ids: ExternalIdObjectSchema.optional(),
  genres: z.array(z.string()).optional(),
  label: z.string().optional(),
  popularity: z.number().optional()
}).passthrough())

export const PagingPlaylistObjectSchema = PagingObjectSchema.and(z.object({
  items: z.array(SimplifiedPlaylistObjectSchema).optional()
}).passthrough())

export const ShowObjectSchema = ShowBaseSchema.and(z.object({
  episodes: PagingSimplifiedEpisodeObjectSchema
}).passthrough())

export const PagingSavedShowObjectSchema = PagingObjectSchema.and(z.object({
  items: z.array(SavedShowObjectSchema).optional()
}).passthrough())

export const SavedEpisodeObjectSchema = z.object({
  added_at: z.string().optional(),
  episode: EpisodeObjectSchema.optional()
}).passthrough()

export const PlayHistoryObjectSchema = z.object({
  track: TrackObjectSchema.optional(),
  played_at: z.string().optional(),
  context: ContextObjectSchema.optional()
}).passthrough()

export const PlaylistTrackObjectSchema = z.object({
  added_at: z.string().optional(),
  added_by: PlaylistUserObjectSchema.optional(),
  is_local: z.boolean().optional(),
  item: z.union([TrackObjectSchema, EpisodeObjectSchema]).optional(),
  track: z.union([TrackObjectSchema, EpisodeObjectSchema]).optional()
}).passthrough()

export const QueueObjectSchema = z.object({
  currently_playing: z.union([TrackObjectSchema, EpisodeObjectSchema]).optional(),
  queue: z.array(z.union([TrackObjectSchema, EpisodeObjectSchema])).optional()
}).passthrough()

export const CurrentlyPlayingContextObjectSchema = z.object({
  device: DeviceObjectSchema.optional(),
  repeat_state: z.string().optional(),
  shuffle_state: z.boolean().optional(),
  context: ContextObjectSchema.optional(),
  timestamp: z.number().optional(),
  progress_ms: z.number().optional(),
  is_playing: z.boolean().optional(),
  item: z.union([TrackObjectSchema, EpisodeObjectSchema]).optional(),
  currently_playing_type: z.string().optional(),
  actions: DisallowsObjectSchema.optional()
}).passthrough()

export const PagingTrackObjectSchema = PagingObjectSchema.and(z.object({
  items: z.array(TrackObjectSchema).optional()
}).passthrough())

export const RecommendationsObjectSchema = z.object({
  seeds: z.array(RecommendationSeedObjectSchema),
  tracks: z.array(TrackObjectSchema)
}).passthrough()

export const SavedTrackObjectSchema = z.object({
  added_at: z.string().optional(),
  track: TrackObjectSchema.optional()
}).passthrough()

export const CurrentlyPlayingObjectSchema = z.object({
  context: ContextObjectSchema.optional(),
  timestamp: z.number().optional(),
  progress_ms: z.number().optional(),
  is_playing: z.boolean().optional(),
  item: z.union([TrackObjectSchema, EpisodeObjectSchema]).optional(),
  currently_playing_type: z.string().optional(),
  actions: DisallowsObjectSchema.optional()
}).passthrough()

export const PagingArtistDiscographyAlbumObjectSchema = PagingObjectSchema.and(z.object({
  items: z.array(ArtistDiscographyAlbumObjectSchema).optional()
}).passthrough())

export const AudiobookObjectSchema = AudiobookBaseSchema.and(z.object({
  chapters: PagingSimplifiedChapterObjectSchema
}).passthrough())

export const SavedAlbumObjectSchema = z.object({
  added_at: z.string().optional(),
  album: AlbumObjectSchema.optional()
}).passthrough()

export const PagingFeaturedPlaylistObjectSchema = z.object({
  message: z.string().optional(),
  playlists: PagingPlaylistObjectSchema.optional()
}).passthrough()

export const PagingSavedEpisodeObjectSchema = PagingObjectSchema.and(z.object({
  items: z.array(SavedEpisodeObjectSchema).optional()
}).passthrough())

export const CursorPagingPlayHistoryObjectSchema = CursorPagingObjectSchema.and(z.object({
  items: z.array(PlayHistoryObjectSchema).optional()
}).passthrough())

export const PagingPlaylistTrackObjectSchema = PagingObjectSchema.and(z.object({
  items: z.array(PlaylistTrackObjectSchema).optional()
}).passthrough())

export const PagingSavedTrackObjectSchema = PagingObjectSchema.and(z.object({
  items: z.array(SavedTrackObjectSchema).optional()
}).passthrough())

export const SavedAudiobookObjectSchema = z.object({
  added_at: z.string().optional(),
  audiobook: AudiobookObjectSchema.optional()
}).passthrough()

export const PagingSavedAlbumObjectSchema = PagingObjectSchema.and(z.object({
  items: z.array(SavedAlbumObjectSchema).optional()
}).passthrough())

export const PlaylistObjectSchema = z.object({
  collaborative: z.boolean().optional(),
  description: z.string().optional(),
  external_urls: ExternalUrlObjectSchema.optional(),
  href: z.string().optional(),
  id: z.string().optional(),
  images: z.array(ImageObjectSchema).optional(),
  name: z.string().optional(),
  owner: PlaylistOwnerObjectSchema.optional(),
  public: z.boolean().optional(),
  snapshot_id: z.string().optional(),
  items: PagingPlaylistTrackObjectSchema.optional(),
  tracks: PagingPlaylistTrackObjectSchema.optional(),
  type: z.string().optional(),
  uri: z.string().optional(),
  followers: FollowersObjectSchema.optional()
}).passthrough()

export const PagingSavedAudiobookObjectSchema = PagingObjectSchema.and(z.object({
  items: z.array(SavedAudiobookObjectSchema).optional()
}).passthrough())
