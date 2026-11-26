// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ListCollection } from '../ListCollection';
import { createListCollectionStore } from '../ListCollectionStore';
import { useListCollection } from '../useListCollection';
import { useListItem } from '../useListItem';

afterEach(() => {
  cleanup();
  document.body.replaceChildren();
});

const flushMicrotasks = async (): Promise<void> => {
  await new Promise<void>(resolve => {
    queueMicrotask(resolve);
  });
};

const Item = ({ label }: { label: string }) => {
  const { index, ref } = useListItem<HTMLButtonElement>({ label });

  return (
    <button data-index={index} ref={ref}>
      {label}
    </button>
  );
};

const NestedItem = ({ children, label }: { children?: ReactNode; label: string }) => {
  const { index, ref } = useListItem<HTMLDivElement>({ label });

  return (
    <div data-index={index} data-testid={label} ref={ref}>
      {label}
      {children}
    </div>
  );
};

const List = () => {
  const store = useListCollection();

  return (
    <ListCollection store={store}>
      <Item label='One' />
      <Item label='Two' />
    </ListCollection>
  );
};

const DynamicList = ({ items }: { items: Array<string> }) => {
  const store = useListCollection();

  return (
    <ListCollection store={store}>
      {items.map(item => (
        <Item key={item} label={item} />
      ))}
    </ListCollection>
  );
};

const NestedList = () => {
  const store = useListCollection();

  return (
    <ListCollection store={store}>
      <NestedItem label='Parent'>
        <NestedItem label='Child' />
      </NestedItem>
      <NestedItem label='Sibling' />
    </ListCollection>
  );
};

describe('ListCollection', () => {
  it('batches store notifications for registrations in the same tick', async () => {
    const store = createListCollectionStore();
    const listener = vi.fn();
    const first = document.createElement('button');
    const second = document.createElement('button');
    const third = document.createElement('button');

    document.body.append(first, second, third);
    store.subscribe(listener);

    store.register(first);
    store.register(second);
    store.register(third);

    expect(listener).not.toHaveBeenCalled();
    expect(store.getIndex(first)).toBe(0);
    expect(store.getIndex(second)).toBe(1);
    expect(store.getIndex(third)).toBe(2);

    await flushMicrotasks();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('batches store notifications for unregistrations in the same tick', async () => {
    const store = createListCollectionStore();
    const listener = vi.fn();
    const first = document.createElement('button');
    const second = document.createElement('button');
    const third = document.createElement('button');

    document.body.append(first, second, third);
    store.subscribe(listener);
    store.register(first);
    store.register(second);
    store.register(third);

    await flushMicrotasks();
    listener.mockClear();

    store.unregister(second);
    store.unregister(third);

    expect(listener).not.toHaveBeenCalled();
    expect(store.getIndex(first)).toBe(0);

    await flushMicrotasks();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('registers item indexes in DOM order', () => {
    render(<List />);

    expect(screen.getByRole('button', { name: 'One' })).toHaveAttribute('data-index', '0');
    expect(screen.getByRole('button', { name: 'Two' })).toHaveAttribute('data-index', '1');
  });

  it('orders nested items by document position', () => {
    render(<NestedList />);

    expect(screen.getByTestId('Parent')).toHaveAttribute('data-index', '0');
    expect(screen.getByTestId('Child')).toHaveAttribute('data-index', '1');
    expect(screen.getByTestId('Sibling')).toHaveAttribute('data-index', '2');
  });

  it('updates indexes after inserting and removing items', async () => {
    const view = render(<DynamicList items={['B', 'C']} />);

    view.rerender(<DynamicList items={['A', 'B', 'C']} />);
    await flushMicrotasks();

    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('data-index', '0');
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('data-index', '1');
    expect(screen.getByRole('button', { name: 'C' })).toHaveAttribute('data-index', '2');

    view.rerender(<DynamicList items={['B', 'C']} />);
    await flushMicrotasks();

    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('data-index', '0');
    expect(screen.getByRole('button', { name: 'C' })).toHaveAttribute('data-index', '1');
  });
});
