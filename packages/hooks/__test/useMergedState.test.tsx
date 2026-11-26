// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useMergedState } from '../useMergedState';

describe('useMergedState', () => {
  it('uses the default state and updates it in uncontrolled mode', () => {
    const { result } = renderHook(() => useMergedState({ defaultValue: 'initial' }));

    expect(result.current[0]).toBe('initial');

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
  });

  it('supports functional updates in uncontrolled mode', () => {
    const { result } = renderHook(() => useMergedState({ defaultValue: 1 }));

    act(() => {
      result.current[1](current => current + 1);
    });

    expect(result.current[0]).toBe(2);
  });

  it('evaluates a lazy default only once', () => {
    const initializer = vi.fn(() => 'lazy');

    const { result, rerender } = renderHook(() =>
      useMergedState({ defaultValue: initializer }),
    );

    expect(result.current[0]).toBe('lazy');

    rerender();

    expect(initializer).toHaveBeenCalledOnce();
  });

  it('uses the controlled value and ignores setter updates', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string | undefined }) =>
        useMergedState({ defaultValue: 'fallback', value }),
      { initialProps: { value: 'controlled' } },
    );

    expect(result.current[0]).toBe('controlled');

    act(() => {
      result.current[1]('ignored');
    });

    expect(result.current[0]).toBe('controlled');

    rerender({ value: 'next' });

    expect(result.current[0]).toBe('next');
  });

  it('does not evaluate a lazy default in controlled mode', () => {
    const initializer = vi.fn(() => 'lazy');

    renderHook(() => useMergedState({ defaultValue: initializer, value: 'controlled' }));

    expect(initializer).not.toHaveBeenCalled();
  });

  it('treats null as a controlled value', () => {
    const { result } = renderHook(() =>
      useMergedState<string | null>({ defaultValue: 'fallback', value: null }),
    );

    expect(result.current[0]).toBeNull();
  });
});
