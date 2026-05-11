import { isString } from '../isString';
import { isSymbol } from '../isSymbol';

export function normalizeKey(path: unknown) {
  return Object.is(path?.valueOf?.(), -0) ? '-0' : String(path);
}

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
export function toKey(value: any) {
  if (isString(value) || isSymbol(value)) {
    return value;
  }
  return normalizeKey(value);
}
