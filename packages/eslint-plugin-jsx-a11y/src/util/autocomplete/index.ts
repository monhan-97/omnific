/**
 * Local WHATWG autocomplete / autofill token validation.
 */

import { hasValue, isArrayEmpty, isStringEmpty } from '@omnific/utils';

import {
  CONTACT_QUALIFIERS,
  IGNORED_PURPOSE_TERMS,
  LOCATION_TERMS,
  QUALIFIED_TERMS,
  SECTION_PREFIX,
  STANDALONE_TERMS,
  STATE_TERMS,
  WEBAUTHN_TOKEN,
} from './tokens';

const STATE_TERM_SET = new Set<string>(STATE_TERMS);
const STANDALONE_TERM_SET = new Set<string>(STANDALONE_TERMS);
const CONTACT_QUALIFIER_SET = new Set<string>(CONTACT_QUALIFIERS);
const QUALIFIED_TERM_SET = new Set<string>(QUALIFIED_TERMS);
const LOCATION_TERM_SET = new Set<string>(LOCATION_TERMS);
const IGNORED_PURPOSE_TERM_SET = new Set<string>(IGNORED_PURPOSE_TERMS);

/**
 * Returns whether a token is a WHATWG autofill section name (`section-…`).
 * @param token - Single autocomplete token (already lowercased).
 * @returns `true` when the token uses the `section-` prefix with a non-empty suffix.
 */
function isSectionToken(token: string): boolean {
  return token.startsWith(SECTION_PREFIX) && token.length > SECTION_PREFIX.length;
}

/**
 * Validates an `autocomplete` attribute value against the WHATWG autofill
 * detail-token grammar (format only).
 *
 * Matches axe-core `autocomplete-valid`: `type="hidden"` skips format checks.
 * Type appropriateness for other types is intentionally not enforced.
 *
 * @param autocomplete - Raw `autocomplete` attribute string.
 * @param inputType - Associated `input` `type`, when known.
 * @returns `true` when the value is empty, a state term, a tolerated ignored
 *   purpose, a well-formed autofill detail token list, or the control is hidden.
 */
export function isValidAutocomplete(
  autocomplete: string,
  inputType: string | undefined,
): boolean {
  // axe-core does not flag autocomplete on hidden inputs.
  if (inputType === 'hidden') {
    return true;
  }

  const normalized = autocomplete.toLowerCase().trim();

  if (isStringEmpty(normalized) || STATE_TERM_SET.has(normalized)) {
    return true;
  }

  const tokens = normalized.split(/\s+/g);

  if (tokens.at(-1) === WEBAUTHN_TOKEN) {
    tokens.pop();
    if (isArrayEmpty(tokens)) {
      return false;
    }
  }

  if (hasValue(tokens[0]) && isSectionToken(tokens[0])) {
    tokens.shift();
  }

  if (hasValue(tokens[0]) && LOCATION_TERM_SET.has(tokens[0])) {
    tokens.shift();
  }

  let allowStandalonePurpose = true;
  if (hasValue(tokens[0]) && CONTACT_QUALIFIER_SET.has(tokens[0])) {
    tokens.shift();
    allowStandalonePurpose = false;
  }

  const purpose = tokens.length === 1 ? tokens[0] : undefined;
  if (hasValue(purpose) && IGNORED_PURPOSE_TERM_SET.has(purpose)) {
    return true;
  }

  return hasValue(purpose) && QUALIFIED_TERM_SET.has(purpose) ? true : (
    hasValue(purpose) && allowStandalonePurpose && STANDALONE_TERM_SET.has(purpose)
  );
}
