import { describe, expect, test } from 'vitest';
import { elementType } from 'jsx-ast-utils-x';

import isNonInteractiveRole from '../../src/util/isNonInteractiveRole';
import {
  genInteractiveRoleElements,
  genNonInteractiveRoleElements,
} from '../utils/genInteractives';


describe('isNonInteractiveRole', () => {
  expect(isNonInteractiveRole(undefined as unknown as string, [])).toBe(false);

  test('elements with a non-interactive role', () => {
    for (const { openingElement } of genNonInteractiveRoleElements()) {
      const { attributes } = openingElement;

      expect(
        isNonInteractiveRole(elementType(openingElement), attributes),
      ).toBe(true);
    }
  });

  expect(isNonInteractiveRole('div', [])).toBe(false);

  test('elements with an interactive role', () => {
    for (const { openingElement } of genInteractiveRoleElements()) {
      const { attributes } = openingElement;

      expect(
        isNonInteractiveRole(elementType(openingElement), attributes),
      ).toBe(false);
    }
  });
});
