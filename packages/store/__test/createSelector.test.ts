import { describe, expect, it, vi } from 'vitest';

import { createSelector } from '../createSelector';

const { selectAtom, useAtomValue, useEventCallback, useMemo } = vi.hoisted(() => ({
  selectAtom: vi.fn(<T, U>(targetAtom: { state: T }, selector: (state: T) => U) => ({
    read: () => selector(targetAtom.state),
    selector,
    targetAtom,
  })),
  useAtomValue: vi.fn((selectedAtom: { read: () => unknown }) => selectedAtom.read()),
  useEventCallback: vi.fn(<T extends (...arguments_: any[]) => any>(function_: T) => function_),
  useMemo: vi.fn(<T>(factory: () => T) => factory()),
}));

vi.mock('@omnific/hooks', () => ({
  useEventCallback,
}));

vi.mock('jotai', () => ({
  useAtomValue,
}));

vi.mock('jotai/utils', () => ({
  selectAtom,
}));

vi.mock('react', () => ({
  useMemo,
}));

describe('createSelector', () => {
  it('selects full state, computed values, keys, key arrays, and nested keys', () => {
    const state = {
      count: 1,
      enabled: true,
      user: {
        id: 7,
        name: 'Ada',
      },
    };
    const useSelector = createSelector<typeof state>({ state } as never);

    expect(useSelector()).toBe(state);
    expect(useSelector(current => current.count + 1)).toBe(2);
    expect(useSelector('enabled')).toBe(true);
    expect(useSelector(['count', 'enabled'])).toEqual({ count: 1, enabled: true });
    expect(useSelector('user', 'name')).toBe('Ada');
    expect(useEventCallback).toHaveBeenCalled();
    expect(useMemo).toHaveBeenCalledWith(expect.any(Function), [expect.any(Function)]);
    expect(selectAtom).toHaveBeenCalled();
    expect(useAtomValue).toHaveBeenCalled();
  });
});
