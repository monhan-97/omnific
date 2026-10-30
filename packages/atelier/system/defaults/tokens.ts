import type { TokenDefinition } from '../types';

/**
 * Atelier 默认 primitive 颜色。
 *
 * 首期只声明默认语义颜色实际引用的色阶；新增角色时再补充对应 token。
 */
export const defaultTokens = {
  white: '#ffffff',
  black: '#09090b',

  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
  },

  accent: {
    50: '#e6f4ff',
    100: '#bae0ff',
    200: '#69b1ff',
    400: '#4096ff',
    500: '#1677ff',
    600: '#0958d9',
  },

  danger: {
    25: '#fef2f2',
    50: '#fff1f0',
    100: '#ffccc7',
    200: '#ffa39e',
    300: '#ff7875',
    400: '#ff4d4f',
    500: '#d9363e',
  },

  warning: {
    50: '#fff7ed',
    100: '#ffe7ba',
    200: '#ffd666',
    300: '#ffc53d',
    400: '#faad14',
    500: '#d48806',
  },

  success: {
    50: '#f0fdf4',
    100: '#b7eb8f',
    200: '#95de64',
    300: '#73d13d',
    400: '#52c41a',
    500: '#389e0d',
  },

  info: {
    50: '#e6f4ff',
    100: '#bae0ff',
    200: '#69b1ff',
    400: '#4096ff',
    500: '#1677ff',
    600: '#0958d9',
  },
} satisfies TokenDefinition;
