import { createRequire } from 'node:module';
import path from 'node:path';

import { TsCheckerRspackPlugin } from 'ts-checker-rspack-plugin';
import type { Configuration, Mode, RuleSetUseItem, SwcLoaderOptions } from '@rspack/core';
import { rspack } from '@rspack/core';
import { ReactRefreshRspackPlugin } from '@rspack/plugin-react-refresh';

import paths from './paths';
import { detectPackage } from './utils/detect-package';
import { alias, moduleFileExtensions } from './alias';
import { getEnvironment, isDevelopment, isProduction } from './utils/environment';

const hasJsxRuntime = detectPackage('react/jsx-runtime');

const hasTailwind = detectPackage('tailwindcss');

const hasSwcHelper = detectPackage('@swc/helpers');

const sassRegex = /\.(scss|sass)$/;

const cssRegex = /\.css$/;

const imageInlineSizeLimit = 10_000;

const require = createRequire(import.meta.url);

function resolvePackage(packageName: string) {
  return require.resolve(packageName);
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
        /** @type {import('@rspack/core').LightningcssLoaderOptions} */
        options: {
          minify: isEnvironmentProduction,
        },
      },
      {
        loader: resolvePackage('postcss-loader'),
        options: hasTailwind
          ? {
              postcssOptions: {
                ident: 'postcss',
                config: false,
                plugins: [require('@tailwindcss/postcss')],
              },
            }
          : undefined,
      },
    ].filter(Boolean) as RuleSetUseItem[];

    if (preProcessor) {
      loaders.push(preProcessor);
    }

    return loaders;
  }

  const config: Configuration = {
    target: ['browserslist'],
    stats: 'errors-warnings',
    mode: getEnvironment() as Mode,
    bail: isEnvironmentProduction,
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
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      publicPath: paths.publicUrlOrPath,
      devtoolModuleFilenameTemplate: isEnvironmentProduction
        ? info => path.relative(paths.appSrc, info.absoluteResourcePath).replaceAll('\\', '/')
        : info => path.resolve(info.absoluteResourcePath).replaceAll('\\', '/'),
    },
    infrastructureLogging: {
      level: 'none',
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'async',
        minChunks: 1,
        minSize: 20_000,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          vendors: {
            test: /[/\\]node_modules[/\\]/,
            name: 'chunk-vendors',
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
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
            ecma: 5,
            compress: {
              passes: 2,
            },
            format: {
              comments: false,
            },
          },
        }),
      ],
    },
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
            {
              test: sassRegex,
              use: getStyleLoaders({
                loader: resolvePackage('sass-loader'),
                options: {
                  api: 'modern-compiler',
                  implementation: resolvePackage('sass-embedded'),
                },
              }),
              sideEffects: true,
              type: 'css/auto',
            },
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
          ],
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
