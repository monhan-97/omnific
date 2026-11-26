import { hasValue, isNil, isObject, noop } from '@omnific/utils';

import { type Easing, supportedWaapiEasing } from './easings';
import { clearActiveAnimation, setActiveAnimation } from './helpers';
import type {
  AnimationPlaybackControlsWithThen,
  AnimationScope,
  ResolvedValueKeyframe,
} from './types';

/**
 * 是否为动画打断导致的 AbortError。
 */
export const isAnimationAbortError = (error: unknown): error is DOMException =>
  isObject(error) && (error as { name?: unknown }).name === 'AbortError';

/**
 * 多属性合并后的 WAAPI 输入。
 */
export type ElementAnimationInput = {
  /**
   * 目标元素。
   */
  element: Element;
  /**
   * 已规范化的多属性关键帧。
   */
  keyframes: Record<string, ResolvedValueKeyframe[]>;
  /**
   * 延迟，单位毫秒。
   */
  delay?: number;
  /**
   * 时长，单位毫秒。
   */
  duration?: number;
  /**
   * 命名缓动。
   */
  ease?: Easing;
  /**
   * 动画作用域；传入后会把本次动画登记到作用域中。
   */
  scope?: AnimationScope;
};

/**
 * 为单个元素创建一次（可含多属性）WAAPI 动画。
 *
 * `finished` 在正常完成时 resolve；在 `stop` / `cancel` 时以 `AbortError` reject。
 */
export const createElementAnimation = (
  input: ElementAnimationInput,
): AnimationPlaybackControlsWithThen => {
  const { element, keyframes, delay = 0, duration = 300, ease = 'easeOut', scope } = input;

  const style = (element as HTMLElement | SVGElement).style;

  const animation = element.animate(keyframes as PropertyIndexedKeyframes, {
    delay,
    duration,
    easing: supportedWaapiEasing[ease],
    fill: 'both',
  });

  const { promise: finished, resolve: resolveFinished, reject: rejectFinished } =
    Promise.withResolvers<void>();

  let isStopped = false;
  let isSettled = false;

  const settleResolved = () => {
    if (isSettled) return;
    isSettled = true;
    resolveFinished();
  };

  const settleAborted = () => {
    if (isSettled) return;
    isSettled = true;
    rejectFinished(new DOMException('Animation aborted', 'AbortError'));
  };

  const onCancel = () => {
    animation.onfinish = null;
    animation.removeEventListener('cancel', onCancel);
    animation.removeEventListener('remove', onCancel);
    settleAborted();
  };

  const detachHandlers = () => {
    animation.onfinish = null;
    animation.removeEventListener('cancel', onCancel);
    animation.removeEventListener('remove', onCancel);
  };

  const cancelAnimation = () => {
    detachHandlers();
    try {
      animation.cancel();
    } catch {
      // ignore
    }
  };

  const commitFinalStyles = () => {
    for (const [name, frames] of Object.entries(keyframes)) {
      const finalKeyframe = frames.at(-1);
      if (isNil(finalKeyframe)) continue;

      (style as any)[name] = finalKeyframe;
    }
  };

  const onFinish = () => {
    try {
      commitFinalStyles();
    } catch {
      // ignore
    } finally {
      cancelAnimation();
      settleResolved();
    }
  };

  animation.onfinish = onFinish;
  animation.addEventListener('cancel', onCancel);
  animation.addEventListener('remove', onCancel);

  const controls: AnimationPlaybackControlsWithThen = {
    stop() {
      if (isStopped || isSettled) return;
      isStopped = true;
      try {
        if (element.isConnected && animation.playState !== 'idle') {
          animation.commitStyles?.();
        }
      } catch {
        // ignore
      } finally {
        cancelAnimation();
        settleAborted();
      }
    },
    play() {
      if (isStopped || isSettled) return;
      animation.onfinish = onFinish;
      animation.play();
    },
    pause() {
      if (isStopped || isSettled) return;
      animation.pause();
    },
    cancel() {
      if (isSettled) {
        cancelAnimation();
        return;
      }
      isStopped = true;
      cancelAnimation();
      settleAborted();
    },
    complete() {
      if (isStopped || isSettled) return;
      animation.onfinish = onFinish;
      animation.finish?.();
    },
    finished,
    // eslint-disable-next-line unicorn/no-thenable -- await-compatible controls
    then(onfulfilled, onrejected) {
      // eslint-disable-next-line unicorn/prefer-then-catch -- PromiseLike signature
      return finished.then(onfulfilled, onrejected);
    },
  };

  setActiveAnimation(element, controls);
  if (hasValue(scope)) scope.animations.push(controls);

  finished
    .finally(() => {
      clearActiveAnimation(element, controls);
      if (isNil(scope)) return;
      const index = scope.animations.indexOf(controls);
      if (index === -1) return;
      scope.animations.splice(index, 1);
    })
    .catch(noop);

  return controls;
};
