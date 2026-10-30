import { createSystem } from './create-system';
import { defaultTheme } from './default-theme';

/**
 * 基于 `defaultTheme` 的默认颜色构建结果，供默认 CSS 与主题构建使用。
 */
export const defaultSystem = createSystem(defaultTheme);
