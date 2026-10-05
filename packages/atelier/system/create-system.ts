import { isString } from '@omnific/utils';

import { mergeColors } from './merge-colors';
import type { ColorSet } from './types';

const DEFAULT_SYSTEM_NAME = 'default';

/**
 * 合并扁平颜色表并返回 system 实例。
 *
 * 第一个参数可以是主题名称，也可以直接传入扁平颜色表；
 * 省略主题名称时使用 `default`。
 */
export function createSystem(nameOrColors: string | ColorSet, ...colorSets: ColorSet[]) {
  const name = isString(nameOrColors) ? nameOrColors : DEFAULT_SYSTEM_NAME;
  const mergedColorSets = isString(nameOrColors) ? colorSets : [nameOrColors, ...colorSets];

  const { colors, cssVars } = mergeColors(...mergedColorSets);

  return {
    name,
    colors,
    cssVars,
  };
}
