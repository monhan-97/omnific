import { describe, expect, test } from 'vitest';

import isPresentationRole from '../../src/util/isPresentationRole';
import { JSXAttributeMock } from '../utils/jsxMocks';

describe('isPresentationRole', () => {
  test('detects presentation and none roles', () => {
    expect(isPresentationRole('div', [JSXAttributeMock('role', 'presentation')])).toBe(true);
    expect(isPresentationRole('div', [JSXAttributeMock('role', 'none')])).toBe(true);
    expect(isPresentationRole('div', [JSXAttributeMock('role', 'button')])).toBe(false);
    expect(isPresentationRole('div', [])).toBe(false);
  });
});
