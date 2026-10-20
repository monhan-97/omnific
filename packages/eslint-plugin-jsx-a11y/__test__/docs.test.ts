/**
 * @file Consistency checks for rule docs and README.
 */

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Linter } from 'eslint';
import { describe, expect, test } from 'vitest';

import { configs, rules } from '../src/index';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsDir = path.join(packageRoot, 'docs/rules');
const rulesDir = path.join(packageRoot, 'src/rules');
const readmePath = path.join(packageRoot, 'README.md');

/**
 * Returns basenames without extension from `directory` matching `extension`.
 * @param directory - Absolute directory path.
 * @param extension - File extension including the leading dot.
 * @returns Sorted basenames.
 */
function listBasenames(directory: string, extension: string): string[] {
  return readdirSync(directory)
    .filter(name => name.endsWith(extension))
    .map(name => name.slice(0, -extension.length))
    .sort((left, right) => left.localeCompare(right));
}

/**
 * Returns the configured severity for `ruleName` in a flat config rules record.
 * @param configRules - Config rules map.
 * @param ruleName - Rule name without plugin prefix.
 * @returns Severity string/number, or `null` when absent.
 */
function configLevel(
  configRules: Record<string, unknown>,
  ruleName: string,
): string | number | null {
  const entry = configRules[`jsx-a11y/${ruleName}`];
  if (entry === undefined) {
    return null;
  }
  return Array.isArray(entry) ? (entry[0] as string | number) : (entry as string | number);
}

/**
 * Returns whether a severity means the rule is enabled.
 * @param level - Config severity.
 * @returns `true` when the rule reports errors/warnings.
 */
function isEnabled(level: string | number | null): boolean {
  return (['error', 'warn', 2, 1] as const).includes(level as never);
}

/**
 * Returns whether a severity means the rule is explicitly disabled.
 * @param level - Config severity.
 * @returns `true` when the rule is off.
 */
function isDisabled(level: string | number | null): boolean {
  return level === 'off' || level === 0;
}

/**
 * Parses auto-generated docs header markers for recommended / strict.
 * @param header - Text before `<!-- end auto-generated rule header -->`.
 * @returns Enablement markers found in the header.
 */
function parseConfigMarkers(header: string): {
  recommendedEnabled: boolean;
  recommendedDisabled: boolean;
  strictEnabled: boolean;
  strictDisabled: boolean;
} {
  const enabled = /💼 This rule is enabled/.test(header);
  const disabled = /🚫 This rule is _disabled_/.test(header);
  const recommends = header.includes('☑️ `recommended`');
  const stricts = header.includes('🔒 `strict`');
  return {
    recommendedEnabled: enabled && recommends,
    recommendedDisabled: disabled && recommends,
    strictEnabled: enabled && stricts,
    strictDisabled: disabled && stricts,
  };
}

describe('docs consistency', () => {
  const ruleNames = listBasenames(rulesDir, '.ts');
  const docNames = listBasenames(docsDir, '.md');
  const readme = readFileSync(readmePath, 'utf8');
  const recommendedConfig = configs?.recommended as Linter.Config | undefined;
  const strictConfig = configs?.strict as Linter.Config | undefined;
  const recommended = (recommendedConfig?.rules ?? {}) as Record<string, unknown>;
  const strict = (strictConfig?.rules ?? {}) as Record<string, unknown>;

  test('src/rules and docs/rules are 1:1', () => {
    expect(docNames).toEqual(ruleNames);
    expect(Object.keys(rules).sort((left, right) => left.localeCompare(right))).toEqual(ruleNames);
  });

  test('README rules table covers every rule', () => {
    for (const name of ruleNames) {
      expect(readme).toContain(`[\`${name}\`](docs/rules/${name}.md)`);
    }
  });

  test('docs headers match recommended / strict enablement', () => {
    for (const name of ruleNames) {
      const doc = readFileSync(path.join(docsDir, `${name}.md`), 'utf8');
      const end = doc.indexOf('<!-- end auto-generated rule header -->');
      const header = end === -1 ? doc.slice(0, 400) : doc.slice(0, end);
      const markers = parseConfigMarkers(header);

      const recLevel = configLevel(recommended, name);
      const strictLevel = configLevel(strict, name);

      if (isEnabled(recLevel)) {
        expect(markers.recommendedEnabled, `${name}: recommended enabled in docs`).toBe(true);
      } else if (isDisabled(recLevel)) {
        expect(markers.recommendedDisabled, `${name}: recommended disabled in docs`).toBe(true);
      } else {
        expect(markers.recommendedEnabled, `${name}: not in recommended`).toBe(false);
      }

      if (isEnabled(strictLevel)) {
        expect(markers.strictEnabled, `${name}: strict enabled in docs`).toBe(true);
      } else if (isDisabled(strictLevel)) {
        expect(markers.strictDisabled, `${name}: strict disabled in docs`).toBe(true);
      } else {
        expect(markers.strictEnabled, `${name}: not in strict`).toBe(false);
      }
    }
  });

  test('meta.docs.url points at package docs', () => {
    for (const name of ruleNames) {
      const url = rules[name as keyof typeof rules].meta?.docs?.url;
      expect(url).toContain(`/packages/eslint-plugin-jsx-a11y/docs/rules/${name}.md`);
    }
  });
});
