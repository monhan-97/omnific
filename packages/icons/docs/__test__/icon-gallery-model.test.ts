import { describe, expect, it, vi } from 'vitest';

import { iconEntries } from '../icon-entries';
import {
  type ClipboardWriter,
  copyExampleToClipboard,
  createIconExamples,
  defaultIconCustomizerSettings,
  filterIcons,
  getCopyStatusLabel,
} from '../icon-gallery-model';

describe('icon gallery model', () => {
  it('filters icons by name without case sensitivity', () => {
    expect(filterIcons(iconEntries, 'eye').map(icon => icon.name)).toEqual([
      'EyeIcon',
      'EyeOffIcon',
    ]);
    expect(filterIcons(iconEntries, 'LOADING').map(icon => icon.name)).toEqual(['LoadingIcon']);
  });

  it('returns an empty list when the search has no matches', () => {
    expect(filterIcons(iconEntries, 'calendar')).toEqual([]);
  });

  it('creates SVG and JSX examples for the selected icon', () => {
    const examples = createIconExamples('EyeIcon', defaultIconCustomizerSettings);

    expect(examples).toEqual({
      svg: '',
      jsx: '<EyeIcon color="#000000" size={24} strokeWidth={2} aria-label="EyeIcon" />',
    });
  });

  it('includes absolute stroke width when enabled in customizer examples', () => {
    expect(
      createIconExamples('LoadingIcon', {
        ...defaultIconCustomizerSettings,
        absoluteStrokeWidth: true,
      }).jsx,
    ).toBe(
      '<LoadingIcon color="#000000" size={24} strokeWidth={2} absoluteStrokeWidth aria-label="LoadingIcon" />',
    );
  });

  it('reports copy success after writing the selected example', async () => {
    const writeText: ClipboardWriter['writeText'] = vi.fn();

    vi.mocked(writeText).mockResolvedValue();

    await expect(
      copyExampleToClipboard({
        clipboard: { writeText },
        content: '<svg />',
        kind: 'svg',
      }),
    ).resolves.toBe('svg-success');
    expect(writeText).toHaveBeenCalledWith('<svg />');
    expect(getCopyStatusLabel('svg-success', 'svg')).toBe('Copied!');
  });

  it('reports copy failure when clipboard is missing or rejects', async () => {
    const writeText: ClipboardWriter['writeText'] = vi.fn();

    vi.mocked(writeText).mockRejectedValue(new Error('denied'));

    await expect(
      copyExampleToClipboard({
        clipboard: undefined,
        content: '<EyeIcon aria-label="EyeIcon" />',
        kind: 'jsx',
      }),
    ).resolves.toBe('jsx-failed');
    await expect(
      copyExampleToClipboard({
        clipboard: { writeText },
        content: '<EyeIcon aria-label="EyeIcon" />',
        kind: 'jsx',
      }),
    ).resolves.toBe('jsx-failed');
    expect(getCopyStatusLabel('jsx-failed', 'jsx')).toBe('Copy failed');
  });
});
