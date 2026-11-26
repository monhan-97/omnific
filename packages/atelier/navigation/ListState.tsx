import { createContext, use } from 'react';
import type { ReactNode } from 'react';

import type { ListStateStore } from './ListStateStore';

/** `ListState` 组件属性。 */
export interface ListStateProps {
  /** 列表内容。 */
  children: ReactNode;
  /** 列表交互状态 store。 */
  store: ListStateStore;
}

const ListStateContext = createContext<ListStateStore | null>(null);

/**
 * 读取最近的列表交互状态 store。
 *
 * 不在 ListState 中时返回 `null`。
 */
export const useListStateContext = (): ListStateStore | null => use(ListStateContext);

/**
 * 向子树提供列表交互状态 store。
 */
export const ListState = (props: ListStateProps) => {
  const { children, store } = props;

  return <ListStateContext value={store}>{children}</ListStateContext>;
};
