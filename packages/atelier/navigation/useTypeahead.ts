import { useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { useEventCallback } from '@omnific/hooks';
import { hasValue, isNil } from '@omnific/utils';

import { isSpaceKey, shouldSkipKeyboardEvent } from './utils';
import type { ListIndexGetter } from './useListState';

/** 返回与列表索引对齐的标签数组。 */
export type ListLabelsGetter = () => Array<string | null>;

/** typeahead 自定义匹配函数。 */
export type TypeaheadFindMatch = (
  labels: Array<string | null>,
  search: string,
) => string | null | undefined;

/** `useTypeahead` 选项。 */
export type UseTypeaheadOptions = {
  /** 读取当前 active item 索引。 */
  getActiveIndex: ListIndexGetter;
  /** 读取当前 selected item 索引，用于派生 typeahead 的起始位置。 */
  getSelectedIndex?: ListIndexGetter;
  /** 按列表索引返回标签数组。 */
  getLabels: ListLabelsGetter;
  /** 命中项时回调。 */
  onMatch: (index: number) => void;
  /** 是否启用 typeahead，默认 `true`。 */
  enabled?: boolean;
  /** 输入缓冲重置时间，默认 `750ms`。 */
  resetMs?: number;
  /** 自定义匹配函数。 */
  findMatch?: TypeaheadFindMatch | null;
  /** 忽略的按键。 */
  ignoreKeys?: ReadonlyArray<string>;
  /** 输入状态变化时回调。 */
  onTypingChange?: (typing: boolean) => void;
};

const DEFAULT_RESET_MS = 750;

/**
 * 默认按前缀匹配标签，命中时返回标签原文。
 */
const defaultFindMatch: TypeaheadFindMatch = (labels, search) => {
  const normalizedSearch = search.toLocaleLowerCase();
  const matched = labels.find(
    label => hasValue(label) && label.toLocaleLowerCase().startsWith(normalizedSearch),
  );

  return hasValue(matched) ? matched : null;
};

/**
 * 从指定索引之后开始轮转标签数组，保证搜索从当前位置继续。
 */
const rotateLabels = (labels: Array<string | null>, startIndex: number): Array<string | null> => {
  const start = startIndex + 1;
  return [...labels.slice(start), ...labels.slice(0, start)];
};

/**
 * 判断是否允许连续按同一个首字母在匹配项之间循环。
 */
const canCycleByFirstLetter = (labels: Array<string | null>): boolean =>
  labels.every(
    label =>
      isNil(label) ||
      label.length === 0 ||
      label[0]?.toLocaleLowerCase() !== label[1]?.toLocaleLowerCase(),
  );

/**
 * 提供菜单列表的字符搜索能力。
 */
export const useTypeahead = (options: UseTypeaheadOptions) => {
  const {
    enabled = true,
    findMatch,
    getActiveIndex,
    getLabels,
    getSelectedIndex,
    ignoreKeys = [],
    onMatch,
    onTypingChange,
    resetMs = DEFAULT_RESET_MS,
  } = options;

  const stringRef = useRef('');

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const previousIndexRef = useRef(getSelectedIndex?.() ?? getActiveIndex() ?? -1);

  const matchIndexRef = useRef<number | null>(null);

  const typingRef = useRef(false);

  const setTyping = (typing: boolean) => {
    if (typingRef.current === typing) return;
    typingRef.current = typing;
    onTypingChange?.(typing);
  };

  const clearTimer = () => {
    if (isNil(timeoutRef.current)) return;

    globalThis.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  const resetBuffer = () => {
    stringRef.current = '';
    previousIndexRef.current = matchIndexRef.current ?? -1;
    matchIndexRef.current = null;
    setTyping(false);
  };

  const scheduleReset = () => {
    clearTimer();
    timeoutRef.current = globalThis.setTimeout(() => {
      resetBuffer();
      timeoutRef.current = null;
    }, resetMs);
  };

  useEffect(() => {
    if (!enabled) resetBuffer();

    return clearTimer;
    // clearTimer / resetBuffer 只读写 ref，不需要进入依赖数组。
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, [enabled]);

  const handleKeyDown = useEventCallback((event: KeyboardEvent<HTMLElement>) => {
    if (
      !enabled ||
      shouldSkipKeyboardEvent(event) ||
      event.key.length !== 1 ||
      ignoreKeys.includes(event.key)
    )
      return;

    const labels = getLabels();
    if (labels.length === 0) return;
    if (stringRef.current.length === 0) {
      previousIndexRef.current = getSelectedIndex?.() ?? getActiveIndex() ?? -1;
    }

    if (isSpaceKey(event.key) && stringRef.current.length === 0) return;

    event.preventDefault();
    event.stopPropagation();
    setTyping(true);

    if (canCycleByFirstLetter(labels) && stringRef.current === event.key) {
      stringRef.current = '';
      previousIndexRef.current = matchIndexRef.current ?? -1;
    }

    stringRef.current += event.key;
    scheduleReset();

    const orderedLabels = rotateLabels(labels, previousIndexRef.current);
    const matcher = hasValue(findMatch) ? findMatch : defaultFindMatch;
    const matched = matcher(orderedLabels, stringRef.current);
    const index = isNil(matched) || matched.length === 0 ? -1 : labels.indexOf(matched);

    if (index >= 0) {
      onMatch(index);
      matchIndexRef.current = index;
      return;
    }

    if (isSpaceKey(event.key)) return;
    resetBuffer();
  });

  const handleKeyUp = useEventCallback((event: KeyboardEvent<HTMLElement>) => {
    if (isSpaceKey(event.key)) {
      setTyping(false);
    }
  });

  return {
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
  };
};
