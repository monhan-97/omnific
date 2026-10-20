import { describe, expect, test } from 'vitest';
import { elementType } from 'jsx-ast-utils-x';

import isAbstractRole from '../../src/util/isAbstractRole';
import {
  genAbstractRoleElements,
  genNonAbstractRoleElements,
} from '../utils/genInteractives';


describe('isAbstractRole', () => {
  expect(isAbstractRole(undefined as unknown as string, [])).toBe(false);

  test('elements with an abstract role', () => {
    for (const { openingElement } of genAbstractRoleElements()) {
      const { attributes } = openingElement;
      expect(isAbstractRole(elementType(openingElement), attributes)).toBe(true);
    }
  });

  test('elements with a non-abstract role', () => {
    for (const { openingElement } of genNonAbstractRoleElements()) {
      const { attributes } = openingElement;
      expect(isAbstractRole(elementType(openingElement), attributes)).toBe(false);
    }
  });
});
