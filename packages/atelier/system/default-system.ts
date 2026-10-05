import { createSystem } from './create-system';
import { defaultColors } from './defaults';

/**
 * 基于 `defaultColors` 的共享默认 system（单例，可直接 `useTheme` / `applyCssVars`）。
 */
export const defaultSystem = createSystem(defaultColors);
