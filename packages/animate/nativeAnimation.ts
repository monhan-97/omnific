import { hasValue, isNil, noop } from '@omnific/utils';

import { type Easing, supportedWaapiEasing } from './easings';
import { clearActiveAnimation, setActiveAnimation } from './helpers';
import type {
  AnimationPlaybackControlsWithThen,
  ResolvedValueKeyframe,
} from './types';

/**
 * 是否为动画打断导致的 AbortError。
 */
export const isAnimationAbortError = (error: unknown): error is DOMException =>
  error instanceof DOMException && error.name === 'AbortError';

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
   * 结束时写入的语义样式；缺省用关键帧最后一帧。
   */
  commitStyles?: Record<string, ResolvedValueKeyframe>;
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
};

/**
 * 为单个元素创建一次（可含多属性）WAAPI 动画。
 *
 * `finished` 在正常完成时 resolve；在 `stop` / `cancel` 时以 `AbortError` reject。
 */
export const createElementAnimation = (
  input: ElementAnimationInput,
): AnimationPlaybackControlsWithThen => {
  const { element, keyframes, commitStyles, delay = 0, duration = 300, ease = 'easeOut' } = input;
  const style = (element as HTMLElement | SVGElement).style;

  const animation = element.animate(keyframes as PropertyIndexedKeyframes, {
    delay,
    duration,
    easing: supportedWaapiEasing[ease],
    fill: 'both',
  });

  let isStopped = false;
  let isSettled = false;
  let abortError: DOMException | undefined;
  let resolveFinished: (() => void) | undefined;
  let rejectFinished: ((reason: DOMException) => void) | undefined;
  let finishedPromise: Promise<void> | undefined;

  const settleResolved = () => {
    if (isSettled) return;
    isSettled = true;
    resolveFinished?.();
  };

  const settleAborted = () => {
    if (isSettled) return;
    isSettled = true;
    abortError = new DOMException('Animation aborted', 'AbortError');
    rejectFinished?.(abortError);
  };

  const cancelAnimation = () => {
    animation.onfinish = null;
    try {
      animation.cancel();
    } catch {
      // ignore
    }
  };

  const commitFinalStyles = () => {
    for (const name in keyframes) {
      const frames = keyframes[name];
      if (isNil(frames)) continue;
      const finalKeyframe = commitStyles?.[name] ?? frames.findLast(hasValue);
      if (hasValue(finalKeyframe)) (style as any)[name] = finalKeyframe;
    }
  };

  const onFinish = () => {
    animation.onfinish = null;
    commitFinalStyles();
    cancelAnimation();
    settleResolved();
  };

  animation.onfinish = onFinish;

  const controls: AnimationPlaybackControlsWithThen = {
    stop() {
      if (isStopped) return;
      isStopped = true;
      if (isSettled) return;
      if (element.isConnected && animation.playState !== 'idle') {
        animation.commitStyles?.();
      }
      cancelAnimation();
      settleAborted();
    },
    play() {
      if (isStopped) return;
      animation.onfinish = onFinish;
      animation.play();
    },
    pause() {
      animation.pause();
    },
    cancel() {
      if (isStopped && isSettled) {
        cancelAnimation();
        return;
      }
      isStopped = true;
      cancelAnimation();
      settleAborted();
    },
    complete() {
      if (isStopped) return;
      animation.onfinish = onFinish;
      animation.finish?.();
    },
    get finished() {
      if (hasValue(finishedPromise)) return finishedPromise;
      if (isSettled) {
        finishedPromise = hasValue(abortError) ? Promise.reject(abortError) : Promise.resolve();
        return finishedPromise;
      }
      const { promise, resolve, reject } = Promise.withResolvers<void>();
      finishedPromise = promise;
      resolveFinished = resolve;
      rejectFinished = reject;
      return finishedPromise;
    },
    // eslint-disable-next-line unicorn/no-thenable -- await-compatible controls
    then(onfulfilled, onrejected) {
      // eslint-disable-next-line unicorn/prefer-then-catch -- PromiseLike signature
      return controls.finished.then(onfulfilled, onrejected);
    },
  };

  setActiveAnimation(element, controls);
  controls.finished.finally(() => clearActiveAnimation(element, controls)).catch(noop);

  return controls;
};
