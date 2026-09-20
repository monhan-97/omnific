import type { CSSProperties, ComponentPropsWithRef, ReactNode } from 'react';

import type { ComponentSize } from '../types';

/**
 * 按钮形状。
 */
export type ButtonShape = 'default' | 'circle' | 'round';

/**
 * 按钮视觉变体。危险操作用 `danger`，不再与其他变体叠加。
 */
export type ButtonVariant = 'primary' | 'secondary' | 'dashed' | 'outline' | 'danger';

/**
 * 按钮属性。
 *
 * 使用 `interface` 扩展原生 button props，便于 Storybook Docgen 推断 Controls。
 */
export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /**
   * 将按钮宽度调整为父容器宽度。
   */
  block?: boolean;
  /**
   * 设置按钮图标。
   */
  icon?: ReactNode;
  /**
   * 设置按钮加载状态。
   */
  loading?: boolean;
  /**
   * 设置按钮形状。
   */
  shape?: ButtonShape;
  /**
   * 设置按钮大小。
   */
  size?: ComponentSize;
  /**
   * 设置按钮视觉变体。
   */
  variant?: ButtonVariant;
}

/**
 * Button 内部加载图标属性。
 */
export type LoadingIconProps = {
  /**
   * 元素类名。
   */
  className?: string;
  /**
   * 是否为纯图标按钮。
   */
  iconOnly?: boolean;
  /**
   * 是否显示加载图标。
   */
  loading?: boolean;
  /**
   * 元素行内样式。
   */
  style?: CSSProperties;
};
