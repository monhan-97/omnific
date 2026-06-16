import { describe, expect, it, vi } from 'vitest';

import { setAtomValue } from '../setAtomValue';

const { useSetAtom } = vi.hoisted(() => ({
  useSetAtom: vi.fn(),
}));

vi.mock('jotai', () => ({
  useSetAtom,
}));

describe('setAtomValue', () => {
  it('creates a hook that returns the setter for the target atom', () => {
    const targetAtom = { debugLabel: 'app' };
    const setter = vi.fn();
    useSetAtom.mockReturnValueOnce(setter);

    const useSetAtomValue = setAtomValue(targetAtom as never);

    expect(useSetAtomValue()).toBe(setter);
    expect(useSetAtom).toHaveBeenCalledWith(targetAtom);
  });
});
