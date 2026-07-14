import { isNil } from './isNil';

/**
 * Checks whether a value is nullish or an empty string.
 *
 * `null`, `undefined`, and whitespace-only strings are considered empty.
 */
export function isStringEmpty(value: string | null | undefined): value is null | undefined {
  if (isNil(value)) return true;
  return value.trim().length === 0;
}
