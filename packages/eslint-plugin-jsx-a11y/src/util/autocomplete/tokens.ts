/**
 * Autofill token sets derived from the WHATWG HTML autocomplete / autofill
 * detail-token grammar, plus a small set of commonly tolerated non-standard
 * state / ignored values used by accessibility checkers.
 *
 * @see https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
 */

/**
 * Autocomplete values that select on/off (or equivalent) state rather than a
 * field purpose. Includes a few widely used non-standard synonyms.
 */
export const STATE_TERMS = [
  'on',
  'off',
  'none',
  'false',
  'true',
  'disabled',
  'enabled',
  'undefined',
  'null',
  'xoff',
  'xon',
] as const;

/**
 * Autofill field names that stand alone (no contact qualifier).
 */
export const STANDALONE_TERMS = [
  'name',
  'honorific-prefix',
  'given-name',
  'additional-name',
  'family-name',
  'honorific-suffix',
  'nickname',
  'username',
  'new-password',
  'current-password',
  'organization-title',
  'organization',
  'street-address',
  'address-line1',
  'address-line2',
  'address-line3',
  'address-level4',
  'address-level3',
  'address-level2',
  'address-level1',
  'country',
  'country-name',
  'postal-code',
  'cc-name',
  'cc-given-name',
  'cc-additional-name',
  'cc-family-name',
  'cc-number',
  'cc-exp',
  'cc-exp-month',
  'cc-exp-year',
  'cc-csc',
  'cc-type',
  'transaction-currency',
  'transaction-amount',
  'language',
  'bday',
  'bday-day',
  'bday-month',
  'bday-year',
  'sex',
  'url',
  'photo',
  'one-time-code',
] as const;

/**
 * Optional contact-scope prefixes (`home`, `work`, …) that may precede a
 * contact-related autofill field name.
 */
export const CONTACT_QUALIFIERS = ['home', 'work', 'mobile', 'fax', 'pager'] as const;

/**
 * Autofill field names that may follow a contact qualifier.
 */
export const QUALIFIED_TERMS = [
  'tel',
  'tel-country-code',
  'tel-national',
  'tel-area-code',
  'tel-local',
  'tel-local-prefix',
  'tel-local-suffix',
  'tel-extension',
  'email',
  'impp',
] as const;

/**
 * Optional address category tokens that may appear after a `section-*` token.
 */
export const LOCATION_TERMS = ['billing', 'shipping'] as const;

/**
 * Technically non-standard purpose tokens that checkers treat as incomplete
 * rather than invalid (harmless / not actionable for a11y).
 */
export const IGNORED_PURPOSE_TERMS = [
  'text',
  'pronouns',
  'gender',
  'message',
  'content',
] as const;

/**
 * Optional trailing token requesting a WebAuthn credential.
 */
export const WEBAUTHN_TOKEN = 'webauthn';

/**
 * Prefix for named autofill section tokens (`section-login`, …).
 */
export const SECTION_PREFIX = 'section-';
