import { isFunction, isNumber, isUndefined, noop } from '@omnific/utils';

import { normalizeKeyframes, stopActiveAnimation } from './helpers';
import { createElementAnimation } from './nativeAnimation';
import type {
  AnimationOptions,
  AnimationPlaybackControlsWithThen,
  AnimationScope,
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

const animateElementWithScope = (
  element: Element,
  keyframes: DOMKeyframesDefinition,
  options: AnimationOptions | undefined,
  scope: AnimationScope | undefined,
) => {
  const propertyNames: string[] = [];

  for (const [name, value] of Object.entries(keyframes)) {
    // `null` 表示沿用当前值，不能用 isNil 跳过
    if (isUndefined(value)) continue;
    propertyNames.push(name);
  }

  if (propertyNames.length === 0 || !isFunction(element.animate)) return noopControls;

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
    scope,
  });
};

/**
 * 为单个元素创建 WAAPI 动画；多属性合并为一次 `element.animate()`。
 */
export const animateElement = (
  element: Element,
  keyframes: DOMKeyframesDefinition,
  options?: AnimationOptions,
) => animateElementWithScope(element, keyframes, options, undefined);

/**
 * 创建绑定到作用域的 `animate`。
 *
 * scope 会记录该函数创建的动画，便于在卸载时统一停止。
 */
export const createScopedAnimate = (scope: AnimationScope) => {
  return (element: Element, keyframes: DOMKeyframesDefinition, options?: AnimationOptions) =>
    animateElementWithScope(element, keyframes, options, scope);
};
