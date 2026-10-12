import type { CSSProperties, ComponentPropsWithRef, ReactNode } from 'react';

import type { ComponentSize } from '../types';

/**
 * 按钮颜色角色。
 */
export type ButtonColor = 'default' | 'primary' | 'danger';

/**
 * 按钮形态。
 */
export type ButtonVariant = 'solid' | 'outlined' | 'dashed';

/**
 * 按钮形状。
 */
export type ButtonShape = 'default' | 'circle' | 'round';

/**
 * 按钮属性。
 *
 * 使用 `interface` 扩展原生 button props，便于 Storybook Docgen 推断 Controls。
 */
export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /**
   * 设置按钮颜色角色。
   *
   * 省略时使用 `default`。
   */
  color?: ButtonColor;
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
   * 设置按钮形态。
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
