import type { ThemeTokens } from './types';

/**
 * 标注并返回 tokens 对象，保留字面量键供类型推导。
 */
export const defineTokens = <const T extends ThemeTokens>(tokens: T): T => tokens;
