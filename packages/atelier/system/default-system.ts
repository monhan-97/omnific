import { createSystem } from './create-system';
import { defaultConfig } from './defaults';

/**
 * 基于 `defaultConfig` 的共享默认 system（单例，可直接 `useTheme` / `applyCssVars`）。
 */
export const defaultSystem = createSystem(defaultConfig);
