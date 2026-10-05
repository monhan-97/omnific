import { defineColors } from '../define-colors';

/**
 * 默认语义颜色。
 *
 * 颜色键使用扁平 kebab-case 语义名，运行时统一映射为 `--color-*`。
 */
export const defaultColors = defineColors({
  bg: { value: '#ffffff' },
  'bg-subtle': { value: '#fafafa' },
  'bg-muted': { value: '#f4f4f5' },
  'bg-emphasized': { value: '#e4e4e7' },
  'bg-inverted': { value: '#09090b' },
  'bg-panel': { value: '#ffffff' },
  'bg-disabled': { value: 'rgb(239 239 239)' },
  'bg-danger': { value: '#fef2f2' },
  'bg-warning': { value: '#fff7ed' },
  'bg-success': { value: '#f0fdf4' },
  'bg-info': { value: '#e6f4ff' },

  fg: { value: 'rgb(0 0 0 / 88%)' },
  'fg-muted': { value: 'rgb(0 0 0 / 45%)' },
  'fg-subtle': { value: 'rgb(0 0 0 / 25%)' },
  'fg-inverted': { value: '#ffffff' },
  'fg-disabled': { value: 'rgb(0 0 0 / 25%)' },
  'fg-danger': { value: '#ff4d4f' },
  'fg-warning': { value: '#faad14' },
  'fg-success': { value: '#52c41a' },
  'fg-info': { value: '#1677ff' },

  border: { value: '#d9d9d9' },
  'border-muted': { value: '#f0f0f0' },
  'border-subtle': { value: '#fafafa' },
  'border-emphasized': { value: '#d9d9d9' },
  'border-inverted': { value: '#434343' },
  'border-danger': { value: '#ff4d4f' },
  'border-warning': { value: '#faad14' },
  'border-success': { value: '#52c41a' },
  'border-info': { value: '#1677ff' },

  'accent-contrast': { value: '#ffffff' },
  'accent-fg': { value: '#1677ff' },
  'accent-subtle': { value: '#e6f4ff' },
  'accent-muted': { value: '#bae0ff' },
  'accent-emphasized': { value: '#69b1ff' },
  'accent-solid': { value: '#1677ff' },
  'accent-hover': { value: '#4096ff' },
  'accent-active': { value: '#0958d9' },
  'accent-focus-ring': { value: 'rgb(21 112 239 / 25%)' },
  'accent-border': { value: '#1677ff' },

  'danger-contrast': { value: '#ffffff' },
  'danger-fg': { value: '#ff4d4f' },
  'danger-subtle': { value: '#fff1f0' },
  'danger-muted': { value: '#ffccc7' },
  'danger-emphasized': { value: '#ffa39e' },
  'danger-solid': { value: '#ff4d4f' },
  'danger-hover': { value: '#ff7875' },
  'danger-active': { value: '#d9363e' },
  'danger-focus-ring': { value: 'rgb(255 77 79 / 25%)' },
  'danger-border': { value: '#ff4d4f' },

  'warning-contrast': { value: '#ffffff' },
  'warning-fg': { value: '#faad14' },
  'warning-subtle': { value: '#fff7ed' },
  'warning-muted': { value: '#ffe7ba' },
  'warning-emphasized': { value: '#ffd666' },
  'warning-solid': { value: '#faad14' },
  'warning-hover': { value: '#ffc53d' },
  'warning-active': { value: '#d48806' },
  'warning-focus-ring': { value: 'rgb(250 173 20 / 25%)' },
  'warning-border': { value: '#faad14' },

  'success-contrast': { value: '#ffffff' },
  'success-fg': { value: '#52c41a' },
  'success-subtle': { value: '#f0fdf4' },
  'success-muted': { value: '#b7eb8f' },
  'success-emphasized': { value: '#95de64' },
  'success-solid': { value: '#52c41a' },
  'success-hover': { value: '#73d13d' },
  'success-active': { value: '#389e0d' },
  'success-focus-ring': { value: 'rgb(82 196 26 / 25%)' },
  'success-border': { value: '#52c41a' },

  'info-contrast': { value: '#ffffff' },
  'info-fg': { value: '#1677ff' },
  'info-subtle': { value: '#e6f4ff' },
  'info-muted': { value: '#bae0ff' },
  'info-emphasized': { value: '#69b1ff' },
  'info-solid': { value: '#1677ff' },
  'info-hover': { value: '#4096ff' },
  'info-active': { value: '#0958d9' },
  'info-focus-ring': { value: 'rgb(21 112 239 / 25%)' },
  'info-border': { value: '#1677ff' },
});

/**
 * 默认颜色键列表。
 */
export const defaultColorKeys = Object.keys(defaultColors) as Array<keyof typeof defaultColors>;

/**
 * 默认颜色键类型。
 */
export type DefaultColorKey = (typeof defaultColorKeys)[number];
