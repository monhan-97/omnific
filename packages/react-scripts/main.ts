import type { Configuration } from '@rspack/core';

export type ConfigureRspack = (config: Configuration) => Configuration;

export type ReactScriptsConfig = {
  configureRspack?: ConfigureRspack;
};

export function defineConfig(config: ReactScriptsConfig) {
  return config;
}

export { default as paths } from './paths';

export { getEnv, isDevelopment, isProduction } from './utils/env';
