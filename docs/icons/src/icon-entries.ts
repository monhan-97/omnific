import type { ComponentPropsWithRef, ComponentType } from 'react';
import { EyeIcon, EyeOffIcon, LoadingIcon } from '@omnific/icons';

/**
Props passed to icons in the preview site.
*/
export type IconPreviewProps = ComponentPropsWithRef<'svg'> & {
  /**
  Icon width and height in pixels.
  */
  size?: number | string;
  /**
  SVG stroke width used by the preview render.
  */
  strokeWidth?: number | string;
  /**
  Keeps the apparent stroke width stable when the icon is resized.
  */
  absoluteStrokeWidth?: boolean;
};

/**
Metadata required to render one preview card and details panel.
*/
export type IconEntry = {
  /**
  Public component name exported by `@omnific/icons`.
  */
  name: string;
  /**
  React icon component rendered by the preview site.
  */
  Component: ComponentType<IconPreviewProps>;
  /**
  Short user-facing summary shown near the icon.
  */
  description: string;
  /**
  Categories used to group the icon in the preview site.
  */
  categories: readonly string[];
  /**
  Search terms describing common meanings of the icon.
  */
  keywords: readonly string[];
};

/**
Type-safe icon metadata used by the React preview app.
*/
export const iconEntries = [
  {
    name: 'EyeIcon',
    Component: EyeIcon,
    description: '表示内容可见状态。',
    categories: ['Accessibility', 'Design'],
    keywords: ['view', 'watch', 'see', 'show', 'visible', 'preview'],
  },
  {
    name: 'EyeOffIcon',
    Component: EyeOffIcon,
    description: '表示内容隐藏状态。',
    categories: ['Accessibility', 'Design'],
    keywords: ['hide', 'hidden', 'invisible', 'privacy', 'visibility'],
  },
  {
    name: 'LoadingIcon',
    Component: LoadingIcon,
    description: '表示正在加载。',
    categories: ['Status'],
    keywords: ['loading', 'progress', 'pending', 'refresh', 'spinner'],
  },
] satisfies IconEntry[];
