import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directoryName = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(directoryName, '..');
const buildDirectory = path.resolve(siteRoot, 'build');
const indexPath = path.resolve(buildDirectory, 'index.html');

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function isExternalReference(reference) {
  return /^https?:\/\//.test(reference);
}

function normalizeRelativeReference(reference) {
  return reference.replace(/^\.\//, '');
}

if (!fs.existsSync(indexPath)) {
  fail(`Missing react-scripts entry file: ${indexPath}`);
} else {
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  const assetReferences = [...indexHtml.matchAll(/\b(?:href|src)="([^"]*static\/[^"]+)"/g)].map(
    match => match[1],
  );
  const invalidReferences = assetReferences.filter(
    reference => reference.startsWith('/') || isExternalReference(reference),
  );
  const missingFiles = assetReferences
    .map(normalizeRelativeReference)
    .filter(relativePath => !fs.existsSync(path.resolve(buildDirectory, relativePath)));

  if (!indexHtml.includes('id="root"')) {
    fail('Missing React application root in build/index.html.');
  }

  if (indexHtml.includes('__docusaurus') || indexHtml.toLowerCase().includes('docusaurus')) {
    fail('Build output must not contain Docusaurus runtime markers.');
  }

  if (assetReferences.length === 0) {
    fail('No script or stylesheet asset references were found in build/index.html.');
  }

  if (invalidReferences.length > 0) {
    fail(`Asset references must be relative for GitHub Pages: ${invalidReferences.join(', ')}`);
  }

  if (missingFiles.length > 0) {
    fail(`Asset references point to missing files: ${missingFiles.join(', ')}`);
  }
}

if (process.exitCode) {
  process.exit();
}

console.log('Verified GitHub Pages build with relative react-scripts assets.');
