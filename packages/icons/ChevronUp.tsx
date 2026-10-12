import { createIcon } from './createIcon';
import type { IconProps } from './iconTypes';

/**
Props accepted by {@link ChevronUp}.
*/
export type ChevronUpProps = IconProps;

/**
Renders an upward chevron used for expand and menu controls.
*/
export const ChevronUp = createIcon([
  ['path', { d: 'm18 15-6-6-6 6' }],
]);
