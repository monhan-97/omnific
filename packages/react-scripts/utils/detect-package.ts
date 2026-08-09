import { createRequire } from 'node:module';

import { hasValue } from '@omnific/utils';

const defaultRequire = createRequire(import.meta.url);

/**
 * 解析包时使用的上下文。
 */
export interface DetectPackageOptions {
  /**
   * 作为解析起点的文件路径。
   */
  from?: string;
}

/**
 * 必须解析成功的包配置。
 */
export interface ResolveRequiredPackageOptions extends DetectPackageOptions {
  /**
   * 缺少包时展示给用户的安装命令。
   */
  installCommand: string;
}

function createPackageRequire(options: DetectPackageOptions) {
  const { from } = options;

  if (hasValue(from)) {
    return createRequire(from);
  }

  return defaultRequire;
}

/**
 * 从指定上下文解析包路径。
 */
export function resolvePackage(packageName: string, options: DetectPackageOptions = {}) {
  return createPackageRequire(options).resolve(packageName);
}

/**
 * 从指定上下文解析必需包，缺失时抛出包含安装命令的错误。
 */
export function resolveRequiredPackage(packageName: string, options: ResolveRequiredPackageOptions) {
  const { installCommand, ...detectPackageOptions } = options;

  try {
    return resolvePackage(packageName, detectPackageOptions);
  } catch {
    throw new Error(`Missing optional dependency "${packageName}". Install it with: ${installCommand}`);
  }
}

/**
 * 检查当前模块是否可以解析指定包。
 */
export function detectPackage(packageName: string, options: DetectPackageOptions = {}) {
  try {
    resolvePackage(packageName, options);
    return true;
  } catch {
    return false;
  }
}
