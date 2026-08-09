import { describe, expect, it } from 'vitest';
import * as iconExports from '@omnific/icons';
import { isFunction } from '@omnific/utils';

import { iconEntries } from '../icon-entries';

const compareNames = (left: string, right: string) => left.localeCompare(right);
const iconExportMap: Record<string, unknown> = iconExports;

describe('iconEntries', () => {
  it('stays synchronized with public runtime icon exports', () => {
    const exportedIconNames = Object.entries(iconExports)
      .filter(([name, value]) => name.endsWith('Icon') && isFunction(value))
      .map(([name]) => name)
      .sort(compareNames);

    const previewIconNames = iconEntries.map(icon => icon.name).sort(compareNames);
    const previewIconNameSet = new Set(previewIconNames);
    const exportedIconNameSet = new Set(exportedIconNames);

    const missing = exportedIconNames.filter(name => !previewIconNameSet.has(name));
    const extra = previewIconNames.filter(name => !exportedIconNameSet.has(name));

    expect({ extra, missing }).toEqual({ extra: [], missing: [] });
  });

  it('keeps each preview entry unique and linked to the exported component', () => {
    const previewIconNames = iconEntries.map(icon => icon.name);

    expect(new Set(previewIconNames).size).toBe(previewIconNames.length);

    for (const icon of iconEntries) {
      expect(icon.Component).toBe(iconExportMap[icon.name]);
    }
  });
});
