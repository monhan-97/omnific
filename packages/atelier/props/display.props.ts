/**
 * Atelier display 的静态值。
 */
export const displayValues = [
  'none',
  'inline',
  'inline-block',
  'block',
  'flex',
  'inline-flex',
  'contents',
] as const;

/**
 * Atelier display 值。
 */
export type DisplayValue = (typeof displayValues)[number];
