/**
 * Atelier justify-items 的静态值。
 */
export const justifyItemsValues = ['start', 'center', 'end', 'stretch'] as const;

/**
 * Atelier justify-items 值。
 */
export type JustifyItemsValue = (typeof justifyItemsValues)[number];

/**
 * Atelier justify-content 与 place-content 的静态值。
 */
export const contentDistributionValues = [
  'start',
  'center',
  'end',
  'space-between',
  'space-around',
  'space-evenly',
  'stretch',
] as const;

/**
 * Atelier justify-content 与 place-content 值。
 */
export type ContentDistributionValue = (typeof contentDistributionValues)[number];

/**
 * Atelier justify-self 的静态值。
 */
export const justifySelfValues = ['start', 'center', 'end', 'baseline', 'stretch'] as const;

/**
 * Atelier justify-self 值。
 */
export type JustifySelfValue = (typeof justifySelfValues)[number];

/**
 * Atelier place-items 的静态值。
 */
export const placeItemsValues = ['start', 'center', 'end', 'stretch'] as const;

/**
 * Atelier place-items 值。
 */
export type PlaceItemsValue = (typeof placeItemsValues)[number];
