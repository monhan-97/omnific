import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Linter } from 'eslint';
import { describe, expect, test } from 'vitest';

import jsxA11y, { configs, rules } from '../src/index';
import packageJson from '../package.json' with { type: 'json' };

const rulesDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/rules');

describe('@omnific/eslint-plugin-jsx-a11y plugin object', () => {
  test('meta matches package.json', () => {
    expect(jsxA11y.meta?.name).toBe(packageJson.name);
    expect(jsxA11y.meta?.version).toBe(packageJson.version);
  });

  test('rules table matches src/rules files', () => {
    const ruleFiles = readdirSync(rulesDirectory)
      .filter(name => name.endsWith('.ts'))
      .map(name => name.replace(/\.ts$/, ''))
      .sort((left, right) => left.localeCompare(right));
    expect(Object.keys(rules).sort((left, right) => left.localeCompare(right))).toEqual(ruleFiles);
  });

  test('configs are self-referential and frozen', () => {
    const recommended = configs?.recommended as Linter.Config | undefined;
    const strict = configs?.strict as Linter.Config | undefined;
    expect(recommended?.plugins?.['jsx-a11y']).toBe(jsxA11y);
    expect(strict?.plugins?.['jsx-a11y']).toBe(jsxA11y);
    expect(recommended?.name).toBe('jsx-a11y/recommended');
    expect(strict?.name).toBe('jsx-a11y/strict');
    expect(Object.isFrozen(jsxA11y)).toBe(true);
    expect(Object.isFrozen(configs)).toBe(true);
  });

  test('every rule declares meta.type and docs.url', () => {
    for (const [name, rule] of Object.entries(rules)) {
      expect(rule.meta?.type, name).toBeTruthy();
      expect(rule.meta?.docs?.url, name).toContain(`/docs/rules/${name}.md`);
      expect(rule.meta?.messages, name).toBeTruthy();
    }
  });
});
