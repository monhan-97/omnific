import { describe, expect, test } from 'vitest';
import { elementType } from 'jsx-ast-utils-x';

import isInteractiveRole from '../../src/util/isInteractiveRole';
import {
  genInteractiveRoleElements,
  genNonInteractiveRoleElements,
} from '../utils/genInteractives';


describe('isInteractiveRole', () => {
  expect(isInteractiveRole(undefined as unknown as string, [])).toBe(false);

  test('elements with a non-interactive role', () => {
    for (const { openingElement } of genNonInteractiveRoleElements()) {
      const { attributes } = openingElement;

      expect(isInteractiveRole(elementType(openingElement), attributes)).toBe(false);
    }
  });

  expect(isInteractiveRole('div', [])).toBe(false);

  test('elements with an interactive role', () => {
    for (const { openingElement } of genInteractiveRoleElements()) {
      const { attributes } = openingElement;

      expect(isInteractiveRole(elementType(openingElement), attributes)).toBe(true);
    }
  });
});
