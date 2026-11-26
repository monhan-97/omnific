import { useCallback, useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { isNil, noop } from '@omnific/utils';

import { useListCollectionContext } from './ListCollection';

/** `useListItem` 选项。 */
export type UseListItemOptions = {
  /** typeahead 标签；`undefined` 时读取 DOM 文本，`null` 表示跳过该项。 */
  label?: string | null | undefined;
};

const NO_INDEX = -1;

const getServerSnapshot = (): number => NO_INDEX;

/**
 * 将当前 item 注册到最近的 ListCollection，并返回 DOM 顺序索引。
 *
 * 不在 ListCollection 中时返回 `index: -1`。
 */
export const useListItem = <T extends HTMLElement = HTMLElement>(
  options: UseListItemOptions = {},
) => {
  const { label } = options;

  const store = useListCollectionContext();

  const nodeRef = useRef<T | null>(null);

  const subscribe = useCallback(
    (listener: () => void) => (isNil(store) ? noop : store.subscribe(listener)),
    [store],
  );

  const getSnapshot = useCallback(
    () => (isNil(store) ? NO_INDEX : store.getIndex(nodeRef.current)),
    [store],
  );

  const index = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const ref = useCallback(
    (node: T | null) => {
      nodeRef.current = node;
      if (isNil(node) || isNil(store) || index < 0) return;
      store.setLabel(index, node, label);
    },
    [index, label, store],
  );

  useLayoutEffect(() => {
    if (isNil(store)) return;

    const node = nodeRef.current;
    if (isNil(node)) return;

    store.register(node);

    return () => {
      store.unregister(node);
    };
  }, [store]);

  return { index, ref };
};
