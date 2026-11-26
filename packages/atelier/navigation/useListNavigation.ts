import { useRef } from 'react';
import type {
  FocusEvent,
  FocusEventHandler,
  KeyboardEvent,
  MouseEventHandler,
} from 'react';
import { useEventCallback } from '@omnific/hooks';
import { hasValue, isFunction, isNil } from '@omnific/utils';

import {
  findEnabledIndex,
  getMaxEnabledIndex,
  getMinEnabledIndex,
  isBackwardKey,
  isForwardKey,
  isIndexAvailable,
  shouldSkipKeyboardEvent,
} from './utils';
import type { ListIndexGetter } from './useListState';
import type {
  DisabledIndices,
  ListElementGetter,
  ListNavigationOrientation,
  ListSizeGetter,
} from './utils';

/** `useListNavigation` 选项。 */
export type UseListNavigationOptions = {
  /** 读取当前 active item 索引。 */
  getActiveIndex: ListIndexGetter;
  /** 按索引读取列表节点。 */
  getElement: ListElementGetter;
  /** 返回当前列表节点数量。 */
  getSize: ListSizeGetter;
  /** active item 变化时回调。 */
  onNavigate?: (index: number | null) => void;
  /** 是否启用导航，默认 `true`。 */
  enabled?: boolean;
  /** 导航方向，默认 `vertical`。 */
  orientation?: ListNavigationOrientation;
  /** 到达边界后是否循环，默认 `false`。 */
  loop?: boolean;
  /** 不可聚焦的索引；传入后覆盖 DOM `disabled` / `aria-disabled` 的默认判断。 */
  disabledIndices?: DisabledIndices;
};

/** `useListNavigation` 返回的 item props。 */
export type ListNavigationItemProps = {
  onFocus: FocusEventHandler<HTMLElement>;
  onClick: MouseEventHandler<HTMLElement>;
};

/**
 * 为列表提供 roving tabindex 风格的方向键导航。
 *
 * 与 Floating UI 的同名 hook 保持核心选项与行为一致，但不包含浮层打开、
 * virtual focus、网格和嵌套菜单逻辑。
 */
export const useListNavigation = (options: UseListNavigationOptions) => {
  const {
    disabledIndices,
    enabled = true,
    getActiveIndex,
    getElement,
    getSize,
    loop = false,
    onNavigate,
    orientation = 'vertical',
  } = options;

  // 用 ref 记录本次交互已知的索引，避免 focus 事件重复触发 onNavigate。
  const indexRef = useRef<number | null>(getActiveIndex());

  const readCurrentIndex = (): number | null => {
    const current = getActiveIndex();
    indexRef.current = current;
    return current;
  };

  const focusIndex = useEventCallback((index: number): boolean => {
    const element = getElement(index);
    if (isNil(element)) return false;

    element.focus({ preventScroll: true });
    return true;
  });

  const scrollIndexIntoView = (index: number) => {
    const element = getElement(index);
    if (isNil(element)) return;

    if (isFunction(element.scrollIntoView)) {
      element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  };

  const syncIndex = (index: number) => {
    if (indexRef.current === index) return;

    indexRef.current = index;
    onNavigate?.(index);
  };

  const navigateTo = (index: number) => {
    syncIndex(index);

    if (focusIndex(index)) {
      scrollIndexIntoView(index);
    }
  };

  const handleKeyDown = useEventCallback((event: KeyboardEvent<HTMLElement>) => {
    if (!enabled || shouldSkipKeyboardEvent(event)) return;

    const currentIndex = readCurrentIndex() ?? -1;
    const minIndex = getMinEnabledIndex(getElement, getSize, disabledIndices);
    if (minIndex < 0) return;

    const maxIndex = getMaxEnabledIndex(getElement, getSize, disabledIndices);
    if (maxIndex < 0) return;

    let nextIndex: number | null = null;

    if (event.key === 'Home') {
      nextIndex = minIndex;
    } else if (event.key === 'End') {
      nextIndex = maxIndex;
    } else if (isForwardKey(event.key, orientation)) {
      if (currentIndex >= maxIndex) {
        nextIndex = loop ? minIndex : maxIndex;
      } else {
        const foundIndex = findEnabledIndex(getElement, getSize, disabledIndices, currentIndex);
        nextIndex = loop ? foundIndex : Math.min(maxIndex, foundIndex);
      }
    } else if (isBackwardKey(event.key, orientation)) {
      if (currentIndex <= minIndex) {
        nextIndex = loop ? maxIndex : minIndex;
      } else {
        const foundIndex = findEnabledIndex(getElement, getSize, disabledIndices, currentIndex, true);
        nextIndex = loop ? foundIndex : Math.max(minIndex, foundIndex);
      }
    }

    if (isNil(nextIndex)) return;

    // 外部 activeIndex 可能越界；统一收敛到当前可用范围。
    const targetIndex = Math.min(maxIndex, Math.max(minIndex, nextIndex));

    event.preventDefault();
    navigateTo(targetIndex);
  });

  const handleContainerFocus = useEventCallback((event: FocusEvent<HTMLElement>) => {
    // item 的 focus 由调用方通过 getItemProps 同步；这里只处理容器自身获得焦点的情况。
    if (!enabled || event.target !== event.currentTarget) return;

    const current = readCurrentIndex();
    const targetIndex =
      hasValue(current) && isIndexAvailable(getElement, getSize, current, disabledIndices)
        ? current
        : getMinEnabledIndex(getElement, getSize, disabledIndices);

    if (targetIndex < 0) return;

    navigateTo(targetIndex);
  });

  const getItemProps = useEventCallback((index: number): ListNavigationItemProps => ({
    onFocus: () => syncIndex(index),
    onClick: () => syncIndex(index),
  }));

  return {
    focusIndex,
    getItemProps,
    onFocus: handleContainerFocus,
    onKeyDown: handleKeyDown,
  };
};
