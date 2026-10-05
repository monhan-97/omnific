import { isNil } from '@omnific/utils';

import { toColorVarName } from './css-vars';
import type { ColorSet } from './types';

/**
 * 按传入顺序浅合并扁平颜色表，后写入覆盖同名键，并生成颜色 CSS 变量。
 */
export const mergeColors = (...colorSets: ColorSet[]) => {
  const colors: ColorSet = {};
  const cssVars: Record<string, string> = {};

  for (const next of colorSets) {
    for (const [key, node] of Object.entries(next)) {
      if (isNil(node)) continue;

      colors[key] = node;
      cssVars[toColorVarName(key)] = node.value;
    }
  }

  return {
    colors,
    cssVars: Object.freeze(cssVars),
  };
};
