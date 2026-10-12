import { defineColors } from '../define-colors';

/**
 * 默认语义颜色。
 *
 * 分组内使用 base 表示当前分组自己的颜色。
 */
export const defaultColors = defineColors({
  bg: {
    base: '#ffffff',
    subtle: '#fafafa',
    muted: '#f4f4f5',
    emphasized: '#e4e4e7',
    inverted: '#09090b',
    panel: '#ffffff',
    disabled: 'rgb(239 239 239)',
    danger: '#fef2f2',
    warning: '#fff7ed',
    success: '#f0fdf4',
    info: '#e6f4ff',
  },

  fg: {
    base: 'rgb(0 0 0 / 88%)',
    muted: 'rgb(0 0 0 / 45%)',
    subtle: 'rgb(0 0 0 / 25%)',
    inverted: '#ffffff',
    disabled: 'rgb(0 0 0 / 25%)',
    danger: '#ff4d4f',
    warning: '#faad14',
    success: '#52c41a',
    info: '#1677ff',
  },

  border: {
    base: '#d9d9d9',
    muted: '#f0f0f0',
    subtle: '#fafafa',
    emphasized: '#d9d9d9',
    inverted: '#434343',
    danger: '#ff4d4f',
    warning: '#faad14',
    success: '#52c41a',
    info: '#1677ff',
  },

  accent: {
    contrast: '#ffffff',
    fg: '#1677ff',
    subtle: '#e6f4ff',
    muted: '#bae0ff',
    emphasized: '#69b1ff',
    solid: '#1677ff',
    hover: '#4096ff',
    active: '#0958d9',
    'focus-ring': 'rgb(21 112 239 / 25%)',
    border: '#1677ff',
  },

  danger: {
    contrast: '#ffffff',
    fg: '#ff4d4f',
    subtle: '#fff1f0',
    muted: '#ffccc7',
    emphasized: '#ffa39e',
    solid: '#ff4d4f',
    hover: '#ff7875',
    active: '#d9363e',
    'focus-ring': 'rgb(255 77 79 / 25%)',
    border: '#ff4d4f',
  },

  warning: {
    contrast: '#ffffff',
    fg: '#faad14',
    subtle: '#fff7ed',
    muted: '#ffe7ba',
    emphasized: '#ffd666',
    solid: '#faad14',
    hover: '#ffc53d',
    active: '#d48806',
    'focus-ring': 'rgb(250 173 20 / 25%)',
    border: '#faad14',
  },

  success: {
    contrast: '#ffffff',
    fg: '#52c41a',
    subtle: '#f0fdf4',
    muted: '#b7eb8f',
    emphasized: '#95de64',
    solid: '#52c41a',
    hover: '#73d13d',
    active: '#389e0d',
    'focus-ring': 'rgb(82 196 26 / 25%)',
    border: '#52c41a',
  },

  info: {
    contrast: '#ffffff',
    fg: '#1677ff',
    subtle: '#e6f4ff',
    muted: '#bae0ff',
    emphasized: '#69b1ff',
    solid: '#1677ff',
    hover: '#4096ff',
    active: '#0958d9',
    'focus-ring': 'rgb(21 112 239 / 25%)',
    border: '#1677ff',
  },
});
