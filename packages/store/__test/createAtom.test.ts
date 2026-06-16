import { createStore } from 'jotai/vanilla';
import { describe, expect, it } from 'vitest';

import { createAtom } from '../createAtom';

describe('createAtom', () => {
  it('creates an immer writable atom that accepts draft updates and replacements', () => {
    const userAtom = createAtom({
      count: 0,
      user: {
        name: 'Ada',
      },
    });
    const store = createStore();

    expect(store.get(userAtom)).toEqual({
      count: 0,
      user: {
        name: 'Ada',
      },
    });

    store.set(userAtom, draft => {
      draft.count += 1;
      draft.user.name = 'Grace';
    });

    expect(store.get(userAtom)).toEqual({
      count: 1,
      user: {
        name: 'Grace',
      },
    });

    store.set(userAtom, {
      count: 2,
      user: {
        name: 'Lin',
      },
    });

    expect(store.get(userAtom)).toEqual({
      count: 2,
      user: {
        name: 'Lin',
      },
    });
  });
});
