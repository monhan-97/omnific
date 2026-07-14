import { isStringEmpty } from './isStringEmpty';

/**
 * Parses JSON text into a value.
 *
 * Returns `undefined` for blank strings. When `fallback` is provided, invalid JSON
 * returns the fallback instead of throwing.
 */
export function parseJson<T>(text: string, fallback?: T): T | undefined {
  if (isStringEmpty(text)) {
    return undefined;
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    if (arguments.length > 1) {
      return fallback;
    }
    throw error;
  }
}
