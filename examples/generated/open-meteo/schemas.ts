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

export const HourlyResponseSchema = z.object({
  time: z.array(z.string()),
  temperature_2m: z.array(z.number()).optional(),
  relative_humidity_2m: z.array(z.number()).optional(),
  dew_point_2m: z.array(z.number()).optional(),
  apparent_temperature: z.array(z.number()).optional(),
  pressure_msl: z.array(z.number()).optional(),
  cloud_cover: z.array(z.number()).optional(),
  cloud_cover_low: z.array(z.number()).optional(),
  cloud_cover_mid: z.array(z.number()).optional(),
  cloud_cover_high: z.array(z.number()).optional(),
  wind_speed_10m: z.array(z.number()).optional(),
  wind_speed_80m: z.array(z.number()).optional(),
  wind_speed_120m: z.array(z.number()).optional(),
  wind_speed_180m: z.array(z.number()).optional(),
  wind_direction_10m: z.array(z.number()).optional(),
  wind_direction_80m: z.array(z.number()).optional(),
  wind_direction_120m: z.array(z.number()).optional(),
  wind_direction_180m: z.array(z.number()).optional(),
  wind_gusts_10m: z.array(z.number()).optional(),
  shortwave_radiation: z.array(z.number()).optional(),
  direct_radiation: z.array(z.number()).optional(),
  direct_normal_irradiance: z.array(z.number()).optional(),
  diffuse_radiation: z.array(z.number()).optional(),
  vapour_pressure_deficit: z.array(z.number()).optional(),
  evapotranspiration: z.array(z.number()).optional(),
  precipitation: z.array(z.number()).optional(),
  weather_code: z.array(z.number()).optional(),
  snow_height: z.array(z.number()).optional(),
  freezing_level_height: z.array(z.number()).optional(),
  soil_temperature_0cm: z.array(z.number()).optional(),
  soil_temperature_6cm: z.array(z.number()).optional(),
  soil_temperature_18cm: z.array(z.number()).optional(),
  soil_temperature_54cm: z.array(z.number()).optional(),
  soil_moisture_0_1cm: z.array(z.number()).optional(),
  soil_moisture_1_3cm: z.array(z.number()).optional(),
  soil_moisture_3_9cm: z.array(z.number()).optional(),
  soil_moisture_9_27cm: z.array(z.number()).optional(),
  soil_moisture_27_81cm: z.array(z.number()).optional()
}).passthrough()

export const DailyResponseSchema = z.object({
  time: z.array(z.string()),
  temperature_2m_max: z.array(z.number()).optional(),
  temperature_2m_min: z.array(z.number()).optional(),
  apparent_temperature_max: z.array(z.number()).optional(),
  apparent_temperature_min: z.array(z.number()).optional(),
  precipitation_sum: z.array(z.number()).optional(),
  precipitation_hours: z.array(z.number()).optional(),
  weather_code: z.array(z.number()).optional(),
  sunrise: z.array(z.number()).optional(),
  sunset: z.array(z.number()).optional(),
  wind_speed_10m_max: z.array(z.number()).optional(),
  wind_gusts_10m_max: z.array(z.number()).optional(),
  wind_direction_10m_dominant: z.array(z.number()).optional(),
  shortwave_radiation_sum: z.array(z.number()).optional(),
  uv_index_max: z.array(z.number()).optional(),
  uv_index_clear_sky_max: z.array(z.number()).optional(),
  et0_fao_evapotranspiration: z.array(z.number()).optional()
}).passthrough()

export const CurrentWeatherSchema = z.object({
  time: z.string(),
  temperature: z.number(),
  windspeed: z.number().optional(),
  winddirection: z.number().optional(),
  weather_code: z.number()
}).passthrough()
