/**
 * Atelier margin 的静态刻度，包含负值。
 */
export const marginValues = [
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
  '-1',
  '-2',
  '-3',
  '-4',
  '-5',
  '-6',
  '-7',
  '-8',
  '-9',
] as const;

/**
 * Atelier margin 值。
 */
export type MarginValue = (typeof marginValues)[number];
