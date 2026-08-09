import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { IconGallery } from '../IconGallery';
import type { IconEntry, IconPreviewProps } from '../icon-entries';
import { iconEntries } from '../icon-entries';

const previewRenderCounter = { value: 0 };

function TrackedIcon(props: IconPreviewProps) {
  previewRenderCounter.value += 1;
  return <svg {...props} />;
}

const trackedIconEntries: readonly IconEntry[] = [
  {
    name: 'TrackedIcon',
    Component: TrackedIcon,
    description: 'Tracks preview renders.',
    categories: ['Testing'],
    keywords: ['test'],
  },
];

describe('IconGallery', () => {
  it('renders the Lucide-style workspace without a navigation shell', () => {
    render(<IconGallery icons={iconEntries} />);

    expect(screen.queryByRole('navigation', { name: 'Main Navigation' })).not.toBeInTheDocument();
    expect(screen.getByRole('main', { name: 'Icons' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Customizer' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Icon browser' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search 3 icons…')).toBeInTheDocument();
  });

  it('uses accessible icon buttons and opens details on demand', async () => {
    const user = userEvent.setup();

    render(<IconGallery icons={iconEntries} />);

    expect(screen.getByRole('button', { name: 'EyeIcon' })).toHaveAttribute('title', 'EyeIcon');
    expect(screen.queryByRole('img', { name: 'EyeIcon large preview' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'EyeIcon' }));

    expect(screen.getByRole('img', { name: 'EyeIcon large preview' })).toBeInTheDocument();
    expect(screen.queryByText('v0.0.0')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'EyeIcon' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('switches the selected icon while the details drawer is open', async () => {
    const user = userEvent.setup();

    render(<IconGallery icons={iconEntries} />);
    await user.click(screen.getByRole('button', { name: 'EyeIcon' }));
    await user.click(screen.getByRole('button', { name: 'EyeOffIcon' }));

    expect(screen.getByRole('button', { name: 'EyeIcon' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'EyeOffIcon' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { name: 'EyeOffIcon' })).toBeInTheDocument();
  });

  it('supports keyboard selection and moves focus to the details heading', async () => {
    const user = userEvent.setup();

    render(<IconGallery icons={iconEntries} />);

    screen.getByRole('button', { name: 'EyeIcon' }).focus();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('heading', { name: 'EyeIcon' })).toHaveFocus();
  });

  it('supports Space selection from the icon grid', async () => {
    const user = userEvent.setup();

    render(<IconGallery icons={iconEntries} />);

    screen.getByRole('button', { name: 'EyeOffIcon' }).focus();
    await user.keyboard(' ');

    expect(screen.getByRole('heading', { name: 'EyeOffIcon' })).toHaveFocus();
  });

  it('filters icon buttons and exposes copy controls after selection', async () => {
    const user = userEvent.setup();

    render(<IconGallery icons={iconEntries} />);
    const search = screen.getByRole('searchbox', { name: 'Search icons' });

    await user.type(search, 'loading');

    expect(screen.getByRole('button', { name: 'LoadingIcon' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'EyeIcon' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'LoadingIcon' }));
    expect(screen.getByRole('button', { name: 'Copy svg example' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy jsx example' })).toBeInTheDocument();
  });

  it('keeps copy labels stable and exposes Lucide-style copy menus', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<IconGallery icons={iconEntries} />);
    await user.click(screen.getByRole('button', { name: 'EyeIcon' }));

    const copySvgButton = screen.getByRole('button', { name: 'Copy svg example' });
    await user.click(copySvgButton);

    expect(copySvgButton).toHaveTextContent('Copy SVG');
    expect(copySvgButton).toHaveClass('animate');
    expect(copySvgButton).toHaveAttribute('data-confetti-text', 'Copied!');
    expect(screen.queryByText('Copied!', { selector: '.copy-feedback' })).not.toBeInTheDocument();
    expect(writeText).toHaveBeenCalledOnce();

    await user.click(screen.getByRole('button', { name: 'Show SVG options' }));
    expect(screen.getAllByRole('option').map(option => option.textContent)).toEqual([
      'Copy SVG',
      'Copy Data URL',
      'Download SVG',
      'Download PNG',
    ]);

    await user.click(screen.getByRole('button', { name: 'Show JSX options' }));
    expect(screen.getAllByRole('option').map(option => option.textContent)).toEqual([
      'Copy JSX',
      'Copy Component Name',
      'Copy Vue',
      'Copy Svelte',
      'Copy Angular',
    ]);
  });

  it('applies customizer controls to grid, details, and JSX examples', async () => {
    const user = userEvent.setup();

    render(<IconGallery icons={iconEntries} />);

    fireEvent.change(screen.getByRole('slider', { name: 'Icon size' }), {
      target: { value: '40' },
    });
    await user.click(screen.getByRole('switch', { name: 'Absolute stroke width' }));
    await user.click(screen.getByRole('button', { name: 'EyeIcon' }));

    expect(screen.getByRole('img', { name: 'EyeIcon large preview' })).toHaveAttribute(
      'width',
      'var(--icon-size)',
    );
    expect(screen.getByRole('button', { name: 'EyeIcon' }).querySelector('svg')).toHaveAttribute(
      'width',
      'var(--icon-size)',
    );
    expect(screen.getByRole('main', { name: 'Icons' })).toHaveStyle({
      '--icon-size': '40px',
    });
  });

  it('updates icon appearance without rerendering icon components', () => {
    previewRenderCounter.value = 0;
    render(<IconGallery icons={trackedIconEntries} />);

    expect(previewRenderCounter.value).toBe(1);

    fireEvent.change(screen.getByRole('slider', { name: 'Icon size' }), {
      target: { value: '40' },
    });

    expect(screen.getByRole('main', { name: 'Icons' })).toHaveStyle({
      '--icon-size': '40px',
    });
    expect(previewRenderCounter.value).toBe(1);
  });

  it('shows icon categories without an All item, view controls, or sidebar branding', () => {
    render(<IconGallery icons={iconEntries} />);
    const sidebar = screen.getByRole('complementary', {
      name: 'Icon customizer and categories',
    });

    expect(screen.getByRole('heading', { name: 'Categories' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^All/ })).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'AccessibilityCount of icons in Accessibility' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'View' })).not.toBeInTheDocument();
    expect(sidebar).not.toHaveTextContent('@omnific/icons');
    expect(sidebar).not.toHaveTextContent('public icons');
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('filters icons by category and keeps category counts visible', async () => {
    const user = userEvent.setup();

    render(<IconGallery icons={iconEntries} />);
    await user.click(screen.getByRole('button', { name: /^Status/ }));

    expect(screen.getByRole('button', { name: 'LoadingIcon' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'EyeIcon' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('1 matching icons')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^Status/ }));
    expect(screen.getByRole('button', { name: 'EyeIcon' })).toBeInTheDocument();
    expect(screen.getByLabelText('3 matching icons')).toBeInTheDocument();
  });

  it('opens and closes the mobile customizer controls', async () => {
    const user = userEvent.setup();

    render(<IconGallery icons={iconEntries} />);
    const sidebar = screen.getByRole('complementary', {
      name: 'Icon customizer and categories',
    });

    await user.click(screen.getByRole('button', { name: 'Open customizer' }));
    expect(sidebar).toHaveClass('sidebar--open');

    await user.click(screen.getAllByRole('button', { name: 'Close customizer' })[0]!);
    expect(sidebar).not.toHaveClass('sidebar--open');
  });
});
