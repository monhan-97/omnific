// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useTypeahead } from '../useTypeahead';
import type { TypeaheadFindMatch } from '../useTypeahead';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

type TestTypeaheadProps = {
  activeIndex?: number | null;
  enabled?: boolean;
  findMatch?: TypeaheadFindMatch | null;
  ignoreKeys?: string[];
  labels?: Array<string | null>;
  onMatch?: (index: number) => void;
  onTypingChange?: (typing: boolean) => void;
  resetMs?: number;
  selectedIndex?: number | null;
};

const TestTypeahead = ({
  activeIndex: initialActiveIndex = null,
  enabled,
  findMatch,
  ignoreKeys,
  labels = ['One', 'Two', 'Three'],
  onMatch,
  onTypingChange,
  resetMs,
  selectedIndex = null,
}: TestTypeaheadProps) => {
  const labelsRef = useRef<Array<string | null>>(labels);
  labelsRef.current = labels;

  const [activeIndex, setActiveIndex] = useState<number | null>(initialActiveIndex);

  const typeahead = useTypeahead({
    enabled,
    findMatch,
    getActiveIndex: () => activeIndex,
    getLabels: () => labelsRef.current,
    getSelectedIndex: () => selectedIndex,
    ignoreKeys,
    onMatch: index => {
      setActiveIndex(index);
      onMatch?.(index);
    },
    onTypingChange,
    resetMs,
  });

  return (
    <div data-testid='container' onKeyDown={typeahead.onKeyDown} onKeyUp={typeahead.onKeyUp}>
      {labels.map(label => (
        <button key={label ?? 'null'}>{label}</button>
      ))}
    </div>
  );
};

const getContainer = () => screen.getByTestId('container');

describe('useTypeahead', () => {
  it('matches from the active item and rotates the search', () => {
    const onMatch = vi.fn();

    render(<TestTypeahead activeIndex={0} labels={['Two', 'One', 'Three']} onMatch={onMatch} />);

    fireEvent.keyDown(getContainer(), { key: 't' });

    expect(onMatch).toHaveBeenLastCalledWith(2);
  });

  it('supports multi-character prefixes', () => {
    const onMatch = vi.fn();

    render(<TestTypeahead onMatch={onMatch} />);

    fireEvent.keyDown(getContainer(), { key: 't' });
    fireEvent.keyDown(getContainer(), { key: 'h' });

    expect(onMatch).toHaveBeenLastCalledWith(2);
  });

  it('cycles repeated first letters when items have distinct second letters', () => {
    const onMatch = vi.fn();

    render(<TestTypeahead labels={['Apple', 'Banana', 'Apricot']} onMatch={onMatch} />);

    fireEvent.keyDown(getContainer(), { key: 'a' });
    fireEvent.keyDown(getContainer(), { key: 'a' });

    expect(onMatch.mock.calls).toEqual([[0], [2]]);
  });

  it('resets the buffer after resetMs', () => {
    vi.useFakeTimers();
    const onMatch = vi.fn();

    render(
      <TestTypeahead
        activeIndex={0}
        labels={['Two', 'One', 'Three']}
        onMatch={onMatch}
        resetMs={100}
      />,
    );

    fireEvent.keyDown(getContainer(), { key: 't' });
    expect(onMatch).toHaveBeenLastCalledWith(2);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    fireEvent.keyDown(getContainer(), { key: 't' });
    expect(onMatch).toHaveBeenLastCalledWith(0);
  });

  it('supports a custom findMatch', () => {
    const onMatch = vi.fn();
    const findMatch = vi.fn<TypeaheadFindMatch>(() => 'Beta');

    render(
      <TestTypeahead findMatch={findMatch} labels={['Alpha', 'Beta', 'Gamma']} onMatch={onMatch} />,
    );

    fireEvent.keyDown(getContainer(), { key: 'x' });

    expect(findMatch).toHaveBeenCalledOnce();
    expect(onMatch).toHaveBeenLastCalledWith(1);
  });

  it('ignores configured keys', () => {
    const onMatch = vi.fn();

    render(<TestTypeahead ignoreKeys={['t']} onMatch={onMatch} />);

    const result = fireEvent.keyDown(getContainer(), { key: 't' });

    expect(result).toBe(true);
    expect(onMatch).not.toHaveBeenCalled();
  });

  it('ignores modifier and IME composition events', () => {
    const onMatch = vi.fn();

    render(<TestTypeahead onMatch={onMatch} />);

    fireEvent.keyDown(getContainer(), { key: 't', ctrlKey: true });
    expect(onMatch).not.toHaveBeenCalled();

    const composingEvent = new KeyboardEvent('keydown', { bubbles: true, key: 't' });
    Object.defineProperty(composingEvent, 'isComposing', { value: true });

    fireEvent(getContainer(), composingEvent);
    expect(onMatch).not.toHaveBeenCalled();
  });

  it('stops propagation for handled typeahead keys', () => {
    const onKeyDown = vi.fn();
    const onMatch = vi.fn();

    render(
      <div onKeyDown={onKeyDown}>
        <TestTypeahead onMatch={onMatch} />
      </div>,
    );

    fireEvent.keyDown(getContainer(), { key: 't' });

    expect(onMatch).toHaveBeenCalledOnce();
    expect(onKeyDown).not.toHaveBeenCalled();
  });

  it('reports typing state and ends it on space keyup', () => {
    const onMatch = vi.fn();
    const onTypingChange = vi.fn();

    render(<TestTypeahead onMatch={onMatch} onTypingChange={onTypingChange} />);

    fireEvent.keyDown(getContainer(), { key: 't' });
    expect(onTypingChange).toHaveBeenLastCalledWith(true);

    fireEvent.keyUp(getContainer(), { key: ' ' });
    expect(onTypingChange).toHaveBeenLastCalledWith(false);
  });

  it('resets an unmatched buffer before the next search', () => {
    const onMatch = vi.fn();

    render(<TestTypeahead onMatch={onMatch} />);

    fireEvent.keyDown(getContainer(), { key: 'z' });
    fireEvent.keyDown(getContainer(), { key: 't' });

    expect(onMatch).toHaveBeenLastCalledWith(1);
  });

  it('skips null labels when matching', () => {
    const onMatch = vi.fn();

    render(<TestTypeahead labels={['One', null, 'Three']} onMatch={onMatch} />);

    fireEvent.keyDown(getContainer(), { key: 't' });

    expect(onMatch).toHaveBeenLastCalledWith(2);
  });

  it('uses selectedIndex as the typeahead starting point', () => {
    const onMatch = vi.fn();

    render(
      <TestTypeahead
        activeIndex={0}
        labels={['Alpha', 'Aardvark', 'Beta', 'Gamma']}
        onMatch={onMatch}
        selectedIndex={2}
      />,
    );

    fireEvent.keyDown(getContainer(), { key: 'a' });

    expect(onMatch).toHaveBeenLastCalledWith(0);
  });

  it('does not handle keys when disabled', () => {
    const onMatch = vi.fn();

    render(<TestTypeahead enabled={false} onMatch={onMatch} />);

    fireEvent.keyDown(getContainer(), { key: 't' });

    expect(onMatch).not.toHaveBeenCalled();
  });

  it('leaves a leading space untouched', () => {
    const onMatch = vi.fn();

    render(<TestTypeahead onMatch={onMatch} />);

    const result = fireEvent.keyDown(getContainer(), { key: ' ' });

    expect(result).toBe(true);
    expect(onMatch).not.toHaveBeenCalled();
  });
});
