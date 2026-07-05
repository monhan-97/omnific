import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/**
 * 检查当前模块是否可以解析指定包。
 */
export function detectPackage(packageName: string) {
  try {
    require.resolve(packageName);
    return true;
  } catch {
    return false;
  }
}
