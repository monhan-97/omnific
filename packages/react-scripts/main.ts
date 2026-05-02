import type { Configuration } from '@rspack/core';

export type ReactScriptsConfig = {
  configureRspack?: (config: Configuration) => Configuration;
};

export function defineConfig(config: ReactScriptsConfig) {
  return config;
}

export { default as paths } from './paths';

export { getEnv, isBuild, isDevelopment, isProduction } from './utils/env';
