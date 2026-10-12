import { createIcon } from './createIcon';
import type { IconProps } from './iconTypes';

/**
Props accepted by {@link X}.
*/
export type XProps = IconProps;

/**
Renders an X used for dismiss and clear actions.
*/
export const X = createIcon([
  ['path', { d: 'M18 6 6 18' }],
  ['path', { d: 'm6 6 12 12' }],
]);
