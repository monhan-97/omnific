import type { Configuration } from '@rspack/core';

/**
 * 用于自定义生成后 Rspack 配置的钩子函数。
 */
export type ConfigureRspack = (config: Configuration) => Configuration;

/**
 * react-scripts 接受的用户配置。
 */
export type ReactScriptsConfig = {
  configureRspack?: ConfigureRspack;
};

/**
 * 定义带类型约束的 react-scripts 配置对象。
 */
export function defineConfig(config: ReactScriptsConfig) {
  return config;
}

export { default as paths } from './paths';

export { getEnvironment, isDevelopment, isProduction } from './utils/environment';
