/**
 * Atelier height 的静态刻度、百分比、视口单位与关键字值。
 */
export const heightValues = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '50%',
  '75%',
  '100%',
  '100vh',
  '100dvh',
  'auto',
  'min-content',
  'max-content',
  'fit-content',
] as const;

/**
 * Atelier height 值。
 */
export type HeightValue = (typeof heightValues)[number];
