import { createSystem } from './create-system';
import type { SystemContext, ThemeConfig } from './types';

/**
 * 创建主题 system。
 *
 * `cssVars` 只包含传入配置解析出的颜色变量，不会被 `defaultTheme`
 * 自动补齐；未声明的变量由 `dist/styles.css` 的 `:root` 默认值
 * 或祖先作用域提供。
 *
 * @example
 * const appSystem = createTheme('app', {
 *   semanticTokens: { colors: { accent: { solid: '#7c3aed' } } },
 * });
 */
export const createTheme = (name: string, ...overrides: ThemeConfig[]): SystemContext => {
  const system = createSystem(...overrides);

  return {
    name,
    cssVars: system.cssVars,
  };
};
