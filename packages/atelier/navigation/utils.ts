import type { KeyboardEvent } from 'react';
import { hasValue, isFunction } from '@omnific/utils';

/** 列表导航方向。 */
export type ListNavigationOrientation = 'vertical' | 'horizontal' | 'both';

/** 不可聚焦索引的声明方式。 */
export type DisabledIndices = ReadonlyArray<number> | ((index: number) => boolean);

/** 按索引读取列表节点。 */
export type ListElementGetter = (index: number) => HTMLElement | undefined;

/** 返回列表节点数量。 */
export type ListSizeGetter = () => number;

/**
 * 判断索引是否落在列表范围内且可用于聚焦。
 *
 * 未传 `disabledIndices` 时读取 DOM 的 `disabled` / `aria-disabled`；
 * 传入后只使用调用方提供的判断。
 */
export const isIndexAvailable = (
  getElement: ListElementGetter,
  getSize: ListSizeGetter,
  index: number,
  disabledIndices: DisabledIndices | undefined,
): boolean => {
  if (index < 0 || index >= getSize()) return false;

  if (isFunction(disabledIndices)) return !disabledIndices(index);
  if (hasValue(disabledIndices)) return !disabledIndices.includes(index);

  const element = getElement(index);
  return element?.matches(':not([disabled]):not([aria-disabled="true"])') ?? false;
};

/**
 * 从 `startingIndex` 的下一个位置开始查找可用索引。
 *
 * 返回 `-1` 表示越过列表起点，返回 `getSize()` 表示越过列表终点；
 * 调用方需要使用 `min` / `max` 收敛到边界。
 */
export const findEnabledIndex = (
  getElement: ListElementGetter,
  getSize: ListSizeGetter,
  disabledIndices: DisabledIndices | undefined,
  startingIndex: number,
  decrement = false,
): number => {
  const length = getSize();
  let index = startingIndex;

  for (let step = 0; step <= length; step += 1) {
    index += decrement ? -1 : 1;

    if (index < 0 || index >= length) return index;
    if (isIndexAvailable(getElement, getSize, index, disabledIndices)) return index;
  }

  return index;
};

/**
 * 返回第一个可用索引；没有可用项时返回 `-1`。
 */
export const getMinEnabledIndex = (
  getElement: ListElementGetter,
  getSize: ListSizeGetter,
  disabledIndices: DisabledIndices | undefined,
): number => {
  const index = findEnabledIndex(getElement, getSize, disabledIndices, -1);
  return index < getSize() ? index : -1;
};

/**
 * 返回最后一个可用索引；没有可用项时返回 `-1`。
 */
export const getMaxEnabledIndex = (
  getElement: ListElementGetter,
  getSize: ListSizeGetter,
  disabledIndices: DisabledIndices | undefined,
): number => {
  const index = findEnabledIndex(getElement, getSize, disabledIndices, getSize(), true);
  return index >= 0 ? index : -1;
};

/**
 * 判断按键是否让焦点向列表末尾移动。
 */
export const isForwardKey = (key: string, orientation: ListNavigationOrientation): boolean => {
  if (orientation === 'horizontal') return key === 'ArrowRight';
  if (orientation === 'vertical') return key === 'ArrowDown';
  return key === 'ArrowDown' || key === 'ArrowRight';
};

/**
 * 判断按键是否让焦点向列表开头移动。
 */
export const isBackwardKey = (key: string, orientation: ListNavigationOrientation): boolean => {
  if (orientation === 'horizontal') return key === 'ArrowLeft';
  if (orientation === 'vertical') return key === 'ArrowUp';
  return key === 'ArrowUp' || key === 'ArrowLeft';
};

/**
 * 判断键盘事件 key 是否为空格。
 */
export const isSpaceKey = (key: string): boolean => key === ' ';

/**
 * 判断键盘事件是否应被导航逻辑忽略。
 *
 * 修饰键和输入法组合输入交给浏览器或上层处理。
 */
export const shouldSkipKeyboardEvent = (event: KeyboardEvent<HTMLElement>): boolean =>
  event.ctrlKey || event.metaKey || event.altKey || event.nativeEvent.isComposing;
