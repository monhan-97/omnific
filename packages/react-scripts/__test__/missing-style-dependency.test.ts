import { describe, expect, it, vi } from 'vitest';

import type * as DetectPackageModule from '../utils/detect-package';
import createRspackConfig from '../rspack.config';

vi.mock('../utils/detect-package', async importOriginal => {
  const original = await importOriginal<typeof DetectPackageModule>();

  return {
    ...original,
    resolveRequiredPackage(
      packageName: string,
      options: Parameters<typeof original.resolveRequiredPackage>[1],
    ) {
      if (packageName === 'sass-loader' || packageName === 'sass-embedded') {
        throw new Error(
          'Missing optional Sass dependencies. Install them with: pnpm add -D sass-loader sass-embedded',
        );
      }

      return original.resolveRequiredPackage(packageName, options);
    },
  };
});

type RuleLike = {
  oneOf?: RuleLike[];
  test?: unknown;
  use?: unknown;
};

describe('missing style dependency errors', () => {
  it('reports the Sass installation command when Sass dependencies are missing', () => {
    const config = createRspackConfig();
    const rules = config.module?.rules as RuleLike[] | undefined;
    const sassRule = rules?.[0]?.oneOf?.find(rule => String(rule.test).includes('scss'));

    expect(typeof sassRule?.use).toBe('function');
    expect(() => (sassRule?.use as () => unknown)()).toThrow(
      'pnpm add -D sass-loader sass-embedded',
    );
  });
});
