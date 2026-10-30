import { hasValue, isNil, isString } from '@omnific/utils';

import { toColorVarName } from './css-vars';
import type { ColorDefinition, ThemeConfig, TokenDefinition } from './types';

const TOKEN_PREFIX = 'colors.';

/**
 * 读取 `{colors.xxx}` 形式的 token 引用，并转换为 token 表中的 key。
 */
const readReference = (value: string): string | undefined => {
  if (value.length <= 2 || !value.startsWith('{') || !value.endsWith('}')) {
    return undefined;
  }

  const reference = value.slice(1, -1);

  return reference.startsWith(TOKEN_PREFIX) ? reference.slice(TOKEN_PREFIX.length) : reference;
};

const mergeTokenDefinition = (target: Record<string, string>, source: TokenDefinition) => {
  const keys = Object.keys(source);

  for (const key of keys) {
    const value = source[key];

    if (isNil(value)) continue;

    if (isString(value)) {
      target[key] = value;
      continue;
    }

    const shades = Object.keys(value);

    for (const shade of shades) {
      const shadeValue = value[shade];

      if (isNil(shadeValue)) continue;

      target[`${key}.${shade}`] = shadeValue;
    }
  }
};

/**
 * 将语义颜色组 key 转为扁平 key。
 */
const toFlatColorKey = (group: string, key: string) => (key === 'base' ? group : `${group}-${key}`);

const mergeColorDefinition = (target: Record<string, string>, source: ColorDefinition) => {
  const groups = Object.keys(source);

  for (const group of groups) {
    const groupColors = source[group];

    if (isNil(groupColors)) continue;

    const keys = Object.keys(groupColors);

    for (const key of keys) {
      const value = groupColors[key];

      if (isNil(value)) continue;

      target[toFlatColorKey(group, key)] = value;
    }
  }
};

/**
 * 解析扁平语义颜色并生成 CSS 变量。
 */
const resolveColors = (colors: Record<string, string>, tokens: Record<string, string>) => {
  const resolvedColors: Record<string, string> = {};
  const cssVars: Record<string, string> = {};
  const flatKeys = Object.keys(colors);

  for (const flatKey of flatKeys) {
    const value = colors[flatKey];

    if (isNil(value)) continue;

    const reference = readReference(value);
    const resolvedValue = hasValue(reference) ? tokens[reference] : value;

    if (!isString(resolvedValue)) {
      throw new Error(`Unknown color token reference "{${reference}}" at "${flatKey}"`);
    }

    resolvedColors[flatKey] = resolvedValue;
    cssVars[toColorVarName(flatKey)] = resolvedValue;
  }

  return {
    colors: resolvedColors,
    cssVars,
  };
};

/**
 * 合并一个主题的配置层并返回颜色构建结果。
 *
 * `name` 由公开的 `createTheme` 或 `defaultSystem` 添加。
 * 主题切换由调用方选择不同 system 完成，不写入 ThemeConfig。
 */
export const createSystem = (...configs: ThemeConfig[]) => {
  const tokens: Record<string, string> = {};

  const colors: Record<string, string> = {};

  for (const config of configs) {
    const tokenDefinition = config.tokens?.colors;
    const colorDefinition = config.semanticTokens?.colors;

    if (hasValue(tokenDefinition)) {
      mergeTokenDefinition(tokens, tokenDefinition);
    }

    if (hasValue(colorDefinition)) {
      mergeColorDefinition(colors, colorDefinition);
    }
  }

  const resolved = resolveColors(colors, tokens);

  return {
    colors: Object.freeze(resolved.colors),
    cssVars: Object.freeze(resolved.cssVars),
  };
};
