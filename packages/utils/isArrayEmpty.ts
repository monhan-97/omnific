import { isNil } from './isNil';

/**
 * Checks whether a value is nullish or an empty array.
 *
 * `null`, `undefined`, and arrays without elements are considered empty.
 */
export function isArrayEmpty<T>(
  value: readonly T[] | null | undefined,
): value is null | undefined | readonly [] {
  if (isNil(value)) return true;
  return value.length === 0;
}
