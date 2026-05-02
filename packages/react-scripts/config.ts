import path from 'node:path';

import paths from './paths';
import { findEntryFile } from './utils/find-entry-file';
import type { ReactScriptsConfig } from './main';

export function defineConfig(config: ReactScriptsConfig) {
  return config;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function createConfigImportError(configPath: string, error: unknown) {
  const isTypeScriptConfig = /\.(cts|mts|ts)$/.test(configPath);
  const fileName = path.basename(configPath);
  const helpText = isTypeScriptConfig
    ? ` Native TypeScript import requires Node.js >= 22.18.0. On older Node.js versions, rename the config file to .mjs or .cjs.`
    : '';
  return new Error(`Failed to load ${fileName} with native import().${helpText}`, {
    cause: error,
  });
}

export async function loadReactScriptsConfig() {
  const configPath = findEntryFile(paths.config);

  if (!configPath) {
    return {} satisfies ReactScriptsConfig;
  }

  let moduleNamespace: Record<string, unknown>;

  try {
    moduleNamespace = await import(configPath);
  } catch (error) {
    throw createConfigImportError(configPath, error);
  }

  const config = moduleNamespace.default ?? moduleNamespace;

  if (!isPlainObject(config)) {
    throw new TypeError(`${path.basename(configPath)} must export a configuration object.`);
  }

  return config as ReactScriptsConfig;
}
