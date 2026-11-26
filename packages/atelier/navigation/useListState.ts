import { useCallback, useEffect, useLayoutEffect, useState, useSyncExternalStore } from 'react';
import { useEventCallback, useMergedState } from '@omnific/hooks';
import { isNil, isUndefined, noop } from '@omnific/utils';

import { createListStateStore } from './ListStateStore';
import type { ListStateStore, ListStateStoreOptions } from './ListStateStore';

/** 读取列表当前 active item 索引。 */
export type ListIndexGetter = () => number | null;

/** `useListState` 选项。 */
export type UseListStateOptions = ListStateStoreOptions & {
  /** 受控选中项；传入时进入受控模式。 */
  selectedKey?: string;
  /** 非受控模式的初始选中项；缺省表示无选中项。 */
  defaultSelectedKey?: string;
  /** 用户选择 item 时的回调。 */
  onSelect?: (selectedKey: string) => void;
};

/**
 * 创建并保持一个与组件生命周期一致的列表交互状态 store。
 */
export const useListState = (options: UseListStateOptions = {}): ListStateStore => {
  const [mergedSelectedKey, setSelectedKey] = useMergedState<string | undefined>({
    defaultValue: options.defaultSelectedKey,
    value: options.selectedKey,
  });

  const [store] = useState(() =>
    createListStateStore({
      activeIndex: options.activeIndex,
      defaultSelectedKey: mergedSelectedKey,
    }),
  );

  const handleSelect = useEventCallback((nextSelectedKey: string) => {
    // 非受控模式立即同步 store，避免选中态延后到 effect 生效。
    if (isUndefined(options.selectedKey)) {
      store.setSelectedKey(nextSelectedKey);
    }

    setSelectedKey(nextSelectedKey);
    options.onSelect?.(nextSelectedKey);
  });

  useEffect(() => {
    const unsubscribe = store.subscribeSelection(handleSelect);
    return unsubscribe;
  }, [handleSelect, store]);

  // 受控值变化时在绘制前同步 store，避免选中态闪一帧。
  useLayoutEffect(() => {
    store.setSelectedKey(mergedSelectedKey);
  }, [mergedSelectedKey, store]);

  return store;
};

/**
 * 订阅 active item 索引。
 */
export const useActiveIndex = (state: ListStateStore | null): number | null => {
  const subscribe = useCallback(
    (listener: () => void) => (isNil(state) ? noop : state.subscribe(listener)),
    [state],
  );

  const getSnapshot = useCallback(() => (isNil(state) ? null : state.getActiveIndex()), [state]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};

/**
 * 订阅当前选中项。
 */
export const useSelectedKey = (state: ListStateStore | null): string | undefined => {
  const subscribe = useCallback(
    (listener: () => void) => (isNil(state) ? noop : state.subscribe(listener)),
    [state],
  );

  const getSnapshot = useCallback(
    () => (isNil(state) ? undefined : state.getSelectedKey()),
    [state],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};
