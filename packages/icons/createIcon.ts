import { uniqueId } from '@omnific/utils';
import { type ComponentType, createElement } from 'react';

import { SvgIcon } from './SvgIcon';
import type { ArtworkNode, IconProps } from './iconTypes';

/**
Creates a named package icon from immutable SVG artwork nodes.
*/
export const createIcon = (nodes: readonly ArtworkNode[]): ComponentType<IconProps> => {
  const artwork = nodes.map(([tag, attributes]) =>
    createElement(tag, { ...attributes, key: uniqueId(`${tag}-`) }),
  );

  const Icon = (props: IconProps) => {
    const { children, ...properties } = props;

    return createElement(SvgIcon, properties, artwork, children);
  };

  return Icon;
};
