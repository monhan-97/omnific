import { createEmitter, isNil, isUndefined } from '@omnific/utils';

const NO_INDEX = -1;

const sortByDocumentPosition = (a: HTMLElement, b: HTMLElement) => {
  const position = a.compareDocumentPosition(b);

  if (
    position & Node.DOCUMENT_POSITION_FOLLOWING ||
    position & Node.DOCUMENT_POSITION_CONTAINED_BY
  ) {
    return -1;
  }
  if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
    return 1;
  }
  return 0;
};

/**
 * 创建列表集合 store，维护节点的 DOM 顺序、索引、标签和索引订阅。
 *
 * 节点注册与注销会在同一微任务内合并为一次通知。
 */
export const createListCollectionStore = () => {
  const nodes = new Set<HTMLElement>();

  const indices = new Map<HTMLElement, number>();

  const labelsRef: Array<string | null> = [];

  const { subscribe, emit } = createEmitter();

  let orderedNodes: Array<HTMLElement> = [];
  let indicesDirty = false;
  let notificationPending = false;
  let flushScheduled = false;

  const updateIndices = () => {
    if (!indicesDirty) return;

    orderedNodes = [...nodes].sort(sortByDocumentPosition);
    indices.clear();

    for (const [index, node] of orderedNodes.entries()) {
      indices.set(node, index);
    }

    indicesDirty = false;
  };

  const flush = () => {
    updateIndices();

    if (!notificationPending) return;

    notificationPending = false;
    emit();
  };

  const scheduleFlush = () => {
    indicesDirty = true;
    notificationPending = true;

    if (flushScheduled) return;

    flushScheduled = true;
    queueMicrotask(() => {
      flushScheduled = false;
      flush();
    });
  };

  const register = (node: HTMLElement) => {
    if (nodes.has(node)) return;

    nodes.add(node);
    scheduleFlush();
  };

  const unregister = (node: HTMLElement) => {
    if (!nodes.delete(node)) return;

    scheduleFlush();
  };

  const getIndex = (node: HTMLElement | null) => {
    if (isNil(node)) return NO_INDEX;

    updateIndices();
    const index = indices.get(node);
    return isNil(index) ? NO_INDEX : index;
  };

  const getElement = (index: number) => {
    updateIndices();
    return orderedNodes[index];
  };

  const getSize = () => {
    updateIndices();
    return orderedNodes.length;
  };

  const setLabel = (index: number, node: HTMLElement, label: string | null | undefined) => {
    labelsRef[index] = isUndefined(label) ? (node.textContent ?? null) : label;
  };

  const getLabels = () => {
    updateIndices();

    return labelsRef.slice(0, orderedNodes.length);
  };

  return {
    register,
    unregister,
    setLabel,
    getIndex,
    getElement,
    getSize,
    getLabels,
    subscribe,
  } as const;
};

/** 列表节点集合 store。 */
export type ListCollectionStore = ReturnType<typeof createListCollectionStore>;
