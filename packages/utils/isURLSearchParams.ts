import { hasValue } from './hasValue';

/**
 * Checks if a given value is `URLSearchParams`.
 *
 * This function can also serve as a type predicate in TypeScript, narrowing the type of the argument to `URLSearchParams`.
 *
 * @param {unknown} value The value to check if it is `URLSearchParams`.
 * @returns {value is URLSearchParams} Returns `true` if `value` is `URLSearchParams`, else `false`.
 *
 * @example
 * const value1 = new URLSearchParams('a=1');
 * const value2 = new FormData();
 * const value3 = 'a=1';
 *
 * console.log(isURLSearchParams(value1)); // true
 * console.log(isURLSearchParams(value2)); // false
 * console.log(isURLSearchParams(value3)); // false
 */
export function isURLSearchParams(value: unknown): value is URLSearchParams {
  return hasValue(value) && value instanceof URLSearchParams;
}
