import { getDefaultStore } from 'jotai';

import type { ImmerAtom } from './createAtom';

export const getStoreValue = <T>(targetAtom: ImmerAtom<T>): T => {
  return getDefaultStore().get(targetAtom);
};
