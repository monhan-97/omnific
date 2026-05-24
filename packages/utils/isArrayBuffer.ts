import { hasValue } from './hasValue';

/**
 * Checks if a given value is `ArrayBuffer`.
 *
 * This function can also serve as a type predicate in TypeScript, narrowing the type of the argument to `ArrayBuffer`.
 *
 * @param {unknown} value The value to check if it is `ArrayBuffer`.
 * @returns {value is ArrayBuffer} Returns `true` if `value` is `ArrayBuffer`, else `false`.
 *
 * @example
 * const value1 = new ArrayBuffer(8);
 * const value2 = new Blob(['hello']);
 * const value3 = {};
 *
 * console.log(isArrayBuffer(value1)); // true
 * console.log(isArrayBuffer(value2)); // false
 * console.log(isArrayBuffer(value3)); // false
 */
export function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return hasValue(value) && value instanceof ArrayBuffer;
}
