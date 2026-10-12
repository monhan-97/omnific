import { isNil, isString } from '@omnific/utils';

import type { ColorSet } from './types';

/**
 * 将嵌套颜色配置展开为扁平 key。
 *
 * bg.base      -> bg
 * bg.muted     -> bg-muted
 * accent.solid -> accent-solid
 */
export const flattenColors = (
  colors: ColorSet,
  prefix = '',
  result: Record<string, string> = {},
): Record<string, string> => {
  const keys = Object.keys(colors);

  for (const key of keys) {
    if (isNil(key)) continue;

    const value = colors[key];
    const path = key === 'base' ? prefix : prefix ? `${prefix}-${key}` : key;

    if (isString(value)) {
      result[path] = value;
      continue;
    }

    if (isNil(value)) continue;

    flattenColors(value, path, result);
  }

  return result;
};
