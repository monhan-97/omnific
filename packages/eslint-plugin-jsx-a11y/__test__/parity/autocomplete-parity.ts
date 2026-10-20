/**
 * Autocomplete parity corpus generated from axe-core runVirtualRule('autocomplete-valid').
 * Regenerated during dependency-replacement; oracle deps must not remain in package.json.
 */

import cases from './autocomplete-parity.json' with { type: 'json' };

/**
 * A single autocomplete oracle case.
 */
export type AutocompleteParityCase = {
  /** Raw autocomplete attribute value. */
  autocomplete: string;
  /** Associated input type, or null when omitted. */
  inputType: string | null;
  /** Whether axe-core reports the value as valid. */
  valid: boolean;
};

/**
 * Expected autocomplete-valid outcomes from the axe-core oracle.
 */
export const autocompleteParityCases = cases as AutocompleteParityCase[];
