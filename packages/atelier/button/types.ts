import type { CSSProperties, ElementType, MouseEventHandler, ReactNode } from 'react';

import type { ComponentSize, PolymorphicComponentPropWithRef } from '../types';

/** button 元素原生 type 属性。 */
export type ButtonHTMLType = 'submit' | 'reset' | 'button';

/** 按钮形状。 */
export type ButtonShape = 'default' | 'circle' | 'round';

/** 按钮状态。 */
export type ButtonStatus = 'danger';

/** 按钮视觉类型。 */
export type ButtonType = 'default' | 'primary' | 'secondary' | 'dashed' | 'outline';

/** Button 自有属性。 */
type ButtonOwnProps = {
  /** 将按钮宽度调整为父容器宽度。 */
  block?: boolean;
  /** 设置 button 原生的 type 值。 */
  htmlType?: ButtonHTMLType;
  /** 设置按钮图标。 */
  icon?: ReactNode;
  /** 设置按钮加载状态。 */
  loading?: boolean;
  /** 设置按钮失效状态。 */
  disabled?: boolean;
  /** 设置按钮 className。 */
  className?: string;
  /** 按钮内容。 */
  children?: ReactNode;
  /** 点击事件。 */
  onClick?: MouseEventHandler<HTMLElement>;
  /** 设置按钮形状。 */
  shape?: ButtonShape;
  /** 设置按钮大小。 */
  size?: ComponentSize;
  /** 设置按钮状态。 */
  status?: ButtonStatus;
  /** 设置按钮类型。 */
  type?: ButtonType;
};

/** 按钮属性。 */
export type ButtonProps<Component extends ElementType = 'button'> = PolymorphicComponentPropWithRef<
  Component,
  ButtonOwnProps
>;

/** Button 内部加载图标属性。 */
export type LoadingIconProps = {
  /** 元素类名。 */
  className?: string;
  /** 是否为纯图标按钮。 */
  iconOnly?: boolean;
  /** 是否显示加载图标。 */
  loading?: boolean;
  /** 元素行内样式。 */
  style?: CSSProperties;
};
