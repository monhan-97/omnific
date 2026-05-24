import { hasValue } from './hasValue';

/**
 * Checks if a given value is `FormData`.
 *
 * This function can also serve as a type predicate in TypeScript, narrowing the type of the argument to `FormData`.
 *
 * @param {unknown} value The value to check if it is `FormData`.
 * @returns {value is FormData} Returns `true` if `value` is `FormData`, else `false`.
 *
 * @example
 * const value1 = new FormData();
 * const value2 = new URLSearchParams();
 * const value3 = {};
 *
 * console.log(isFormData(value1)); // true
 * console.log(isFormData(value2)); // false
 * console.log(isFormData(value3)); // false
 */
export function isFormData(value: unknown): value is FormData {
  return hasValue(value) && value instanceof FormData;
}
