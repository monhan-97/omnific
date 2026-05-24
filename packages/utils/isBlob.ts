import { hasValue } from './hasValue';

/**
 * Checks if a given value is `Blob`.
 *
 * This function can also serve as a type predicate in TypeScript, narrowing the type of the argument to `Blob`.
 *
 * @param {unknown} value The value to check if it is `Blob`.
 * @returns {value is Blob} Returns `true` if `value` is `Blob`, else `false`.
 *
 * @example
 * const value1 = new Blob(['hello']);
 * const value2 = new ArrayBuffer(8);
 * const value3 = {};
 *
 * console.log(isBlob(value1)); // true
 * console.log(isBlob(value2)); // false
 * console.log(isBlob(value3)); // false
 */
export function isBlob(value: unknown): value is Blob {
  return hasValue(value) && value instanceof Blob;
}
