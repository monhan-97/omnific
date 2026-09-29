import type { TokenCategory } from '../types';

/**
 * 默认字号。
 */
export const fontSizes = {
  md: { value: '14px' },
  lg: { value: '16px' },
} as const satisfies TokenCategory;
