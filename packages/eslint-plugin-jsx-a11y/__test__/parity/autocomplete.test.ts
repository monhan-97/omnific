/**
 * @file Asserts local autocomplete validation against axe-core oracle corpus.
 */

import { describe, expect, test } from 'vitest';

import { autocompleteParityCases } from './autocomplete-parity';

import { isValidAutocomplete } from '../../src/util/autocomplete';

describe('autocomplete parity', () => {
  test.each(autocompleteParityCases)(
    'autocomplete=$autocomplete inputType=$inputType → valid=$valid',
    ({ autocomplete, inputType, valid }) => {
      expect(isValidAutocomplete(autocomplete, inputType ?? undefined)).toBe(valid);
    },
  );
});
