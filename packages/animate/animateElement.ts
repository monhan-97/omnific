import { isNumber, isUndefined, noop } from '@omnific/utils';

import { normalizeKeyframes, stopActiveAnimation } from './helpers';
import { createElementAnimation } from './nativeAnimation';
import type {
  AnimationOptions,
  AnimationPlaybackControlsWithThen,
  DOMKeyframesDefinition,
  ResolvedValueKeyframe,
} from './types';

const resolvedVoid = Promise.resolve();

const noopControls: AnimationPlaybackControlsWithThen = {
  stop: noop,
  play: noop,
  pause: noop,
  cancel: noop,
  complete: noop,
  finished: resolvedVoid,
  // eslint-disable-next-line unicorn/no-thenable -- await-compatible controls
  then(onfulfilled, onrejected) {
    // eslint-disable-next-line unicorn/prefer-then-catch -- PromiseLike signature
    return resolvedVoid.then(onfulfilled, onrejected);
  },
};

/**
 * 为单个元素创建 WAAPI 动画；多属性合并为一次 `element.animate()`。
 */
export const animateElement = (
  element: Element,
  keyframes: DOMKeyframesDefinition,
  options?: AnimationOptions,
) => {
  const propertyNames: string[] = [];
  for (const name in keyframes) {
    // `null` 表示沿用当前值，不能用 isNil 跳过
    if (isUndefined(keyframes[name])) continue;
    propertyNames.push(name);
  }
  if (propertyNames.length === 0) return noopControls;

  stopActiveAnimation(element);

  const computedStyle = globalThis.getComputedStyle(element);
  const resolved: Record<string, ResolvedValueKeyframe[]> = {};
  for (const name of propertyNames) {
    resolved[name] = normalizeKeyframes(keyframes[name]!, computedStyle, name);
  }

  return createElementAnimation({
    element,
    keyframes: resolved,
    delay: isNumber(options?.delay) ? options.delay * 1000 : undefined,
    duration: isNumber(options?.duration) ? options.duration * 1000 : undefined,
    ease: options?.ease,
  });
};
