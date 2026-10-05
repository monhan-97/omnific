/**
 * Atelier width 的静态刻度、百分比与关键字值。
 */
export const widthValues = [
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
  '100vw',
  'auto',
  'min-content',
  'max-content',
  'fit-content',
] as const;

/**
 * Atelier width 值。
 */
export type WidthValue = (typeof widthValues)[number];
