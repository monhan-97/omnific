import { existsSync } from 'node:fs';

const fileExtensions = ['ts', 'mts', 'mjs', 'cjs', 'js'];

/**
 * Find a file with any of the supported JavaScript extensions
 * @param basePath - The base path without extension
 * @returns The file path with extension if found, or a default path
 */
export function findEntryFile(basePath: string) {
  for (const ext of fileExtensions) {
    const filePath = `${basePath}.${ext}`;
    if (existsSync(filePath)) {
      return filePath;
    }
  }
}
