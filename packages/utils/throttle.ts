import { debounce } from './debounce';
import { isUndefined } from './isUndefined';

/**
 * 控制节流函数何时调用或取消的选项。
 */
export interface ThrottleOptions {
  /**
   * An optional AbortSignal to cancel the throttled function.
   */
  signal?: AbortSignal;

  /**
   * An optional array specifying whether the function should be invoked on the leading edge, trailing edge, or both.
   * If `edges` includes "leading", the function will be invoked at the start of the delay period.
   * If `edges` includes "trailing", the function will be invoked at the end of the delay period.
   * If both "leading" and "trailing" are included, the function will be invoked at both the start and end of the delay period.
   * @default ["leading", "trailing"]
   */
  edges?: Array<'leading' | 'trailing'>;
}

/**
 * 带有取消和立即执行控制能力的节流函数。
 */
export interface ThrottledFunction<F extends (...arguments_: any[]) => void> {
  (...arguments_: Parameters<F>): void;
  cancel: () => void;
  flush: () => void;
}

/**
 * Creates a throttled function that only invokes the provided function at most once
 * per every `throttleMs` milliseconds. Subsequent calls to the throttled function
 * within the wait time will not trigger the execution of the original function.
 *
 * @template F - The type of function.
 * @param {F} function_ - The function to throttle.
 * @param {number} throttleMs - The number of milliseconds to throttle executions to.
 * @returns {(...args: Parameters<F>) => void} A new throttled function that accepts the same parameters as the original function.
 *
 * @example
 * const throttledFunction = throttle(() => {
 *   console.log('Function executed');
 * }, 1000);
 *
 * // Will log 'Function executed' immediately
 * throttledFunction();
 *
 * // Will not log anything as it is within the throttle time
 * throttledFunction();
 *
 * // After 1 second
 * setTimeout(() => {
 *   throttledFunction(); // Will log 'Function executed'
 * }, 1000);
 */
export function throttle<F extends (...arguments_: any[]) => void>(
  function_: F,
  throttleMs: number,
  { signal, edges = ['leading', 'trailing'] }: ThrottleOptions = {}
): ThrottledFunction<F> {
  let pendingAt: number | undefined;

  const debounced = debounce(
    function (this: any, ...arguments_: Parameters<F>) {
      pendingAt = Date.now();
      function_.apply(this, arguments_);
    },
    throttleMs,
    { signal, edges }
  );

  const throttled = function (this: any, ...arguments_: Parameters<F>) {
    if (isUndefined(pendingAt)) {
      pendingAt = Date.now();
    }

    if (Date.now() - pendingAt >= throttleMs) {
      pendingAt = Date.now();
      function_.apply(this, arguments_);

      debounced.cancel();
      debounced.schedule();
      return;
    }

    debounced.apply(this, arguments_);
  };

  throttled.cancel = () => {
    pendingAt = undefined;
    debounced.cancel();
  };
  throttled.flush = debounced.flush;

  return throttled;
}
