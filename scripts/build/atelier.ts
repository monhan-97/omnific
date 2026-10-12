import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { compile } from 'sass-embedded';
import { build } from 'tsdown';

import { defaultSystem } from '../../packages/atelier/system/default-system';

type BuildStep = {
  title: string;
  run: () => Promise<void> | void;
};

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const atelierDir = path.resolve(currentDir, '../../packages/atelier');

/**
 * 生成 Atelier 的扁平颜色 key。
 */
const buildColorKeys = () => {
  const colorKeys = Object.keys(defaultSystem.colors);

  const colorKeyLines =
    colorKeys.length > 0 ? colorKeys.map(key => `  | '${key}'`) : ['  | never'];

  const lines = [
    '// This file is generated. Do not edit.',
    '',
    'export type DefaultColorKey =',
    ...colorKeyLines,
    ';',
    '',
  ];

  writeFileSync(path.resolve(atelierDir, 'system/defaults/color-keys.gen.ts'), lines.join('\n'));
};

const buildJavaScript = async () => {
  await build({
    config: path.resolve(atelierDir, 'tsdown.config.mjs'),
    cwd: atelierDir,
  });
};

const buildStyles = () => {
  const result = compile(path.resolve(atelierDir, 'styles/index.scss'), {
    style: 'expanded',
    sourceMap: false,
  });

  writeFileSync(path.resolve(atelierDir, 'dist/styles.css'), result.css);
};

const steps: BuildStep[] = [
  {
    title: 'Generate color keys',
    run: buildColorKeys,
  },
  {
    title: 'Build JavaScript',
    run: buildJavaScript,
  },
  {
    title: 'Build styles',
    run: buildStyles,
  },
];

const runStep = async (step: BuildStep) => {
  process.stdout.write(`\n▶ ${step.title}\n`);
  await step.run();
};

try {
  for (const step of steps) {
    await runStep(step);
  }

  process.stdout.write('\n✅ Build completed\n');
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  process.stderr.write(`\n❌ ${message}\n`);
  process.exitCode = 1;
}
