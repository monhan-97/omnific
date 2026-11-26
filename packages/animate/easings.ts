/**
 * 命名缓动 → WAAPI `easing` 字符串。
 */
export const supportedWaapiEasing = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  circIn: 'cubic-bezier(0, 0.55, 0.45, 1)',
  circOut: 'cubic-bezier(0.55, 0, 1, 0.45)',
  circInOut: 'cubic-bezier(0.85, 0, 0.15, 1)',
  backIn: 'cubic-bezier(0.31, 0.01, 0.66, -0.59)',
  backOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  backInOut: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
} as const;

/**
 * 支持的命名缓动。
 */
export type Easing = keyof typeof supportedWaapiEasing;
