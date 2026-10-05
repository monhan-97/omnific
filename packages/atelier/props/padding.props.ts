/**
 * Atelier padding 的静态刻度。
 */
export const paddingValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

/**
 * Atelier padding 值。
 */
export type PaddingValue = (typeof paddingValues)[number];
