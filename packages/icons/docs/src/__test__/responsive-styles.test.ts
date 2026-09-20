import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const directoryName = path.dirname(fileURLToPath(import.meta.url));
const layoutCssPath = path.resolve(
  directoryName,
  '../style/icon-gallery-layout.css',
);
const themeCssPath = path.resolve(
  directoryName,
  '../style/icon-gallery-theme.css',
);

describe('responsive styles', () => {
  it('keeps the icon gallery constrained on narrow screens', () => {
    const layoutCss = fs.readFileSync(layoutCssPath, 'utf8');
    expect(layoutCss).toContain('@media (max-width: 800px)');
    expect(layoutCss).toContain("width: min(320px, calc(100% - 48px));");
    expect(layoutCss).toContain('left: 0;');
    expect(layoutCss).toContain('grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));');
    expect(layoutCss).toContain('gap: 8px;');
    expect(layoutCss).toContain('padding: 32px 0 0;');
    expect(layoutCss).toContain('pointer-events: none;');
    expect(layoutCss).toContain('pointer-events: auto;');
  });

  it('does not include Docusaurus navbar styling', () => {
    const themeCss = fs.readFileSync(themeCssPath, 'utf8');

    expect(themeCss).not.toContain('.navbar');
    expect(themeCss).not.toContain('--ifm-');
  });

  it('matches Lucide metadata typography and badge styling', () => {
    const themeCss = fs.readFileSync(themeCssPath, 'utf8');
    const keywordsRule = themeCss.match(/\.icon-keywords\s*{([^}]*)}/)?.[1];
    const categoriesRule = themeCss.match(/\.category-tags span\s*{([^}]*)}/)?.[1];

    expect(keywordsRule).toContain('font-size: 1rem;');
    expect(keywordsRule).toContain('font-weight: 500;');
    expect(keywordsRule).toContain('line-height: 28px;');
    expect(categoriesRule).toContain('background: #f6f6f7;');
    expect(categoriesRule).toContain('border: 1px solid transparent;');
    expect(categoriesRule).toContain('font-size: 1rem;');
    expect(categoriesRule).toContain('font-weight: 600;');
  });
});
