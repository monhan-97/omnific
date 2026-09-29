import type { ComponentPropsWithRef } from 'react';

import type { ColorToken, RadiiToken, ShadowToken, SpacingToken } from '../system';

/**
 * Box 自有样式属性。
 */
export type BoxOwnProps = {
  /**
   * 内边距，对应 `padding`。
   */
  p?: SpacingToken;
  /**
   * 水平内边距，对应 `padding-inline`。
   */
  px?: SpacingToken;
  /**
   * 垂直内边距，对应 `padding-block`。
   */
  py?: SpacingToken;
  /**
   * 背景色语义 token。
   */
  bg?: ColorToken;
  /**
   * 圆角预设。
   */
  rounded?: RadiiToken;
  /**
   * 是否显示默认 1px solid 边框。
   */
  border?: boolean;
  /**
   * 边框颜色语义 token。
   */
  borderColor?: ColorToken;
  /**
   * 阴影预设。
   */
  shadow?: ShadowToken;
};

/**
 * 通用样式容器属性。
 *
 * 使用 `interface` 扩展原生 div props，便于 Storybook Docgen 推断 Controls。
 */
export interface BoxProps extends ComponentPropsWithRef<'div'>, BoxOwnProps {}
