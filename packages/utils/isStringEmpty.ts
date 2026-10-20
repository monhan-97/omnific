import { isNil } from './isNil';

/**
 * Checks whether a value is nullish or an empty string.
 *
 * `null`, `undefined`, and whitespace-only strings are considered empty.
 */
export function isStringEmpty(value: string | null | undefined): value is '' | null | undefined {
  return isNil(value) || value.trim().length === 0;
}
