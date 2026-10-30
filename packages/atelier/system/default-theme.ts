import { defaultColors, defaultTokens } from './defaults';
import type { ThemeConfig } from './types';

/**
 * Atelier 默认主题配置。
 */
export const defaultTheme = {
  tokens: {
    colors: defaultTokens,
  },
  semanticTokens: {
    colors: defaultColors,
  },
} satisfies ThemeConfig;
