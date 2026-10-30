import type { ColorDefinition } from '../types';

/**
 * Atelier 默认语义颜色。
 */
export const defaultColors = {
  bg: {
    base: '{colors.white}',
    subtle: '{colors.gray.50}',
    muted: '{colors.gray.100}',
    emphasized: '{colors.gray.200}',
    inverted: '{colors.black}',
    panel: '{colors.white}',
    disabled: 'rgb(239 239 239)',
    danger: '{colors.danger.25}',
    warning: '{colors.warning.50}',
    success: '{colors.success.50}',
    info: '{colors.info.50}',
  },

  fg: {
    base: 'rgb(0 0 0 / 88%)',
    muted: 'rgb(0 0 0 / 45%)',
    subtle: 'rgb(0 0 0 / 25%)',
    inverted: '{colors.white}',
    disabled: 'rgb(0 0 0 / 25%)',
    danger: '{colors.danger.400}',
    warning: '{colors.warning.400}',
    success: '{colors.success.400}',
    info: '{colors.info.500}',
  },

  border: {
    base: '#d9d9d9',
    muted: '#f0f0f0',
    subtle: '#fafafa',
    emphasized: '#d9d9d9',
    inverted: '#434343',
    danger: '{colors.danger.400}',
    warning: '{colors.warning.400}',
    success: '{colors.success.400}',
    info: '{colors.info.500}',
  },

  accent: {
    contrast: '{colors.white}',
    fg: '{colors.accent.500}',
    subtle: '{colors.accent.50}',
    muted: '{colors.accent.100}',
    emphasized: '{colors.accent.200}',
    solid: '{colors.accent.500}',
    hover: '{colors.accent.400}',
    active: '{colors.accent.600}',
    'focus-ring': 'rgb(21 112 239 / 25%)',
    border: '{colors.accent.500}',
  },

  danger: {
    contrast: '{colors.white}',
    fg: '{colors.danger.400}',
    subtle: '{colors.danger.50}',
    muted: '{colors.danger.100}',
    emphasized: '{colors.danger.200}',
    solid: '{colors.danger.400}',
    hover: '{colors.danger.300}',
    active: '{colors.danger.500}',
    'focus-ring': 'rgb(255 77 79 / 25%)',
    border: '{colors.danger.400}',
  },

  warning: {
    contrast: '{colors.white}',
    fg: '{colors.warning.400}',
    subtle: '{colors.warning.50}',
    muted: '{colors.warning.100}',
    emphasized: '{colors.warning.200}',
    solid: '{colors.warning.400}',
    hover: '{colors.warning.300}',
    active: '{colors.warning.500}',
    'focus-ring': 'rgb(250 173 20 / 25%)',
    border: '{colors.warning.400}',
  },

  success: {
    contrast: '{colors.white}',
    fg: '{colors.success.400}',
    subtle: '{colors.success.50}',
    muted: '{colors.success.100}',
    emphasized: '{colors.success.200}',
    solid: '{colors.success.400}',
    hover: '{colors.success.300}',
    active: '{colors.success.500}',
    'focus-ring': 'rgb(82 196 26 / 25%)',
    border: '{colors.success.400}',
  },

  info: {
    contrast: '{colors.white}',
    fg: '{colors.info.500}',
    subtle: '{colors.info.50}',
    muted: '{colors.info.100}',
    emphasized: '{colors.info.200}',
    solid: '{colors.info.500}',
    hover: '{colors.info.400}',
    active: '{colors.info.600}',
    'focus-ring': 'rgb(21 112 239 / 25%)',
    border: '{colors.info.500}',
  },
} satisfies ColorDefinition;
