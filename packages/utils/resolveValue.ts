import { isFunction } from './isFunction';

/**
 * Resolves either a plain value or a lazily evaluated value factory.
 *
 * @template TValue
 * @template TArgs
 * @param {TValue | ((...args: TArgs) => TValue)} value - The value or resolver.
 * @param {...TArgs} args - Arguments passed to the resolver when needed.
 * @returns {TValue} The resolved value.
 *
 * @example
 * resolveValue('ready');
 * resolveValue(status => status === 'error' ? 'retry' : 'ok', 'error');
 */
export function resolveValue<TValue, TArguments extends any[]>(
  value: TValue | ((...arguments_: TArguments) => TValue),
  ...arguments_: TArguments
): TValue {
  if (isFunction(value)) {
    return value(...arguments_);
  }

  return value;
}

export default resolveValue;
