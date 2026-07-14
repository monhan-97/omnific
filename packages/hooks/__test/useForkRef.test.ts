 
/* eslint-disable unicorn/no-null -- React ref 的空值语义是 null。 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setRef as setReference, useForkRef as useForkReference } from '../useForkRef';

const { useMemo } = vi.hoisted(() => ({
  useMemo: vi.fn((factory: () => unknown) => factory()),
}));

vi.mock('react', () => ({ useMemo }));

describe('setRef', () => {
  it('sets callback and object refs', () => {
    const callbackReference = vi.fn();
    const objectReference = { current: null as { id: number } | null };
    const instance = { id: 1 };

    setReference(callbackReference, instance);
    setReference(objectReference, instance);

    expect(callbackReference).toHaveBeenCalledWith(instance);
    expect(objectReference.current).toBe(instance);
  });

  it('ignores an undefined ref', () => {
    expect(() => setReference(undefined, null)).not.toThrow();
  });
});

describe('useForkRef', () => {
  beforeEach(() => {
    useMemo.mockClear();
  });

  it('returns undefined when every ref is missing', () => {
    expect(useForkReference(undefined, null)).toBeUndefined();
  });

  it('updates every supplied ref', () => {
    const callbackReference = vi.fn();
    const objectReference = { current: null as { id: number } | null };
    const instance = { id: 1 };

    useForkReference(callbackReference, objectReference)?.(instance);

    expect(callbackReference).toHaveBeenCalledWith(instance);
    expect(objectReference.current).toBe(instance);
  });

  it('memoizes the merged ref with the refs as dependencies', () => {
    const firstReference = vi.fn();
    const secondReference = { current: null };

    useForkReference(firstReference, secondReference);

    expect(useMemo).toHaveBeenCalledWith(expect.any(Function), [firstReference, secondReference]);
  });
});
