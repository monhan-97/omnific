// @vitest-environment jsdom
import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useUpdateEffect } from '../useUpdateEffect';

afterEach(cleanup);

describe('useUpdateEffect', () => {
  it('skips the initial render and runs when dependencies change', () => {
    const effect = vi.fn();

    const { rerender } = renderHook(
      ({ value }: { value: number }) => useUpdateEffect(effect, [value]),
      { initialProps: { value: 1 } },
    );

    expect(effect).not.toHaveBeenCalled();

    rerender({ value: 2 });

    expect(effect).toHaveBeenCalledOnce();

    rerender({ value: 2 });

    expect(effect).toHaveBeenCalledOnce();
  });

  it('runs the cleanup returned by the effect before the next update', () => {
    const cleanup = vi.fn();
    const effect = vi.fn(() => cleanup);

    const { rerender } = renderHook(
      ({ value }: { value: number }) => useUpdateEffect(effect, [value]),
      { initialProps: { value: 1 } },
    );

    rerender({ value: 2 });

    expect(effect).toHaveBeenCalledOnce();

    rerender({ value: 3 });

    expect(cleanup).toHaveBeenCalledOnce();
  });
});
