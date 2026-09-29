import type { TokenCategory } from '../types';

/**
 * 默认字体族。
 */
export const fonts = {
  sans: {
    value:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  },
} as const satisfies TokenCategory;
