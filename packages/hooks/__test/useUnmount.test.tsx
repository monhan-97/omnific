// @vitest-environment jsdom
import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useUnmount } from '../useUnmount';

afterEach(cleanup);

describe('useUnmount', () => {
  it('runs the latest callback on unmount', () => {
    const first = vi.fn();
    const second = vi.fn();

    const { rerender, unmount } = renderHook(({ fn }: { fn: () => void }) => useUnmount(fn), {
      initialProps: { fn: first },
    });

    rerender({ fn: second });
    unmount();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
  });
});
