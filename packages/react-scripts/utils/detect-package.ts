import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export function detectPackage(packageName: string) {
  try {
    require.resolve(packageName);
    return true;
  } catch {
    return false;
  }
}
