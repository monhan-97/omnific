// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react';
import type { MouseEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

import type { ListStateStore } from '../ListStateStore';
import { useListState } from '../useListState';

const clickEvent = {} as MouseEvent<HTMLElement>;

describe('useListState', () => {
  it('updates the store before onSelect in uncontrolled mode', () => {
    const storeRef: { current: ListStateStore | null } = { current: null };

    const onSelect = vi.fn(() => {
      expect(storeRef.current?.getSelectedKey()).toBe('two');
    });

    const { result } = renderHook(() => {
      const store = useListState({ defaultSelectedKey: 'one', onSelect });
      storeRef.current = store;
      return store;
    });

    act(() => {
      result.current.getItemProps(1, { value: 'two' }).onClick?.(clickEvent);
    });

    expect(onSelect).toHaveBeenCalledWith('two');
    expect(result.current.getSelectedKey()).toBe('two');
  });

  it('keeps controlled selection unchanged until selectedKey updates', () => {
    const storeRef: { current: ListStateStore | null } = { current: null };

    const onSelect = vi.fn(() => {
      expect(storeRef.current?.getSelectedKey()).toBe('one');
    });

    const { result, rerender } = renderHook(
      ({ selectedKey }: { selectedKey: string }) => {
        const store = useListState({ onSelect, selectedKey });
        storeRef.current = store;
        return store;
      },
      { initialProps: { selectedKey: 'one' } },
    );

    act(() => {
      result.current.getItemProps(1, { value: 'two' }).onClick?.(clickEvent);
    });

    expect(onSelect).toHaveBeenCalledWith('two');
    expect(result.current.getSelectedKey()).toBe('one');

    rerender({ selectedKey: 'two' });

    expect(result.current.getSelectedKey()).toBe('two');
  });
});
