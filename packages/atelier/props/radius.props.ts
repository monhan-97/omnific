/**
 * Atelier radius 的静态值。
 */
export const radiusValues = [
  'none',
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  'full',
] as const;

/**
 * Atelier radius 值。
 */
export type RadiusValue = (typeof radiusValues)[number];
