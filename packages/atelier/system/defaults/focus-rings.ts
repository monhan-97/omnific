import type { TokenCategory } from '../types';

/**
 * 默认焦点环（对齐 Atelier 既有 Button 焦点色）。
 */
export const focusRings = {
  default: { value: 'rgb(21 112 239 / 25%)' },
} as const satisfies TokenCategory;
