import { colors } from './colors';
import { controlHeights } from './control-heights';
import { focusRings } from './focus-rings';
import { fontSizes } from './font-sizes';
import { fonts } from './fonts';
import { radii } from './radii';
import { shadows } from './shadows';
import { spacing } from './spacing';

import { defineTokens } from '../define-tokens';
import type { TokenCategoryKeys } from '../types';

/**
 * 库默认 tokens：结构 scale + 语义色（含 `colors`）。
 *
 * 构建与默认用法：`createSystem(defaultConfig)`、`createSystem('default', defaultConfig)`，或直接使用 `defaultSystem`。
 * 业务覆盖：`createSystem('app', defaultConfig, customTokens)`。
 */
export const defaultConfig = defineTokens({
  spacing,
  radii,
  shadows,
  fonts,
  fontSizes,
  controlHeights,
  focusRings,
  colors,
});

/**
 * 默认 `colors` 取值联合，供组件 props 引用。
 */
export type ColorToken = TokenCategoryKeys<typeof colors>;

/**
 * 默认 `spacing` 取值联合，供组件 props 引用。
 */
export type SpacingToken = TokenCategoryKeys<typeof spacing>;

/**
 * 默认 `radii` 取值联合，供组件 props 引用。
 */
export type RadiiToken = TokenCategoryKeys<typeof radii>;

/**
 * 默认 `shadows` 取值联合，供组件 props 引用。
 */
export type ShadowToken = TokenCategoryKeys<typeof shadows>;

/**
 * 默认 `fonts` 取值联合，供组件 props 引用。
 */
export type FontToken = TokenCategoryKeys<typeof fonts>;

/**
 * 默认 `fontSizes` 取值联合，供组件 props 引用。
 */
export type FontSizeToken = TokenCategoryKeys<typeof fontSizes>;

/**
 * 默认 `controlHeights` 取值联合，供组件 props 引用。
 */
export type ControlHeightToken = TokenCategoryKeys<typeof controlHeights>;

/**
 * 默认 `focusRings` 取值联合，供组件 props 引用。
 */
export type FocusRingToken = TokenCategoryKeys<typeof focusRings>;

export { colors } from './colors';
export { controlHeights } from './control-heights';
export { focusRings } from './focus-rings';
export { fontSizes } from './font-sizes';
export { fonts } from './fonts';
export { radii } from './radii';
export { shadows } from './shadows';
export { spacing } from './spacing';
