import {z} from 'zod';

export const mediaSchema = z.object({
  // Path relative to public/ (e.g. "clips/gym.mp4") or a full https URL.
  src: z.string(),
  type: z.enum(['video', 'image']),
  // Seconds to skip at the start of a source video.
  startFrom: z.number().min(0).optional(),
  // 1 = no zoom. 1.15 = slow push-in over the segment (Ken Burns).
  zoom: z.number().min(1).max(2).optional(),
});

export const segmentSchema = z.object({
  durationInSeconds: z.number().min(0.3),
  media: mediaSchema.optional(),
  // Burned-in caption for this segment. Keep it to ~6 words.
  caption: z.string().optional(),
});

export const reelSchema = z.object({
  // First 1-3 seconds. This is what decides retention.
  hook: z.string(),
  hookDurationInSeconds: z.number().min(0.5).default(2),
  segments: z.array(segmentSchema),
  music: z
    .object({src: z.string(), volume: z.number().min(0).max(1).default(0.25)})
    .optional(),
  // Voiceover / spoken audio, played at full volume over the music.
  voiceover: z.object({src: z.string()}).optional(),
  showProgressBar: z.boolean().default(true),
});

export type ReelProps = z.infer<typeof reelSchema>;
export type Segment = z.infer<typeof segmentSchema>;

export const statSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const challengeSchema = z.object({
  // Which day of the challenge this reel is. 0 = the before, the starting line.
  day: z.number().min(0),
  totalDays: z.number().min(1).default(90),
  // Word above the number inside the ring.
  dayLabel: z.string().default('DIA'),
  // Big line under the badge during the intro.
  title: z.string(),
  subtitle: z.string().optional(),
  // Starting numbers: weight, body fat, whatever is being tracked.
  stats: z.array(statSchema).default([]),
  introDurationInSeconds: z.number().min(2).default(4.5),
  // Optional footage behind the intro card. Dimmed so the badge stays readable.
  introMedia: mediaSchema.optional(),
  segments: z.array(segmentSchema),
  music: z
    .object({src: z.string(), volume: z.number().min(0).max(1).default(0.25)})
    .optional(),
  voiceover: z.object({src: z.string()}).optional(),
});

export type ChallengeProps = z.infer<typeof challengeSchema>;
export type Stat = z.infer<typeof statSchema>;
