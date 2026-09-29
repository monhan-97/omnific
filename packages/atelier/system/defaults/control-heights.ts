import type { TokenCategory } from '../types';

/**
 * 默认控件高度。
 */
export const controlHeights = {
  sm: { value: '24px' },
  md: { value: '32px' },
  lg: { value: '40px' },
} as const satisfies TokenCategory;
