// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../Button';

describe('Button', () => {
  it('renders the configured component with its native properties', () => {
    render(
      <Button component='a' href='/dashboard'>
        Dashboard
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Dashboard' });

    expect(link).toHaveAttribute('href', '/dashboard');
    expect(link).toHaveClass('atelier-button');
  });

  it('renders a loading indicator and blocks click events while loading', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <Button loading onClick={handleClick}>
        Save
      </Button>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelector(':scope .atelier-button-loading-icon svg')).toBeInTheDocument();
  });
});
