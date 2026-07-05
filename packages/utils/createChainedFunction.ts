import { isFunction } from './isFunction';

/**
 * A function with a bound `this` context and variadic arguments.
 */
export type ChainedFunction<TArguments extends any[], TThis> = (this: TThis, ...arguments_: TArguments) => void;

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
export function createChainedFunction<TArguments extends any[], TThis>(
  ...funcs: Array<ChainedFunction<TArguments, TThis> | null | undefined>
): ChainedFunction<TArguments, TThis> {
  const validFuncs = funcs.filter(
    (function_): function_ is ChainedFunction<TArguments, TThis> => isFunction(function_),
  );

  if (validFuncs.length === 0) {
    return function () {};
  }

  if (validFuncs.length === 1) {
    return validFuncs[0];
  }

  return function (this: TThis, ...arguments_: TArguments) {
    for (const function_ of validFuncs) {
      function_.apply(this, arguments_);
    }
  };
}

export default createChainedFunction;
