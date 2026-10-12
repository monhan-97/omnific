import type { ColorSet } from './types';

/**
 * 标注并返回嵌套颜色配置，保留字面量结构。
 */
export const defineColors = <const T extends ColorSet>(colors: T): T => colors;
