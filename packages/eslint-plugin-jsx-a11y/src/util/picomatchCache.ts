/**
 * Cached `picomatch` compilers for repeated pattern matching.
 */

import { hasValue } from '@omnific/utils';
import picomatch from 'picomatch';

const matcherCache = new Map<string, (input: string) => boolean>();

/**
 * Returns a compiled picomatch matcher for `pattern`, caching by pattern string.
 * @param pattern - Glob / picomatch pattern.
 * @returns Matcher function.
 */
export function getPicomatch(pattern: string): (input: string) => boolean {
  const cached = matcherCache.get(pattern);
  if (hasValue(cached)) {
    return cached;
  }

  const match = picomatch(pattern);
  matcherCache.set(pattern, match);
  return match;
}
