import type { TokenCategory } from '../types';

/**
 * 默认语义色。
 *
 * 控件品牌色与灰阶对齐 Atelier 既有 Button 主题（Ant Design 色值）；
 * `bg` / `fg` / `border` 角色名保留，便于组件与业务扩展。
 */
export const colors = {
  bg: { value: '#ffffff' },
  'bg.subtle': { value: '#fafafa' },
  'bg.muted': { value: '#f4f4f5' },
  'bg.emphasized': { value: '#e4e4e7' },
  'bg.inverted': { value: '#09090b' },
  'bg.panel': { value: '#ffffff' },
  'bg.disabled': { value: 'rgb(239 239 239)' },
  'bg.error': { value: '#fef2f2' },
  'bg.warning': { value: '#fff7ed' },
  'bg.success': { value: '#f0fdf4' },
  'bg.info': { value: '#e6f4ff' },

  fg: { value: 'rgb(0 0 0 / 88%)' },
  'fg.muted': { value: 'rgb(0 0 0 / 45%)' },
  'fg.subtle': { value: 'rgb(0 0 0 / 25%)' },
  'fg.inverted': { value: '#ffffff' },
  'fg.disabled': { value: 'rgb(0 0 0 / 25%)' },
  'fg.error': { value: '#ff4d4f' },
  'fg.warning': { value: '#faad14' },
  'fg.success': { value: '#52c41a' },
  'fg.info': { value: '#1677ff' },

  border: { value: '#d9d9d9' },
  'border.muted': { value: '#f0f0f0' },
  'border.subtle': { value: '#fafafa' },
  'border.emphasized': { value: '#d9d9d9' },
  'border.inverted': { value: '#434343' },
  'border.error': { value: '#ff4d4f' },
  'border.warning': { value: '#faad14' },
  'border.success': { value: '#52c41a' },
  'border.info': { value: '#1677ff' },

  'gray.contrast': { value: '#ffffff' },
  'gray.fg': { value: 'rgb(0 0 0 / 88%)' },
  'gray.subtle': { value: '#fafafa' },
  'gray.muted': { value: '#f5f5f5' },
  'gray.emphasized': { value: '#d9d9d9' },
  'gray.solid': { value: '#1f1f1f' },
  'gray.focus-ring': { value: 'rgb(0 0 0 / 15%)' },
  'gray.border': { value: '#d9d9d9' },

  'blue.contrast': { value: '#ffffff' },
  'blue.fg': { value: '#1677ff' },
  'blue.subtle': { value: '#e6f4ff' },
  'blue.muted': { value: '#bae0ff' },
  'blue.emphasized': { value: '#69b1ff' },
  'blue.solid': { value: '#1677ff' },
  'blue.hover': { value: '#4096ff' },
  'blue.active': { value: '#0958d9' },
  'blue.focus-ring': { value: 'rgb(21 112 239 / 25%)' },
  'blue.border': { value: '#1677ff' },

  'red.contrast': { value: '#ffffff' },
  'red.fg': { value: '#ff4d4f' },
  'red.subtle': { value: '#fff1f0' },
  'red.muted': { value: '#ffccc7' },
  'red.emphasized': { value: '#ffa39e' },
  'red.solid': { value: '#ff4d4f' },
  'red.hover': { value: '#ff7875' },
  'red.active': { value: '#d9363e' },
  'red.focus-ring': { value: 'rgb(255 77 79 / 25%)' },
  'red.border': { value: '#ff4d4f' },
} as const satisfies TokenCategory;
