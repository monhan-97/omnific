import { hasValue, isNil, isNull, isNumber, kebabCase } from '@omnific/utils';

import type { AnimationPlaybackControls, ResolvedValueKeyframe, ValueKeyframe } from './types';

const animationMaps = new WeakMap<Element, AnimationPlaybackControls[]>();

const pxPropertyCache = new Map<string, boolean>();

/**
 * 判断数值型关键帧是否需要补 `px`。
 *
 * 优先保留无单位语义，避免把 `lineHeight` 等合法数值错误转换为长度。
 */
const shouldAppendPx = (name: string) => {
  const cached = pxPropertyCache.get(name);
  if (hasValue(cached)) return cached;

  const property = kebabCase(name);
  const supportsPx = globalThis.CSS.supports(property, '1px');
  if (!supportsPx) {
    pxPropertyCache.set(name, false);
    return false;
  }

  const supportsUnitless = globalThis.CSS.supports(property, '1');
  if (supportsUnitless) {
    pxPropertyCache.set(name, false);
    return false;
  }

  pxPropertyCache.set(name, true);
  return true;
};

/**
 * 中断元素上正在播放的全部动画。
 */
export const stopActiveAnimation = (element: Element) => {
  const active = animationMaps.get(element);
  if (isNil(active)) return;
  for (const animation of active) {
    animation.stop();
  }
  animationMaps.delete(element);
};

/**
 * 登记元素当前动画。
 */
export const setActiveAnimation = (element: Element, animation: AnimationPlaybackControls) => {
  const active = animationMaps.get(element);
  if (hasValue(active)) {
    active.push(animation);
    return;
  }
  animationMaps.set(element, [animation]);
};

/**
 * 清除元素上的指定动画登记。
 */
export const clearActiveAnimation = (element: Element, animation: AnimationPlaybackControls) => {
  const active = animationMaps.get(element);
  if (isNil(active)) return;

  const index = active.indexOf(animation);
  if (index === -1) return;
  active.splice(index, 1);
  if (active.length === 0) animationMaps.delete(element);
};

/**
 * 解析关键帧：以当前计算样式为起点，长度类补 `px`。
 */
export const normalizeKeyframes = (
  raw: ValueKeyframe,
  computedStyle: CSSStyleDeclaration,
  name: string,
): ResolvedValueKeyframe[] => {
  const from = (computedStyle as any)[name] as string;
  if (isNull(raw)) return [from, from];
  if (isNumber(raw) && shouldAppendPx(name)) return [from, `${raw}px`];
  return [from, raw];
};
