/**
 * Wendoro UI Motion Tokens
 * Reduced-motion aware durations and easings.
 * Core interactions never depend on animation completion.
 */

export const motionDurations = {
  instant: 'var(--wdr-motion-instant, 75ms)',
  fast: 'var(--wdr-motion-fast, 120ms)',
  standard: 'var(--wdr-motion-standard, 180ms)',
  slow: 'var(--wdr-motion-slow, 280ms)',
} as const;

export const motionEasings = {
  standard: 'var(--wdr-ease-standard, cubic-bezier(0.2, 0, 0, 1))',
  entrance: 'var(--wdr-ease-entrance, cubic-bezier(0, 0, 0.2, 1))',
  exit: 'var(--wdr-ease-exit, cubic-bezier(0.4, 0, 1, 1))',
} as const;

export const motionTokens = {
  fastInteraction: `${motionDurations.fast} ${motionEasings.standard}`,
  standardTransition: `${motionDurations.standard} ${motionEasings.standard}`,
  slowTransition: `${motionDurations.slow} ${motionEasings.standard}`,
  entrance: `${motionDurations.standard} ${motionEasings.entrance}`,
  exit: `${motionDurations.fast} ${motionEasings.exit}`,
  expandCollapse: `${motionDurations.standard} ${motionEasings.standard}`,
  loadingFeedback: '1400ms linear',
} as const;

export const REDUCED_MOTION_MEDIA_QUERY = '(prefers-reduced-motion: reduce)';

export type MotionDurationKey = keyof typeof motionDurations;
export type MotionTokenKey = keyof typeof motionTokens;
