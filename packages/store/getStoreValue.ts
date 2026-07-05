import { getDefaultStore } from 'jotai';

import type { ImmerAtom } from './createAtom';

/**
 * 从 Jotai 默认 store 中读取 atom 当前值。
 */
export const getStoreValue = <T>(targetAtom: ImmerAtom<T>): T => {
  return getDefaultStore().get(targetAtom);
};
