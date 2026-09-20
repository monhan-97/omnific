import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { TsCheckerRspackPlugin } from 'ts-checker-rspack-plugin';
import type {
  Configuration,
  Mode,
  RuleSetRule,
  RuleSetUseItem,
  SwcLoaderOptions,
} from '@rspack/core';
import { rspack } from '@rspack/core';
import { ReactRefreshRspackPlugin } from '@rspack/plugin-react-refresh';
import { hasValue } from '@omnific/utils';

import paths from './paths';
import { detectPackage, resolvePackage, resolveRequiredPackage } from './utils/detect-package';
import { alias, moduleFileExtensions } from './alias';
import { getEnvironment, isDevelopment, isProduction } from './utils/environment';
import { findEntryFile } from './utils/find-entry-file';

const appPackageOptions = { from: paths.appPackageJson };

const hasJsxRuntime = detectPackage('react/jsx-runtime', appPackageOptions);

const hasTailwind = detectPackage('tailwindcss', appPackageOptions);

const tailwindPostcssPluginPath = hasTailwind
  ? resolveRequiredPackage('@tailwindcss/postcss', {
      ...appPackageOptions,
      installCommand: 'pnpm add -D tailwindcss @tailwindcss/postcss',
    })
  : undefined;

const hasSwcHelper = detectPackage('@swc/helpers');

const sassRegex = /\.(scss|sass)$/;

const cssRegex = /\.css$/;

const imageInlineSizeLimit = 4096;

const require = createRequire(import.meta.url);

function getCacheBuildDependencies() {
  const filePaths = [
    paths.appPackageJson,
    paths.appTsConfig,
    findEntryFile(paths.config),
    fileURLToPath(import.meta.url),
  ];

  return filePaths.filter(
    (filePath): filePath is string => hasValue(filePath) && existsSync(filePath),
  );
}

/**
 * 创建开发和生产构建共用的基础 Rspack 配置。
 */
function createRspackConfig() {
  const isEnvironmentDevelopment = isDevelopment();

  const isEnvironmentProduction = isProduction();

  function getStyleLoaders(preProcessor?: RuleSetUseItem) {
    const loaders = [
      isEnvironmentProduction && {
        loader: rspack.CssExtractRspackPlugin.loader,
        // CSS is located in `static/css`, use '../../' to locate index.html folder
        // in production `paths.publicUrlOrPath` can be a relative path
        options: paths.publicUrlOrPath.startsWith('.') ? { publicPath: '../../' } : {},
      },
      {
        loader: 'builtin:lightningcss-loader',
      },
      hasTailwind && {
        loader: resolvePackage('postcss-loader'),
        options: {
          postcssOptions: {
            ident: 'postcss',
            config: false,
            plugins: hasValue(tailwindPostcssPluginPath)
              ? [require(tailwindPostcssPluginPath)]
              : [],
          },
        },
      },
    ].filter(Boolean) as RuleSetUseItem[];

    if (preProcessor) {
      loaders.push(preProcessor);
    }

    return loaders;
  }

  const sassRule: RuleSetRule = {
    test: sassRegex,
    use: () =>
      getStyleLoaders({
        loader: resolveRequiredPackage('sass-loader', {
          ...appPackageOptions,
          installCommand: 'pnpm add -D sass-loader sass-embedded',
        }),
        options: {
          api: 'modern-compiler',
          implementation: resolveRequiredPackage('sass-embedded', {
            ...appPackageOptions,
            installCommand: 'pnpm add -D sass-loader sass-embedded',
          }),
        },
      }),
    sideEffects: true,
    type: 'css/auto',
  };

  const config: Configuration = {
    target: ['browserslist'],
    stats: 'errors-warnings',
    mode: getEnvironment() as Mode,
    bail: isEnvironmentProduction,
    cache: {
      type: 'persistent',
      buildDependencies: getCacheBuildDependencies(),
    },
    lazyCompilation: isEnvironmentDevelopment
      ? {
          entries: false,
          imports: true,
        }
      : false,
    devtool: isEnvironmentDevelopment && 'cheap-module-source-map',
    entry: paths.appIndexJs,
    output: {
      path: paths.appBuild,
      pathinfo: isEnvironmentDevelopment,
      filename: isEnvironmentProduction
        ? 'static/js/[name].[contenthash:8].js'
        : 'static/js/[name].js',
      chunkFilename: isEnvironmentProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : 'static/js/[name].chunk.js',
      cssFilename: isEnvironmentProduction
        ? 'static/css/[name].[contenthash:8].css'
        : 'static/css/[name].css',
      cssChunkFilename: isEnvironmentProduction
        ? 'static/css/[name].[contenthash:8].chunk.css'
        : 'static/css/[name].chunk.css',
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      publicPath: paths.publicUrlOrPath,
      devtoolModuleFilenameTemplate: isEnvironmentProduction
        ? info => path.relative(paths.appSrc, info.absoluteResourcePath).replaceAll('\\', '/')
        : info => path.resolve(info.absoluteResourcePath).replaceAll('\\', '/'),
    },
    infrastructureLogging: {
      level: 'none',
    },
    optimization: isEnvironmentProduction
      ? {
          moduleIds: 'compact-hashed',
          chunkIds: 'compact-hashed',
          runtimeChunk: 'single',
          splitChunks: {
            chunks: 'all',
            minChunks: 1,
            minSize: 20_000,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            cacheGroups: {
              vendors: {
                test: /[/\\]node_modules[/\\]/,
                name: 'chunk-vendors',
                minChunks: 2,
                minSize: 0,
                priority: -10,
                reuseExistingChunk: true,
              },
              default: {
                name: 'chunk-common',
                minChunks: 2,
                minSize: 0,
                priority: -20,
                reuseExistingChunk: true,
              },
            },
          },
          minimizer: [
            new rspack.LightningCssMinimizerRspackPlugin(),
            new rspack.SwcJsMinimizerRspackPlugin({
              extractComments: false,
              minimizerOptions: {
                minify: true,
                mangle: true,
                compress: {
                  passes: 2,
                },
                format: {
                  comments: false,
                },
              },
            }),
          ],
        }
      : undefined,
    resolve: {
      extensions: moduleFileExtensions,
      alias: alias,
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: [/\.avif$/],
              type: 'asset',
              mimetype: 'image/avif',
              parser: {
                dataUrlCondition: {
                  maxSize: imageInlineSizeLimit,
                },
              },
            },
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: imageInlineSizeLimit,
                },
              },
            },
            {
              test: /\.[jt]sx?$/,
              exclude: [/node_modules/],
              use: {
                loader: 'builtin:swc-loader',
                options: {
                  jsc: {
                    externalHelpers: hasSwcHelper,
                    parser: {
                      syntax: 'typescript',
                      tsx: true,
                    },
                    transform: {
                      react: {
                        throwIfNamespace: true,
                        development: isEnvironmentDevelopment,
                        useBuiltins: true,
                        runtime: hasJsxRuntime ? 'automatic' : 'classic',
                        refresh: isEnvironmentDevelopment,
                      },
                    },
                  },
                  module: {
                    type: 'es6',
                  },
                } satisfies SwcLoaderOptions,
              },
            },
            sassRule,
            {
              test: cssRegex,
              use: getStyleLoaders(),
              sideEffects: true,
              type: 'css/auto',
            },
            {
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              type: 'asset/resource',
            },
          ].filter(Boolean) as RuleSetRule[],
        },
      ],
      parser: {
        'css/auto': {
          namedExports: false,
        },
      },
    },
    plugins: [
      new rspack.HtmlRspackPlugin({
        inject: true,
        template: paths.appHtml,
        minify: isEnvironmentProduction,
      }),

      isEnvironmentDevelopment && new rspack.CaseSensitivePlugin(),

      isEnvironmentDevelopment && new ReactRefreshRspackPlugin(),

      isEnvironmentDevelopment &&
        new TsCheckerRspackPlugin({
          async: true,
          formatter: 'basic',
          devServer: false,
          typescript: {
            mode: 'write-tsbuildinfo',
            diagnosticOptions: {
              semantic: true,
              syntactic: false,
              declaration: false,
              global: false,
            },
            configOverwrite: {
              compilerOptions: {
                incremental: true,
                skipLibCheck: true,
                noEmit: true,
                tsBuildInfoFile: paths.tsBuildInfoFile,
              },
            },
          },
        }),
    ],

    performance: false,
  };

  return config;
}

export default createRspackConfig;
