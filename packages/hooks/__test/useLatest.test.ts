import { describe, expect, it, vi } from 'vitest';

import { useLatest } from '../useLatest';

const { useRef } = vi.hoisted(() => ({
  useRef: vi.fn(),
}));

vi.mock('react', () => ({
  useRef,
}));

describe('useLatest', () => {
  it('returns the ref and keeps current synced to the latest value', () => {
    const ref = { current: 'initial' };
    useRef.mockReturnValueOnce(ref);

    const result = useLatest('latest');

    expect(result).toBe(ref);
    expect(result.current).toBe('latest');
    expect(useRef).toHaveBeenCalledWith('latest');
  });
});
