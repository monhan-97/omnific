/**
 * Atelier position 的静态值。
 */
export const positionValues = ['static', 'relative', 'absolute', 'fixed', 'sticky'] as const;

/**
 * Atelier position 值。
 */
export type PositionValue = (typeof positionValues)[number];

/**
 * Atelier inset / top / right / bottom / left 的静态刻度。
 */
export const positionEdgeValues = [
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
  'auto',
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
 * Atelier inset / top / right / bottom / left 值。
 */
export type PositionEdgeValue = (typeof positionEdgeValues)[number];
