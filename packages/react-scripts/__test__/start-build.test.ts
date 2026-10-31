import { describe, expect, it, vi } from 'vitest';

import { startBuild } from '../scripts/build';
import type { ScriptContext } from '../Service';

const { closeMock, runMock, rspackMock } = vi.hoisted(() => {
  const closeMock = vi.fn((callback: (error?: Error | null) => void) => {
    callback();
  });
  const runMock = vi.fn((callback: (error: Error | null, stats: undefined) => void) => {
    callback(null, undefined);
  });

  return {
    closeMock,
    runMock,
    rspackMock: vi.fn(() => ({ close: closeMock, run: runMock })),
  };
});

vi.mock('@rspack/core', () => ({
  rspack: rspackMock,
}));

vi.mock('node:fs/promises', () => ({
  default: {
    cp: vi.fn(async () => {}),
  },
}));

vi.mock('../paths', () => ({
  default: {
    appBuild: '/tmp/build',
    appHtml: '/tmp/public/index.html',
    appPublic: '/tmp/public',
  },
}));

vi.mock('../utils/file-size-reporter', () => ({
  measureFileSizesBeforeBuild: vi.fn(async () => new Map()),
  printFileSizesAfterBuild: vi.fn(),
}));

vi.mock('../utils/fs-extra', () => ({
  emptyDirectory: vi.fn(async () => {}),
}));

describe('startBuild', () => {
  it('closes the compiler after a production build', async () => {
    await startBuild({ rspackConfig: {} } as ScriptContext);

    expect(runMock).toHaveBeenCalledOnce();
    expect(closeMock).toHaveBeenCalledOnce();
  });
});
