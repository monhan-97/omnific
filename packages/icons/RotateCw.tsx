import { createIcon } from './createIcon';
import type { IconProps } from './iconTypes';

/**
Props accepted by {@link RotateCw}.
*/
export type RotateCwProps = IconProps;

/**
Renders a clockwise arrow used for reset and refresh actions.
*/
export const RotateCw = createIcon([
  ['path', { d: 'M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8' }],
  ['path', { d: 'M21 3v5h-5' }],
]);
