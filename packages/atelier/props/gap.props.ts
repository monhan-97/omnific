/**
 * Atelier gap 的静态刻度。
 */
export const gapValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

/**
 * Atelier gap、column-gap 与 row-gap 值。
 */
export type GapValue = (typeof gapValues)[number];
