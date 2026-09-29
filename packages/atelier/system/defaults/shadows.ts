import type { TokenCategory } from '../types';

/**
 * 默认阴影档位。
 */
export const shadows = {
  xs: {
    value: '0px 1px 2px rgb(24 24 27 / 0.1), 0px 0px 1px rgb(24 24 27 / 0.2)',
  },
  sm: {
    value: '0px 2px 4px rgb(24 24 27 / 0.1), 0px 0px 1px rgb(24 24 27 / 0.3)',
  },
  md: {
    value: '0px 4px 8px rgb(24 24 27 / 0.1), 0px 0px 1px rgb(24 24 27 / 0.3)',
  },
  lg: {
    value: '0px 8px 16px rgb(24 24 27 / 0.1), 0px 0px 1px rgb(24 24 27 / 0.3)',
  },
  xl: {
    value: '0px 16px 24px rgb(24 24 27 / 0.1), 0px 0px 1px rgb(24 24 27 / 0.3)',
  },
  '2xl': {
    value: '0px 24px 40px rgb(24 24 27 / 0.16), 0px 0px 1px rgb(24 24 27 / 0.3)',
  },
  inner: { value: 'inset 0 2px 4px 0 rgb(9 9 11 / 0.05)' },
  inset: { value: 'inset 0 0 0 1px rgb(9 9 11 / 0.05)' },
} as const satisfies TokenCategory;
