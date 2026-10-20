import { describe, expect, test } from 'vitest';

import { JSXAttributeMock } from '../utils/jsxMocks';
import isContentEditable from '../../src/util/isContentEditable';

describe('isContentEditable - HTML5', () => {
  expect(
    isContentEditable('some tag', [
      JSXAttributeMock('contentEditable', 'true'),
    ]),
  ).toBe(true);

  test('not content editable', () => {
    expect(
      isContentEditable('some tag', [
        JSXAttributeMock('contentEditable', null),
      ]),
    ).toBe(false);

    expect(
      isContentEditable('some tag', [
        JSXAttributeMock('contentEditable', undefined),
      ]),
    ).toBe(false);

    expect(
      isContentEditable('some tag', [
        JSXAttributeMock('contentEditable', true),
      ]),
    ).toBe(false);

    expect(
      isContentEditable('some tag', [
        JSXAttributeMock('contentEditable', 'false'),
      ]),
    ).toBe(false);
  });
});
