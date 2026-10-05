/**
 * Atelier shadow 的静态值。
 */
export const shadowValues = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'inner', 'inset'] as const;

/**
 * Atelier shadow 值。
 */
export type ShadowValue = (typeof shadowValues)[number];
