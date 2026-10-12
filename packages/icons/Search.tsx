import { createIcon } from './createIcon';
import type { IconProps } from './iconTypes';

/**
Props accepted by {@link Search}.
*/
export type SearchProps = IconProps;

/**
Renders a magnifying glass used for search actions.
*/
export const Search = createIcon([
  ['path', { d: 'm21 21-4.34-4.34' }],
  ['circle', { cx: '11', cy: '11', r: '8' }],
]);
