import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';

const require = createRequire(import.meta.url);

const getAbsolutePath = (packageName: string) =>
  path.dirname(require.resolve(`${packageName}/package.json`));

const workspaceSource = (relativePath: string) =>
  fileURLToPath(new URL(relativePath, import.meta.url));

const developmentAliases = [
  {
    find: '@omnific/atelier/styles.css',
    replacement: workspaceSource('../packages/atelier/styles/index.scss'),
  },
  { find: '@omnific/atelier', replacement: workspaceSource('../packages/atelier/main.ts') },
  { find: '@omnific/icons', replacement: workspaceSource('../packages/icons/main.ts') },
  { find: '@omnific/hooks', replacement: workspaceSource('../packages/hooks/main.ts') },
  { find: '@omnific/utils', replacement: workspaceSource('../packages/utils/main.ts') },
];

const config: StorybookConfig = {
  addons: [getAbsolutePath('@storybook/addon-a11y')],
  core: {
    disableProjectJson: true,
    disableTelemetry: true,
  },
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  stories: ['../packages/atelier/__stories__/*.stories.tsx'],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      // 官方推荐：从字面量 union / enum 抽出 select options
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // 官方默认：过滤 node_modules 里的原生/第三方 props，减少 Controls 噪音
      propFilter: prop => !prop.parent || !/node_modules/.test(prop.parent.fileName),
      // Vite docgen 用 include∩tsconfig 建 program；默认 **/*.tsx 的 glob 不进 .storybook，
      // 但 createFilter 仍会处理 preview，从而误报 “not included in the active TypeScript project”
      include: ['packages/atelier/**/*.tsx'],
      exclude: [
        '**/*.stories.tsx',
        '**/*.test.tsx',
        'packages/atelier/**/examples/**',
      ],
      tsconfigPath: './tsconfig.json',
    },
  },
  viteFinal: (config, { configType }) => {
    const nextConfig = {
      ...config,
      // Pages 挂在 /omnific/atelier/ 下，生产构建用相对路径避免根路径资源 404
      base: configType === 'PRODUCTION' ? './' : '/',
    };

    if (configType !== 'DEVELOPMENT') return nextConfig;

    return {
      ...nextConfig,
      resolve: {
        ...nextConfig.resolve,
        alias: developmentAliases,
      },
    };
  },
};

export default config;
