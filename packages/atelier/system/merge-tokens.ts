import { hasValue, isNil } from '@omnific/utils';

import { toCssVarName } from './css-vars';
import type { ThemeTokens } from './types';

/**
 * 合并 tokens 后的结果，含 CSS 变量表。
 */
export type MergeTokensResult = {
  /**
   * 合并后的 tokens。
   */
  tokens: ThemeTokens;
  /**
   * 已冻结的 CSS 变量表。
   */
  cssVars: Readonly<Record<string, string>>;
};

/**
 * 按传入顺序浅合并 token set，后写入覆盖同名键，并同步生成扁平 `cssVars`。
 */
export const mergeTokens = (...tokenSets: ThemeTokens[]): MergeTokensResult => {
  const tokens = {} as ThemeTokens;

  const cssVars: Record<string, string> = {};

  for (const next of tokenSets) {
    for (const category of Object.keys(next) as (keyof ThemeTokens)[]) {
      const entries = next[category];
      if (isNil(entries)) continue;

      const current = tokens[category];
      if (hasValue(current)) {
        Object.assign(current, entries);
      } else {
        tokens[category] = Object.assign({}, entries);
      }

      for (const [key, node] of Object.entries(entries)) {
        if (isNil(node)) continue;
        cssVars[toCssVarName(category, key)] = node.value;
      }
    }
  }

  return {
    tokens,
    cssVars: Object.freeze(cssVars),
  };
};
