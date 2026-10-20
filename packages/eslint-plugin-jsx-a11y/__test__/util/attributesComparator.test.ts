import { expect, test } from 'vitest';

import attributesComparator from '../../src/util/attributesComparator';
import { JSXAttributeMock, JSXSpreadAttributeMock } from '../utils/jsxMocks';

test('attributesComparator', () => {
  expect(attributesComparator()).toBe(true);

  expect(attributesComparator([], [])).toBe(true);

  expect(
    attributesComparator(
      [],
      [JSXAttributeMock('foo', 0), JSXAttributeMock('bar', 'baz')],
    ),
  ).toBe(true);

  const baseAttributes = [
    {
      name: 'biz',
      value: 1,
    },
    {
      name: 'fizz',
      value: 'pop',
    },
    {
      name: 'fuzz',
      value: 'lolz',
    },
  ];

  expect(attributesComparator(baseAttributes, [])).toBe(false);

  expect(
    attributesComparator(baseAttributes, [
      JSXSpreadAttributeMock('props'),
      JSXAttributeMock('biz', 2),
      JSXAttributeMock('ziff', 'opo'),
      JSXAttributeMock('far', 'lolz'),
    ]),
  ).toBe(false);

  expect(
    attributesComparator(baseAttributes, [
      JSXAttributeMock('biz', 1),
      JSXAttributeMock('fizz', 'pop'),
      JSXAttributeMock('goo', 'gazz'),
    ]),
  ).toBe(false);

  expect(
    attributesComparator(baseAttributes, [
      JSXAttributeMock('biz', 1),
      JSXAttributeMock('fizz', 'pop'),
      JSXAttributeMock('fuzz', 'lolz'),
    ]),
  ).toBe(true);

  expect(
    attributesComparator(baseAttributes, [
      JSXAttributeMock('biz', 1),
      JSXAttributeMock('fizz', 'pop'),
      JSXAttributeMock('fuzz', 'lolz'),
      JSXAttributeMock('dar', 'tee'),
    ]),
  ).toBe(true);
});
