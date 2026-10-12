import { createIcon } from './createIcon';
import type { IconProps } from './iconTypes';

/**
Props accepted by {@link PanelLeftClose}.
*/
export type PanelLeftCloseProps = IconProps;

/**
Renders a left panel with a close chevron used for collapsing sidebars.
*/
export const PanelLeftClose = createIcon([
  ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2' }],
  ['path', { d: 'M9 3v18' }],
  ['path', { d: 'm16 15-3-3 3-3' }],
]);
