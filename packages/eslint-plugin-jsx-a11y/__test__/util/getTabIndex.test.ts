import { expect, test } from 'vitest';

import { IdentifierMock, JSXAttributeMock } from '../utils/jsxMocks';
import getTabIndex from '../../src/util/getTabIndex';


test('getTabIndex', () => {
  expect(getTabIndex(JSXAttributeMock('tabIndex', 0))).toBe(0);

  expect(getTabIndex(JSXAttributeMock('tabIndex', 1))).toBe(1);

  expect(getTabIndex(JSXAttributeMock('tabIndex', -1))).toBe(-1);

  expect(getTabIndex(JSXAttributeMock('tabIndex', ''))).toBe(undefined);

  expect(getTabIndex(JSXAttributeMock('tabIndex', 9.1))).toBe(undefined);

  expect(getTabIndex(JSXAttributeMock('tabIndex', '0'))).toBe(0);

  expect(getTabIndex(JSXAttributeMock('tabIndex', '0a'))).toBe(undefined);

  expect(getTabIndex(JSXAttributeMock('tabIndex', true))).toBe(undefined);
  expect(getTabIndex(JSXAttributeMock('tabIndex', false))).toBe(undefined);

  expect(typeof getTabIndex(JSXAttributeMock('tabIndex', () => 0))).toBe(
    'function',
  );

  const name = 'identName';
  // jsx-ast-utils-x returns the Identifier node for non-literal expressions.
  const ident = IdentifierMock(name);
  const tabIndexIdent = JSXAttributeMock('tabIndex', ident, true);
  expect(getTabIndex(tabIndexIdent)).toEqual({
    type: 'Identifier',
    name,
  });

  expect(getTabIndex(JSXAttributeMock('tabIndex', undefined))).toBe(undefined);
});
