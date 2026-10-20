/**
 * @fileoverview Reads and normalizes the first ESLint rule options object.
 */

import { hasValue, isNil, isPlainObject } from '@omnific/utils';
import type { Rule } from 'eslint';

/**
 * Returns the first rule option object, falling back to `defaults` when absent.
 * @typeParam TOptions - Options object shape.
 * @param context - ESLint rule context.
 * @param defaults - Default options when the user omitted / passed a non-object.
 * @param normalize - Optional normalizer applied to a present options object.
 * @returns Effective options.
 */
export default function readRuleOptions<TOptions extends object>(
  context: Rule.RuleContext,
  defaults: TOptions,
  normalize?: (raw: Partial<TOptions>) => TOptions,
): TOptions {
  const raw = context.options[0];
  if (isNil(raw) || !isPlainObject(raw)) {
    return defaults;
  }

  const partial = raw as Partial<TOptions>;
  return hasValue(normalize) ? normalize(partial) : { ...defaults, ...partial };
}
