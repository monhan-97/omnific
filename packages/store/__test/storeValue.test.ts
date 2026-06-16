import { getDefaultStore } from 'jotai';
import { describe, expect, it } from 'vitest';

import { createAtom } from '../createAtom';
import { getStoreValue } from '../getStoreValue';
import { setStoreValue } from '../setStoreValue';

describe('store value helpers', () => {
  it('gets and sets atom values through the default store', () => {
    const userAtom = createAtom({
      count: 0,
      user: {
        name: 'Ada',
      },
    });

    expect(getStoreValue(userAtom)).toEqual({
      count: 0,
      user: {
        name: 'Ada',
      },
    });

    setStoreValue(userAtom, draft => {
      draft.count += 1;
      draft.user.name = 'Grace';
    });

    expect(getStoreValue(userAtom)).toEqual({
      count: 1,
      user: {
        name: 'Grace',
      },
    });

    setStoreValue(userAtom, {
      count: 2,
      user: {
        name: 'Lin',
      },
    });

    expect(getStoreValue(userAtom)).toEqual({
      count: 2,
      user: {
        name: 'Lin',
      },
    });
  });

  it('uses the same default store for get and set helpers', () => {
    const defaultStore = getDefaultStore();
    const userAtom = createAtom({
      count: 0,
    });

    expect(getDefaultStore()).toBe(defaultStore);

    setStoreValue(userAtom, {
      count: 3,
    });

    expect(defaultStore.get(userAtom)).toEqual({
      count: 3,
    });

    defaultStore.set(userAtom, {
      count: 4,
    });

    expect(getStoreValue(userAtom)).toEqual({
      count: 4,
    });
  });
});
