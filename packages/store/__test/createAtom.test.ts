import { createStore } from 'jotai/vanilla';
import { describe, expect, it } from 'vitest';

import { createAtom } from '../createAtom';

describe('createAtom', () => {
  it('creates a draft atom that accepts draft updates and replacements', () => {
    const userAtom = createAtom({
      count: 0,
      items: [0],
      user: {
        name: 'Ada',
      },
    });
    const store = createStore();

    expect(store.get(userAtom)).toEqual({
      count: 0,
      items: [0],
      user: {
        name: 'Ada',
      },
    });

    const initialState = store.get(userAtom);

    store.set(userAtom, draft => {
      draft.count += 1;
      draft.items.push(1, 2);
      draft.user.name = 'Grace';
    });

    expect(initialState).toEqual({
      count: 0,
      items: [0],
      user: {
        name: 'Ada',
      },
    });
    expect(store.get(userAtom)).toEqual({
      count: 1,
      items: [0, 1, 2],
      user: {
        name: 'Grace',
      },
    });

    const mutatedState = store.get(userAtom);
    store.set(userAtom, () => {});

    expect(store.get(userAtom)).toBe(mutatedState);

    expect(() => {
      store.set(userAtom, draft => {
        draft.count = 100;
        throw new Error('planned failure');
      });
    }).toThrow('planned failure');
    expect(store.get(userAtom)).toBe(mutatedState);

    const replacementState = {
      count: 2,
      items: [3],
      user: {
        name: 'Lin',
      },
    };

    store.set(userAtom, replacementState);

    expect(store.get(userAtom)).toBe(replacementState);
    expect(store.get(userAtom)).toEqual({
      count: 2,
      items: [3],
      user: {
        name: 'Lin',
      },
    });
  });

  it('supports primitive value replacement', () => {
    const countAtom = createAtom(0);
    const store = createStore();

    store.set(countAtom, 2);

    expect(store.get(countAtom)).toBe(2);
  });

  it('supports array root draft updates', () => {
    const itemsAtom = createAtom([0]);
    const store = createStore();

    store.set(itemsAtom, draft => {
      draft.push(1, 2);
    });

    expect(store.get(itemsAtom)).toEqual([0, 1, 2]);

    store.set(itemsAtom, [3]);

    expect(store.get(itemsAtom)).toEqual([3]);
  });
});
