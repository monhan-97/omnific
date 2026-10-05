import type { ColorSet } from './types';

/**
 * 标注并返回扁平颜色表，保留字面量键供类型自动推导。
 */
export const defineColors = <const T extends ColorSet>(colors: T) => colors;
