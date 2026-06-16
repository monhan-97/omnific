import { useSetAtom } from 'jotai';
import type { WritableAtom } from 'jotai';

import type { AtomSetterArgs } from './createAtom';

export const setAtomValue = <T>(targetAtom: WritableAtom<T, AtomSetterArgs<T>, void>) => {
  function useSetAtomValue() {
    return useSetAtom(targetAtom);
  }
  return useSetAtomValue;
};
