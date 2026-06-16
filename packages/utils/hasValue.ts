/**
 * Checks whether a value is neither `null` nor `undefined`.
 *
 * This helper acts as a non-nullish type guard, allowing TypeScript to narrow
 * the checked value to `NonNullable<T>`.
 *
 * @template T
 * @param {T} value - The value to check.
 * @returns {value is NonNullable<T>} `true` when the value is present.
 *
 * @example
 * const value = maybeValue();
 * if (hasValue(value)) {
 *   value;
 * }
 */
export function hasValue<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export default hasValue;
