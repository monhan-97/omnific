/**
 * Atelier flex-basis 的静态值。
 */
export const flexBasisValues = [
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
  '100%',
  'auto',
  'content',
  'fit-content',
  'min-content',
  'max-content',
] as const;

/**
 * Atelier flex-basis 值。
 */
export type FlexBasisValue = (typeof flexBasisValues)[number];

/**
 * Atelier flex-grow 的静态值。
 */
export const flexGrowValues = ['0', '1'] as const;

/**
 * Atelier flex-grow 值。
 */
export type FlexGrowValue = (typeof flexGrowValues)[number];

/**
 * Atelier flex-shrink 的静态值。
 */
export const flexShrinkValues = ['0', '1'] as const;

/**
 * Atelier flex-shrink 值。
 */
export type FlexShrinkValue = (typeof flexShrinkValues)[number];

/**
 * Atelier flex-direction 的静态值。
 */
export const flexDirectionValues = ['row', 'row-reverse', 'column', 'column-reverse'] as const;

/**
 * Atelier flex-direction 值。
 */
export type FlexDirectionValue = (typeof flexDirectionValues)[number];

/**
 * Atelier flex-wrap 的静态值。
 */
export const flexWrapValues = ['nowrap', 'wrap', 'wrap-reverse'] as const;

/**
 * Atelier flex-wrap 值。
 */
export type FlexWrapValue = (typeof flexWrapValues)[number];

/**
 * Atelier align-items 与 align-self 的静态值。
 */
export const alignValues = ['start', 'center', 'end', 'baseline', 'stretch'] as const;

/**
 * Atelier align-items 与 align-self 值。
 */
export type AlignValue = (typeof alignValues)[number];

/**
 * Atelier align-content 的静态值。
 */
export const alignContentValues = [
  'start',
  'center',
  'end',
  'space-between',
  'space-around',
  'space-evenly',
  'stretch',
] as const;

/**
 * Atelier align-content 值。
 */
export type AlignContentValue = (typeof alignContentValues)[number];
