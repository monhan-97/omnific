import type { Configuration, Mode } from '@rspack/core';
import { isFunction, isUndefined } from '@omnific/utils';
import { merge } from 'rspack-merge';

import { startBuild } from './scripts/build';
import { startDevelopment } from './scripts/development';
import { DEVELOPMENT, PRODUCTION } from './utils/environment';
import { findEntryFile } from './utils/find-entry-file';
import paths from './paths';
import createRspackConfig from './rspack.config';
import type { ConfigureRspack, ReactScriptsConfig } from './main';

/**
 * 传递给构建和开发命令的运行时上下文。
 */
export type ScriptContext = {
  mode: Mode;
  service: Service;
  rspackConfig: Configuration;
};

/**
 * 协调命令执行、环境设置和用户配置加载。
 */
export class Service {
  initialized: boolean = false;

  mode: Mode = DEVELOPMENT;

  commands = {
    dev: startDevelopment,
    build: startBuild,
  };

  projectOptions: ReactScriptsConfig | undefined;

  webpackRawConfigFns: ConfigureRspack[] = [];

  async init(mode: Mode) {
    if (this.initialized) return;

    this.initialized = true;
    this.mode = mode;

    this.loadEnv(mode);

    await this.loaderUserConfig();
  }

  async run(name: string) {
    const command = this.commands[name as keyof typeof this.commands];

    if (isUndefined(command) && name) {
      throw new Error(`command "${name}" does not exist.`);
    }

    const mode = name === 'dev' ? DEVELOPMENT : PRODUCTION;

    await this.init(mode);

    await command({
      mode,
      service: this,
      rspackConfig: this.resolveRspackConfig(),
    });
  }

  async loaderUserConfig() {
    const configPath = findEntryFile(paths.config);

    if (configPath) {
      const userConfigModule = await import(configPath);
      this.handleLoadedUserConfig(userConfigModule.default);
    }
  }

  resolveRspackConfig() {
    if (!this.initialized) {
      throw new Error('Service must call init() before calling resolveRspackConfig().');
    }
    let baseConfig = createRspackConfig();
    for (const function_ of this.webpackRawConfigFns) {
      if (!isFunction(function_)) {
        continue;
      }

      const rspackConfig = function_(baseConfig);
      if (rspackConfig) baseConfig = merge(baseConfig, rspackConfig);
    }
    return baseConfig;
  }

  loadEnv(mode: Mode) {
    process.env.NODE_ENV = mode;
  }

  handleLoadedUserConfig(data: ReactScriptsConfig) {
    this.projectOptions = data;
    if (data.configureRspack) {
      this.webpackRawConfigFns.push(data.configureRspack);
    }
  }
}
