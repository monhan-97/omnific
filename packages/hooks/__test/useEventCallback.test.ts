import { describe, expect, it, vi } from 'vitest';

import { useEventCallback } from '../useEventCallback';

const { latestRef, useCallback, useRef } = vi.hoisted(() => ({
  latestRef: { current: undefined as unknown },
  useCallback: vi.fn((fn: (...args: unknown[]) => unknown) => fn),
  useRef: vi.fn(),
}));

vi.mock('react', () => ({
  useCallback,
  useRef,
}));

describe('useEventCallback', () => {
  it('returns a stable callback that invokes the latest function ref', () => {
    useRef.mockReturnValue(latestRef);
    const first = vi.fn((value: number) => value + 1);
    const second = vi.fn((value: number) => value + 2);

    const callback = useEventCallback(first);

    expect(callback(1)).toBe(2);

    useEventCallback(second);

    expect(callback(1)).toBe(3);
    expect(first).toHaveBeenCalledOnce();
    expect(second).toHaveBeenCalledOnce();
    expect(useCallback).toHaveBeenCalledWith(expect.any(Function), []);
  });
});
