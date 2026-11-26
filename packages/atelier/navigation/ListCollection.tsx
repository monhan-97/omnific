import { createContext, use } from 'react';
import type { ReactNode } from 'react';

import type { ListCollectionStore } from './ListCollectionStore';

/** `ListCollection` 组件属性。 */
export interface ListCollectionProps {
  /** 列表内容。 */
  children: ReactNode;
  /** 列表集合 store。 */
  store: ListCollectionStore;
}

const ListCollectionContext = createContext<ListCollectionStore | null>(null);

/**
 * 读取最近的列表集合 store。
 *
 * 不在 ListCollection 中时返回 `null`。
 */
export const useListCollectionContext = (): ListCollectionStore | null =>
  use(ListCollectionContext);

/**
 * 向子树提供列表集合 store。
 */
export const ListCollection = (props: ListCollectionProps) => {
  const { children, store } = props;

  return <ListCollectionContext value={store}>{children}</ListCollectionContext>;
};
