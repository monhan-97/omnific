import type { ComponentPropsWithRef } from 'react';

import type { AtelierProps } from '../props';
import type { ScalingValue } from '../props/scaling.props';

/**
 * Box 组件自有样式属性。
 */
export type BoxOwnProps = AtelierProps & {
  /**
   * 是否显示默认 1px solid 边框。
   */
  border?: boolean;
  /**
   * 调整结构 token 的缩放比例。
   */
  scaling?: ScalingValue;
};

/**
 * 通用样式容器属性。
 *
 * 使用 `interface` 扩展原生 div props，便于 Storybook Docgen 推断 Controls。
 */
export interface BoxProps extends ComponentPropsWithRef<'div'>, BoxOwnProps {}
