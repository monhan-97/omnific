import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { detectPackage, resolvePackage, resolveRequiredPackage } from '../detect-package';

const fixturePaths: string[] = [];

function createPackageFixture(packageName: string) {
  const directoryPath = fs.mkdtempSync(path.join(os.tmpdir(), 'react-scripts-detect-package-'));
  const packageJsonPath = path.join(directoryPath, 'package.json');
  const packageDirectoryPath = path.join(directoryPath, 'node_modules', packageName);

  fixturePaths.push(directoryPath);
  fs.mkdirSync(packageDirectoryPath, { recursive: true });
  fs.writeFileSync(packageJsonPath, '{"type":"module"}');
  fs.writeFileSync(path.join(packageDirectoryPath, 'package.json'), `{"name":"${packageName}"}`);
  fs.writeFileSync(path.join(packageDirectoryPath, 'index.js'), 'export default {};');

  return {
    packageJsonPath,
  };
}

afterEach(() => {
  for (const fixturePath of fixturePaths) {
    fs.rmSync(fixturePath, { force: true, recursive: true });
  }

  fixturePaths.length = 0;
});

describe('detectPackage', () => {
  it('resolves packages from a custom package.json context', () => {
    const fixture = createPackageFixture('fixture-package');

    expect(detectPackage('fixture-package', { from: fixture.packageJsonPath })).toBe(true);
    expect(resolvePackage('fixture-package', { from: fixture.packageJsonPath })).toContain(
      'fixture-package',
    );
  });

  it('returns false when a package cannot be resolved from the context', () => {
    const fixture = createPackageFixture('fixture-package');

    expect(detectPackage('missing-package', { from: fixture.packageJsonPath })).toBe(false);
  });

  it('throws install guidance for required optional packages', () => {
    const fixture = createPackageFixture('fixture-package');

    expect(() =>
      resolveRequiredPackage('missing-sass-package', {
        from: fixture.packageJsonPath,
        installCommand: 'pnpm add -D sass-loader sass-embedded',
      }),
    ).toThrow('pnpm add -D sass-loader sass-embedded');
  });
});
