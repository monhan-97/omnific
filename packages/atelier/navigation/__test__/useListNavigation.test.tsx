// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useRef, useState } from 'react';
import type { KeyboardEventHandler } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useListNavigation } from '../useListNavigation';
import type { DisabledIndices, ListNavigationOrientation } from '../utils';

afterEach(cleanup);

const ITEMS = ['One', 'Two', 'Three'];

type TestListProps = {
  activeIndex?: number | null;
  disabledIndices?: DisabledIndices;
  disabledItems?: number[];
  enabled?: boolean;
  loop?: boolean;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  onNavigate?: (index: number | null) => void;
  orientation?: ListNavigationOrientation;
};

const TestList = ({
  activeIndex = null,
  disabledIndices,
  disabledItems,
  enabled,
  loop,
  onKeyDown,
  onNavigate,
  orientation,
}: TestListProps) => {
  const elementsRef = useRef<Array<HTMLElement | null>>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(activeIndex);
  const navigation = useListNavigation({
    disabledIndices,
    enabled,
    getActiveIndex: () => currentIndex,
    getElement: (index: number) => elementsRef.current[index] ?? undefined,
    getSize: () => elementsRef.current.length,
    loop,
    onNavigate: index => {
      setCurrentIndex(index);
      onNavigate?.(index);
    },
    orientation,
  });

  return (
    <div
      data-testid='container'
      onFocus={event => {
        navigation.onFocus(event);
      }}
      onKeyDown={event => {
        navigation.onKeyDown(event);
        onKeyDown?.(event);
      }}
      tabIndex={-1}
    >
      {ITEMS.map((item, index) => (
        <button
          key={item}
          ref={node => {
            elementsRef.current[index] = node;
          }}
          disabled={disabledItems?.includes(index)}
          {...navigation.getItemProps(index)}
        >
          {item}
        </button>
      ))}
      <button onClick={() => navigation.focusIndex(2)}>Focus last</button>
    </div>
  );
};

const getContainer = () => screen.getByTestId('container');
const getItem = (name: string) => screen.getByRole('button', { name });

describe('useListNavigation', () => {
  it('moves focus with ArrowDown and reports the new index', () => {
    const onNavigate = vi.fn();

    render(<TestList activeIndex={0} onNavigate={onNavigate} />);

    fireEvent.keyDown(getContainer(), { key: 'ArrowDown' });

    expect(onNavigate).toHaveBeenLastCalledWith(1);
    expect(getItem('Two')).toHaveFocus();
  });

  it('wraps focus when loop is enabled', () => {
    render(<TestList activeIndex={2} loop />);

    fireEvent.keyDown(getContainer(), { key: 'ArrowDown' });

    expect(getItem('One')).toHaveFocus();
  });

  it('skips disabled indices and native disabled items', () => {
    const { unmount } = render(<TestList activeIndex={0} disabledIndices={[1]} />);

    fireEvent.keyDown(getContainer(), { key: 'ArrowDown' });

    expect(getItem('Three')).toHaveFocus();
    unmount();

    render(<TestList activeIndex={0} disabledItems={[1]} />);

    fireEvent.keyDown(getContainer(), { key: 'ArrowDown' });

    expect(getItem('Three')).toHaveFocus();
  });

  it('lets disabledIndices override the DOM disabled state', () => {
    const onNavigate = vi.fn();

    render(
      <TestList
        activeIndex={0}
        disabledIndices={[]}
        disabledItems={[1]}
        onNavigate={onNavigate}
      />,
    );

    fireEvent.keyDown(getContainer(), { key: 'ArrowDown' });

    expect(onNavigate).toHaveBeenLastCalledWith(1);
  });

  it('supports Home and End', () => {
    render(<TestList activeIndex={1} />);

    fireEvent.keyDown(getContainer(), { key: 'End' });
    expect(getItem('Three')).toHaveFocus();

    fireEvent.keyDown(getContainer(), { key: 'Home' });
    expect(getItem('One')).toHaveFocus();
  });

  it('only handles horizontal keys in horizontal mode', () => {
    render(<TestList activeIndex={0} orientation='horizontal' />);

    fireEvent.keyDown(getContainer(), { key: 'ArrowRight' });
    expect(getItem('Two')).toHaveFocus();

    fireEvent.keyDown(getContainer(), { key: 'ArrowDown' });
    expect(getItem('Two')).toHaveFocus();
  });

  it('clamps an out-of-range activeIndex into the available range', () => {
    render(<TestList activeIndex={99} />);

    fireEvent.keyDown(getContainer(), { key: 'ArrowUp' });

    expect(getItem('Three')).toHaveFocus();
  });

  it('does not navigate when no item is available or navigation is disabled', () => {
    const onNavigate = vi.fn();
    const { unmount } = render(
      <TestList activeIndex={0} disabledIndices={[0, 1, 2]} onNavigate={onNavigate} />,
    );

    fireEvent.keyDown(getContainer(), { key: 'ArrowDown' });
    expect(onNavigate).not.toHaveBeenCalled();
    unmount();

    render(<TestList activeIndex={0} enabled={false} onNavigate={onNavigate} />);

    fireEvent.keyDown(getContainer(), { key: 'ArrowDown' });
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('ignores modifier and IME composition events', () => {
    const onNavigate = vi.fn();

    render(<TestList activeIndex={0} onNavigate={onNavigate} />);

    fireEvent.keyDown(getContainer(), { key: 'ArrowDown', ctrlKey: true });
    expect(onNavigate).not.toHaveBeenCalled();

    const composingEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      key: 'ArrowDown',
    });
    Object.defineProperty(composingEvent, 'isComposing', { value: true });

    fireEvent(getContainer(), composingEvent);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('keeps user keydown handlers observable', () => {
    const onKeyDown = vi.fn();

    render(<TestList activeIndex={0} onKeyDown={onKeyDown} />);

    fireEvent.keyDown(getContainer(), { key: 'ArrowDown' });

    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it('supports imperative focusIndex', () => {
    render(<TestList activeIndex={0} />);

    fireEvent.click(screen.getByRole('button', { name: 'Focus last' }));

    expect(getItem('Three')).toHaveFocus();
  });
});
