import type { FocusEvent, MouseEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { createListStateStore } from '../ListStateStore';

const focusEvent = {} as FocusEvent<HTMLElement>;
const clickEvent = {} as MouseEvent<HTMLElement>;

describe('createListStateStore', () => {
  it('activates an item before calling user focus and click handlers', () => {
    const store = createListStateStore();
    const onFocus = vi.fn(() => {
      expect(store.getActiveIndex()).toBe(1);
    });
    const onClick = vi.fn(() => {
      expect(store.getActiveIndex()).toBe(1);
    });

    const itemProps = store.getItemProps(1, { onFocus, onClick });

    itemProps.onFocus?.(focusEvent);
    expect(onFocus).toHaveBeenCalledOnce();

    itemProps.onClick?.(clickEvent);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('returns user props unchanged for an invalid index', () => {
    const store = createListStateStore();
    const onClick = vi.fn();

    const itemProps = store.getItemProps(-1, { onClick });

    expect(itemProps.onClick).toBe(onClick);
    expect(store.getActiveIndex()).toBeNull();
  });

  it('initializes the selected key from defaultSelectedKey', () => {
    const store = createListStateStore({ defaultSelectedKey: 'one' });

    expect(store.getSelectedKey()).toBe('one');
  });

  it('emits item selection without mutating the selected key', () => {
    const store = createListStateStore();
    const onSelect = vi.fn();

    store.subscribeSelection(onSelect);

    expect(store.getSelectedKey()).toBeUndefined();

    const itemProps = store.getItemProps(1, { value: 'two' });

    itemProps.onClick?.(clickEvent);

    expect(store.getSelectedKey()).toBeUndefined();
    expect(onSelect).toHaveBeenCalledWith('two');
  });

  it('updates the selected key through setSelectedKey', () => {
    const store = createListStateStore();
    const onChange = vi.fn();

    store.subscribe(onChange);
    store.setSelectedKey('one');

    expect(store.getSelectedKey()).toBe('one');
    expect(onChange).toHaveBeenCalledOnce();

    store.setSelectedKey(undefined);

    expect(store.getSelectedKey()).toBeUndefined();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('does not emit selection for the current item', () => {
    const store = createListStateStore();
    const onSelect = vi.fn();

    store.subscribeSelection(onSelect);
    store.setSelectedKey('one');

    const itemProps = store.getItemProps(0, { value: 'one' });

    itemProps.onClick?.(clickEvent);

    expect(onSelect).not.toHaveBeenCalled();
  });

});
