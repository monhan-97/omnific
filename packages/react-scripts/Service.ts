import type { Configuration, Mode } from '@rspack/core';
import { merge } from 'webpack-merge';

import { startBuild } from './scripts/build';
import { startDev } from './scripts/dev';
import { DEVELOPMENT, PRODUCTION } from './utils/env';
import { findEntryFile } from './utils/find-entry-file';
import paths from './paths';
import createRspackConfig from './rspack.config';
import type { ConfigureRspack, ReactScriptsConfig } from './main';

export type ScriptContext = {
  mode: Mode;
  service: Service;
  rspackConfig: Configuration;
};

export class Service {
  initialized: boolean = false;

  mode: Mode = DEVELOPMENT;

  commands = {
    dev: startDev,
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
    let command = this.commands[name as keyof typeof this.commands];

    if (!command && name) {
      throw new Error(`command "${name}" does not exist.`);
    }

    let mode = name === 'dev' ? DEVELOPMENT : PRODUCTION;

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
      const res = await import(configPath);
      this.handleLoadedUserConfig(res.default);
    }
  }

  resolveRspackConfig() {
    if (!this.initialized) {
      throw new Error('Service must call init() before calling resolveRspackConfig().');
    }

    let baseConfig = createRspackConfig();

    for (const fn of this.webpackRawConfigFns) {
      if (typeof fn === 'function') {
        const res = fn(baseConfig);
        if (res) {
          baseConfig = merge(baseConfig, res);
        }
      }
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
