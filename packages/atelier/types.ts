/**
 * 通用控件校验状态。
 */
export type ComponentStatus = 'error' | 'warning';

/**
 * 通用控件尺寸。
 */
export type ComponentSize = 'small' | 'default' | 'large';

/**
 * 通用控件视觉形态。
 */
export type ComponentVariant = 'outlined' | 'borderless';

/**
 * Flex 交叉轴对齐方式。
 */
export type FlexAlign = 'top' | 'middle' | 'bottom' | 'stretch';

/**
 * Flex 主轴排列方式。
 */
export type FlexJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';

/**
 * Flex 换行方式。
 */
export type FlexWrap = 'wrap' | 'no-wrap' | 'wrap-reverse';

/**
 * 文本对齐方式。
 */
export type TextAlign = 'left' | 'center' | 'right';
