import { isFunction } from './isFunction';

/**
 * A function with a bound `this` context and variadic arguments.
 */
export type ChainedFunction<TArgs extends any[], TThis> = (this: TThis, ...args: TArgs) => void;

/**
 * Composes multiple callbacks into a single callback while preserving `this`.
 *
 * Nullish callbacks are ignored. When no valid callback is provided, a no-op
 * function is returned so the consumer can call the result unconditionally.
 *
 * @template TArgs
 * @template TThis
 * @param {...(ChainedFunction<TArgs, TThis> | null | undefined)[]} funcs - The callbacks to chain.
 * @returns {ChainedFunction<TArgs, TThis>} A single chained callback.
 */
export function createChainedFunction<TArgs extends any[], TThis>(
  ...funcs: Array<ChainedFunction<TArgs, TThis> | null | undefined>
): ChainedFunction<TArgs, TThis> {
  const validFuncs = funcs.filter(
    (fn): fn is ChainedFunction<TArgs, TThis> => isFunction(fn),
  );

  if (validFuncs.length === 0) {
    return function () {};
  }

  if (validFuncs.length === 1) {
    return validFuncs[0];
  }

  return function (this: TThis, ...args: TArgs) {
    for (const fn of validFuncs) {
      fn.apply(this, args);
    }
  };
}

export default createChainedFunction;
