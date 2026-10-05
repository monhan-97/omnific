/**
 * Atelier overflow 的静态值。
 */
export const overflowValues = ['visible', 'hidden', 'clip', 'scroll', 'auto'] as const;

/**
 * Atelier overflow 值。
 */
export type OverflowValue = (typeof overflowValues)[number];
