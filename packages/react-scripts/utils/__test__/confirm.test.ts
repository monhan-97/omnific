import { PassThrough } from 'node:stream';

import { describe, expect, it } from 'vitest';

import { confirm } from '../confirm';

function createInput(answer: string) {
  const input = new PassThrough();
  input.end(answer);
  return input;
}

describe('confirm', () => {
  it('returns true for yes answers', async () => {
    await expect(
      confirm({
        message: 'Continue',
        input: createInput('yes\n'),
        output: new PassThrough(),
      }),
    ).resolves.toBe(true);
  });

  it('returns false for no answers', async () => {
    await expect(
      confirm({
        message: 'Continue',
        input: createInput('n\n'),
        output: new PassThrough(),
      }),
    ).resolves.toBe(false);
  });

  it('uses the default answer for empty input', async () => {
    await expect(
      confirm({
        message: 'Continue',
        shouldConfirmByDefault: false,
        input: createInput('\n'),
        output: new PassThrough(),
      }),
    ).resolves.toBe(false);
  });
});
