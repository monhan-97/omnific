import { describe, expect, it } from 'vitest';

import parserOptionsMapper from './parserOptionsMapper';
import parsers from './parsers';
import type { ParserTestCase } from './parsers';
import { RuleTester } from './ruleTester';

describe('ruleTester', () => {
  it('wires vitest runners onto RuleTester', () => {
    expect(RuleTester.describe).toBe(describe);
    expect(RuleTester.it).toBe(it);
    expect(RuleTester.itOnly).toBeTypeOf('function');
    expect(RuleTester.getDefaultConfig().languageOptions).toMatchObject({
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    });
  });
});

describe('parsers.all', () => {
  it('expands each case into default and TypeScript parser variants', () => {
    const cases = parsers.all([
      {
        code: '<div />',
        options: [{ allow: true }],
        settings: { 'jsx-a11y': { components: { Link: 'a' } } },
      },
    ]);

    expect(cases).toHaveLength(2);
    expect(cases[0]?.code).toContain('parser: default');
    expect(cases[0]?.code).toContain('options:');
    expect(cases[0]?.code).toContain('settings:');
    expect((cases[0] as ParserTestCase | undefined)?.languageOptions?.parser).toBeUndefined();
    expect(cases[1]?.code).toContain('parser: @typescript-eslint/parser');
    expect((cases[1] as ParserTestCase | undefined)?.languageOptions?.parser).toBeDefined();
  });

  it('annotates invalid output and suggestion output', () => {
    const [defaultCase] = parsers.all([
      {
        code: '<img />',
        output: '<img alt="" />',
        errors: [
          {
            message: 'missing alt',
            suggestions: [{ desc: 'add alt', output: '<img alt="x" />' }],
          },
        ],
      },
    ]);

    expect(defaultCase && 'output' in defaultCase ? defaultCase.output : undefined).toContain(
      'parser: default',
    );
    expect(defaultCase && 'errors' in defaultCase ? defaultCase.errors : undefined).toEqual([
      {
        message: 'missing alt',
        suggestions: [
          {
            desc: 'add alt',
            output: expect.stringContaining('parser: default'),
          },
        ],
      },
    ]);
  });
});

describe('parserOptionsMapper', () => {
  it('fills flat-config languageOptions defaults', () => {
    expect(
      parserOptionsMapper({
        code: '<div />',
        languageOptions: {
          sourceType: 'script',
        },
      }),
    ).toEqual({
      code: '<div />',
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'script',
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    });
  });
});
