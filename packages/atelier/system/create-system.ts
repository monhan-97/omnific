import { isString } from '@omnific/utils';

import { mergeTokens } from './merge-tokens';
import type { SystemContext, ThemeTokens } from './types';

const DEFAULT_SYSTEM_NAME = 'default';

/**
 * 合并 tokens 并返回精简版 SystemContext。
 *
 * 第一个参数可以是主题名称，也可以直接传入 ThemeTokens；省略主题名称时使用 `default`。
 */
export function createSystem(
  nameOrTokenSet: string | ThemeTokens,
  ...tokenSets: ThemeTokens[]
): SystemContext {
  const name = isString(nameOrTokenSet) ? nameOrTokenSet : DEFAULT_SYSTEM_NAME;

  const mergedTokenSets = isString(nameOrTokenSet) ? tokenSets : [nameOrTokenSet, ...tokenSets];

  const { tokens, cssVars } = mergeTokens(...mergedTokenSets);

  return {
    name,
    _config: tokens,
    cssVars,
  };
}
