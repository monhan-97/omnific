import { createIcon } from './createIcon';
import type { IconProps } from './iconTypes';

/**
Props accepted by {@link LoadingIcon}.
*/
export type LoadingIconProps = IconProps;

/**
Renders the package loading indicator.
*/
export const LoadingIcon = createIcon([
  ['path', { d: 'M21 12a9 9 0 1 1-6.219-8.56' }],
]);
