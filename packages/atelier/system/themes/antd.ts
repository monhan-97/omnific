import { createTheme } from '../create-theme';
import type { ThemeConfig } from '../types';

/**
 * Ant Design 6 Menu light 增量颜色。
 *
 * 只声明 MenuItem 使用且与 Atelier 默认主题不同的颜色；
 * 未声明的颜色由 `:root` 默认主题继承。
 */
export const antdLightTheme = {
  semanticTokens: {
    colors: {
      bg: {
        muted: 'rgba(0, 0, 0, 0.06)',
      },
      fg: {
        base: 'rgba(0, 0, 0, 0.88)',
        disabled: 'rgba(0, 0, 0, 0.25)',
      },
      border: {
        muted: 'rgba(5, 5, 5, 0.06)',
      },
      accent: {
        border: '#91caff',
      },
    },
  },
} satisfies ThemeConfig;

/**
 * Ant Design 6 Menu `theme="dark"` 增量颜色。
 *
 * 使用 Menu 组件的 dark 皮肤，不采用 ConfigProvider darkAlgorithm。
 * 只声明 MenuItem 使用且与 Atelier 默认主题不同的颜色；
 * 未声明的颜色由 `:root` 默认主题继承。
 */
export const antdDarkTheme = {
  semanticTokens: {
    colors: {
      bg: {
        base: '#001529',
        muted: 'transparent',
      },
      fg: {
        base: 'rgba(255, 255, 255, 0.65)',
        disabled: 'rgba(255, 255, 255, 0.25)',
      },
      border: {
        muted: 'rgba(253, 253, 253, 0.12)',
      },
      accent: {
        fg: '#ffffff',
        subtle: '#1677ff',
        border: '#91caff',
      },
    },
  },
} satisfies ThemeConfig;

/**
 * Ant Design 6 light MenuItem system。
 */
export const antdLightSystem = createTheme('antd-light', antdLightTheme);

/**
 * Ant Design 6 dark MenuItem system。
 */
export const antdDarkSystem = createTheme('antd-dark', antdDarkTheme);
