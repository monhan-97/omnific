import { hasValue, isNil, isNull, isNumber } from '@omnific/utils';

import type {
  AnimationPlaybackControls,
  ResolvedValueKeyframe,
  ValueKeyframe,
} from './types';

const animationMaps = new WeakMap<Element, AnimationPlaybackControls[]>();

const pxValues = new Set([
  'borderWidth',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
  'width',
  'maxWidth',
  'height',
  'maxHeight',
  'top',
  'right',
  'bottom',
  'left',
  'inset',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'fontSize',
  'backgroundPositionX',
  'backgroundPositionY',
]);

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
  return pxValues.has(name) && isNumber(raw) ? [from, `${raw}px`] : [from, raw];
};
