import { useSetAtom } from 'jotai';
import type { WritableAtom } from 'jotai';

import type { AtomSetterArguments } from './createAtom';

/**
 * 创建用于更新指定可写 atom 的 React hook。
 */
export const setAtomValue = <T>(targetAtom: WritableAtom<T, AtomSetterArguments<T>, void>) => {
  function useSetAtomValue() {
    return useSetAtom(targetAtom);
  }
  return useSetAtomValue;
};
