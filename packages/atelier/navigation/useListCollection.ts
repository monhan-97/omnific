import { useState } from 'react';

import { createListCollectionStore } from './ListCollectionStore';
import type { ListCollectionStore } from './ListCollectionStore';

/**
 * 创建并保持一个与组件生命周期一致的列表集合 store。
 */
export const useListCollection = (): ListCollectionStore => {
  const [store] = useState(() => createListCollectionStore());
  return store;
};
