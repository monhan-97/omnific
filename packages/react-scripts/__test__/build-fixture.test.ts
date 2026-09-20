import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { rspack } from '@rspack/core';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type createRspackConfig from '../rspack.config';

const fixturePaths: string[] = [];

const reactScriptsNodeModulesPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../node_modules',
);

const pathsModulePath = fileURLToPath(new URL('../paths.ts', import.meta.url));
const detectPackageModulePath = fileURLToPath(
  new URL('../utils/detect-package.ts', import.meta.url),
);

const rspackConfigModulePath = fileURLToPath(new URL('../rspack.config.ts', import.meta.url));

type StyleIntegration = 'css' | 'sass' | 'tailwind';

type RspackConfig = ReturnType<typeof createRspackConfig>;

type AssetRule = {
  mimetype?: string;
  test?: unknown;
  parser?: {
    dataUrlCondition?: {
      maxSize?: number;
    };
  };
};

function resolveFixtureApp(directoryPath: string, relativePath: string) {
  return path.resolve(directoryPath, relativePath);
}

function createPathsMock(directoryPath: string) {
  const resolveApp = resolveFixtureApp.bind(undefined, directoryPath);

  return {
    default: {
      appBuild: resolveApp('build'),
      appHtml: resolveApp('public/index.html'),
      appIndexJs: resolveApp('src/index.tsx'),
      appNodeModules: resolveApp('node_modules'),
      appPackageJson: resolveApp('package.json'),
      appPath: resolveApp('.'),
      appPublic: resolveApp('public'),
      appSrc: resolveApp('src'),
      appTsConfig: resolveApp('tsconfig.json'),
      config: resolveApp('react-scripts.config'),
      publicUrlOrPath: './',
      tsBuildInfoFile: resolveApp('node_modules/.cache/tsconfig.tsbuildinfo'),
    },
    resolveApp,
  };
}

function linkFixturePackage(directoryPath: string, packageName: string) {
  const sourcePath = path.join(reactScriptsNodeModulesPath, packageName);
  const targetPath = path.join(directoryPath, 'node_modules', packageName);

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.symlinkSync(fs.realpathSync(sourcePath), targetPath, 'dir');
}

function createAppFixture(styleIntegration: StyleIntegration) {
  const directoryPath = fs.mkdtempSync(path.join(os.tmpdir(), 'react-scripts-build-'));

  fs.mkdirSync(path.join(directoryPath, 'public'), { recursive: true });
  fs.mkdirSync(path.join(directoryPath, 'src'), { recursive: true });
  fs.writeFileSync(
    path.join(directoryPath, 'package.json'),
    '{"type":"module","browserslist":["defaults"]}',
  );
  fs.writeFileSync(path.join(directoryPath, 'public', 'index.html'), '<div id="root"></div>');

  if (styleIntegration === 'sass') {
    fs.writeFileSync(path.join(directoryPath, 'src', 'index.tsx'), "import './style.scss';");
    fs.writeFileSync(
      path.join(directoryPath, 'src', 'style.scss'),
      '$brand: red; .root { color: $brand; }',
    );
  } else {
    fs.writeFileSync(path.join(directoryPath, 'src', 'index.tsx'), "import './style.css';");
    fs.writeFileSync(
      path.join(directoryPath, 'src', 'style.css'),
      styleIntegration === 'tailwind' ? '@import "tailwindcss";' : '.root { color: red; }',
    );
  }

  if (styleIntegration === 'sass') {
    linkFixturePackage(directoryPath, 'sass-embedded');
    linkFixturePackage(directoryPath, 'sass-loader');
  } else if (styleIntegration === 'tailwind') {
    linkFixturePackage(directoryPath, '@tailwindcss/postcss');
    linkFixturePackage(directoryPath, 'tailwindcss');
  }

  fixturePaths.push(directoryPath);

  return directoryPath;
}

async function withFixtureConfig<T>(
  directoryPath: string,
  action: (config: RspackConfig) => T | PromiseLike<T>,
  nodeEnvironment = 'production',
) {
  const originalDirectoryPath = process.cwd();
  const originalNodeEnvironment = process.env.NODE_ENV;

  vi.resetModules();
  vi.doUnmock(detectPackageModulePath);
  vi.doUnmock('../utils/detect-package');
  vi.doUnmock(pathsModulePath);
  vi.doMock(pathsModulePath, () => createPathsMock(directoryPath));
  process.chdir(directoryPath);
  process.env.NODE_ENV = nodeEnvironment;

  try {
    const configModule = await import('../rspack.config');
    return await action((configModule.default as typeof createRspackConfig)());
  } finally {
    vi.doUnmock(pathsModulePath);
    process.chdir(originalDirectoryPath);

    if (originalNodeEnvironment) {
      process.env.NODE_ENV = originalNodeEnvironment;
    } else {
      delete process.env.NODE_ENV;
    }
  }
}

async function buildFixture(directoryPath: string) {
  await withFixtureConfig(directoryPath, runRspackBuild);
}

async function runRspackBuild(config: RspackConfig) {
  const compiler = rspack(config);

  await new Promise<void>((resolve, reject) => {
    compiler.run((error, stats) => {
      compiler.close(closeError => {
        if (error) {
          reject(error);
          return;
        }

        if (closeError) {
          reject(closeError);
          return;
        }

        if (stats?.hasErrors()) {
          reject(new Error(stats.toString('errors-only')));
          return;
        }

        resolve();
      });
    });
  });
}

afterEach(() => {
  for (const fixturePath of fixturePaths) {
    fs.rmSync(fixturePath, { force: true, recursive: true });
  }

  fixturePaths.length = 0;
});

describe('react-scripts build fixtures', () => {
  it('enables persistent cache and lazy dynamic imports in development', async () => {
    const directoryPath = createAppFixture('css');
    await withFixtureConfig(
      directoryPath,
      config => {
        expect(config.cache).toEqual({
          type: 'persistent',
          buildDependencies: [path.join(directoryPath, 'package.json'), rspackConfigModulePath],
        });
        expect(config.lazyCompilation).toEqual({
          entries: false,
          imports: true,
        });
      },
      'development',
    );
  });

  it('uses compact hashed production ids and target-derived minifier ecma', async () => {
    const directoryPath = createAppFixture('css');
    await withFixtureConfig(directoryPath, config => {
      expect(config.optimization?.moduleIds).toBe('compact-hashed');
      expect(config.optimization?.chunkIds).toBe('compact-hashed');
      expect(config.output?.cssFilename).toBe('static/css/[name].[contenthash:8].css');
      expect(config.output?.cssChunkFilename).toBe('static/css/[name].[contenthash:8].chunk.css');
      expect(config.optimization?.splitChunks).toMatchObject({
        chunks: 'all',
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            minChunks: 2,
            minSize: 0,
            reuseExistingChunk: true,
          },
          default: {
            name: 'chunk-common',
            minChunks: 2,
            minSize: 0,
            reuseExistingChunk: true,
          },
        },
      });

      const jsMinimizer = config.optimization?.minimizer?.find(
        minimizer => minimizer instanceof rspack.SwcJsMinimizerRspackPlugin,
      );

      expect(jsMinimizer?._args[0]?.minimizerOptions?.ecma).toBeUndefined();

      const oneOfRules =
        (config.module?.rules?.[0] as { oneOf?: AssetRule[] } | undefined)?.oneOf ?? [];
      const avifRule = oneOfRules.find(rule => rule.mimetype === 'image/avif');
      const imageRule = oneOfRules.find(rule => String(rule.test).includes('png'));

      expect(avifRule?.parser?.dataUrlCondition?.maxSize).toBe(4096);
      expect(imageRule?.parser?.dataUrlCondition?.maxSize).toBe(4096);
    });
  });

  it('builds a plain CSS app without Tailwind or Sass app dependencies', async () => {
    const directoryPath = createAppFixture('css');
    await buildFixture(directoryPath);

    expect(fs.existsSync(path.join(directoryPath, 'build', 'index.html'))).toBe(true);
    expect(fs.readdirSync(path.join(directoryPath, 'build/static/css'))).toContainEqual(
      expect.stringMatching(/\.css$/),
    );
  });

  it('builds a Tailwind app when Tailwind dependencies are installed by the app', async () => {
    const directoryPath = createAppFixture('tailwind');
    await buildFixture(directoryPath);

    expect(fs.existsSync(path.join(directoryPath, 'build', 'index.html'))).toBe(true);
  });

  it('builds a Sass app when Sass dependencies are installed by the app', async () => {
    const directoryPath = createAppFixture('sass');
    await buildFixture(directoryPath);

    expect(fs.existsSync(path.join(directoryPath, 'build', 'index.html'))).toBe(true);
  });
});
