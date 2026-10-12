import type { ComponentPropsWithRef, ComponentType } from 'react';

import {
  ChevronUp,
  EyeIcon,
  EyeOffIcon,
  LoadingIcon,
  PanelLeftClose,
  RotateCw,
  Search,
  SlidersHorizontal,
  X,
} from '@omnific/icons';

/**
 * Props passed to icons in the preview site.
 */
export type IconPreviewProps = ComponentPropsWithRef<'svg'> & {
  /**
   * Icon width and height in pixels.
   */
  size?: number | string;
  /**
   * SVG stroke width used by the preview render.
   */
  strokeWidth?: number | string;
  /**
   * Keeps the apparent stroke width stable when the icon is resized.
   */
  absoluteStrokeWidth?: boolean;
};

/**
 * Metadata required to render one preview card and details panel.
 */
export type IconEntry = {
  /**
   * Public component name exported by `@omnific/icons`.
   */
  name: string;
  /**
   * React icon component rendered by the preview site.
   */
  Component: ComponentType<IconPreviewProps>;
  /**
   * Short user-facing summary shown near the icon.
   */
  description: string;
  /**
   * Categories used to group the icon in the preview site.
   */
  categories: readonly string[];
  /**
   * Search terms describing common meanings of the icon.
   */
  keywords: readonly string[];
};

/**
 * Type-safe icon metadata used by the React preview app.
 */
export const iconEntries = [
  {
    name: 'ChevronUp',
    Component: ChevronUp,
    description: '表示向上展开或菜单选项。',
    categories: ['Arrows', 'Navigation'],
    keywords: ['chevron', 'up', 'expand', 'collapse', 'menu'],
  },
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
  {
    name: 'PanelLeftClose',
    Component: PanelLeftClose,
    description: '表示关闭或收起左侧面板。',
    categories: ['Layout', 'Navigation'],
    keywords: ['sidebar', 'panel', 'close', 'collapse', 'layout'],
  },
  {
    name: 'RotateCw',
    Component: RotateCw,
    description: '表示重置或刷新操作。',
    categories: ['Arrows', 'Status'],
    keywords: ['rotate', 'refresh', 'reset', 'reload', 'clockwise'],
  },
  {
    name: 'Search',
    Component: Search,
    description: '表示搜索操作。',
    categories: ['Text', 'Navigation'],
    keywords: ['search', 'find', 'magnifier', 'lookup', 'query'],
  },
  {
    name: 'SlidersHorizontal',
    Component: SlidersHorizontal,
    description: '表示筛选或自定义控件。',
    categories: ['Design', 'Development'],
    keywords: ['sliders', 'settings', 'filters', 'controls', 'adjust'],
  },
  {
    name: 'X',
    Component: X,
    description: '表示关闭或清除操作。',
    categories: ['Math', 'Navigation'],
    keywords: ['close', 'clear', 'dismiss', 'cancel', 'remove'],
  },
] satisfies IconEntry[];
