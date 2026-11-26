import type { FocusEvent, MouseEvent } from 'react';
import { createChainedFunction, createEmitter, hasValue } from '@omnific/utils';

import type { InteractionProps } from './useInteractions';

/** ListStateStore 初始化选项。 */
export type ListStateStoreOptions = {
  /** 初始 active item 索引。 */
  activeIndex?: number;
  /** 初始化选中项，只在创建 store 时读取一次。 */
  defaultSelectedKey?: string;
};

/** `ListStateStore.getItemProps` 的 item 属性。 */
export type ListStateItemProps = InteractionProps & {
  /** item 的唯一值；缺省时不参与选中。 */
  value?: string;
};

/**
 * 创建列表交互状态 store。
 *
 * 与 ListCollectionStore 分开：
 * - ListCollectionStore 负责 DOM 顺序、索引和标签。
 * - ListStateStore 负责保存 active item 与选中项；受控/非受控策略由 useListState 决定。
 */
export const createListStateStore = (options: ListStateStoreOptions = {}) => {
  let activeIndex = options.activeIndex ?? null;

  let selectedKey = options.defaultSelectedKey;

  const { subscribe, emit } = createEmitter();
  const { subscribe: subscribeSelection, emit: emitSelection } = createEmitter<string>();

  const getActiveIndex = () => activeIndex;

  const getSelectedKey = () => selectedKey;

  const setActiveIndex = (index: number | null) => {
    if (Object.is(activeIndex, index)) return;

    activeIndex = index;
    emit();
  };

  const setSelectedKey = (nextKey: string | undefined) => {
    if (Object.is(selectedKey, nextKey)) return;

    selectedKey = nextKey;
    emit();
  };

  const selectKey = (value: string) => {
    if (Object.is(selectedKey, value)) return;

    emitSelection(value);
  };

  /**
   * 生成 item 的交互 props，并在 focus / click 时同步 activeIndex。
   */
  const getItemProps = (index: number, itemProps: ListStateItemProps = {}): InteractionProps => {
    const { value, ...userProps } = itemProps;

    if (index < 0) return userProps;

    return {
      ...userProps,
      onFocus: createChainedFunction(
        (_event: FocusEvent<HTMLElement>) => setActiveIndex(index),
        userProps.onFocus,
      ),
      onClick: createChainedFunction((_event: MouseEvent<HTMLElement>) => {
        setActiveIndex(index);

        if (hasValue(value)) {
          selectKey(value);
        }
      }, userProps.onClick),
    };
  };

  return {
    getActiveIndex,
    getItemProps,
    getSelectedKey,
    setActiveIndex,
    setSelectedKey,
    subscribe,
    subscribeSelection,
  } as const;
};

/** 列表交互状态 store。 */
export type ListStateStore = ReturnType<typeof createListStateStore>;
