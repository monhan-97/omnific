import { expect, test } from 'vitest';

import { IdentifierMock, JSXAttributeMock, JSXSpreadAttributeMock } from '../utils/jsxMocks';
import isNonLiteralProperty from '../../src/util/isNonLiteralProperty';

const theProp = 'theProp';

const spread = JSXSpreadAttributeMock('theSpread');

test('isNonLiteralProperty', () => {
  expect(isNonLiteralProperty([], theProp)).toBe(false);

  expect(isNonLiteralProperty([JSXAttributeMock(theProp, 'theRole')], theProp)).toBe(false);

  expect(
    isNonLiteralProperty([spread, JSXAttributeMock(theProp, 'theRole')], theProp),
  ).toBe(false);

  const undefinedIdent = IdentifierMock('undefined');
  const undefinedAttr = JSXAttributeMock(theProp, undefinedIdent, true);
  expect(isNonLiteralProperty([undefinedAttr], theProp)).toBe(false);

  const theIdent = IdentifierMock('theIdentifier');
  const identAttr = JSXAttributeMock(theProp, theIdent, true);
  expect(isNonLiteralProperty([identAttr], theProp)).toBe(true);
});
