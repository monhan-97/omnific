import { isNil } from '@omnific/utils';

import { toColorVarName } from './css-vars';
import { flattenColors } from './flatten-colors';
import type { ColorSet, FlatColorSet } from './types';

/**
 * 展开并合并嵌套颜色表，输出扁平颜色和 CSS 变量。
 *
 * 后传入的颜色覆盖前面同名 key。
 */
export const mergeColors = (...colorSets: ColorSet[]) => {
  const colors: FlatColorSet = {};

  for (const colorSet of colorSets) {
    if (isNil(colorSet)) continue;

    Object.assign(colors, flattenColors(colorSet));
  }

  const colorKeys = Object.keys(colors);

  const cssVars: Record<string, string> = {};

  for (const key of colorKeys) {
    if (isNil(key)) continue;

    const value = colors[key];

    if (isNil(value)) continue;

    cssVars[toColorVarName(key)] = value;
  }

  return {
    colors,
    cssVars: Object.freeze(cssVars),
  };
};
