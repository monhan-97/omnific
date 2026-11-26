import { describe, expect, it, vi } from 'vitest';

import { createEmitter } from '../createEmitter';

describe('createEmitter', () => {
  it('passes the emitted value to every subscriber', () => {
    const emitter = createEmitter<number>();
    const first = vi.fn();
    const second = vi.fn();

    emitter.subscribe(first);
    emitter.subscribe(second);
    emitter.emit(42);

    expect(first).toHaveBeenCalledWith(42);
    expect(second).toHaveBeenCalledWith(42);
  });

  it('supports emitters without a payload', () => {
    const emitter = createEmitter();
    const listener = vi.fn();

    emitter.subscribe(listener);
    emitter.emit();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('stops notifying a listener after unsubscribe', () => {
    const emitter = createEmitter();
    const listener = vi.fn();

    const unsubscribe = emitter.subscribe(listener);
    unsubscribe();
    emitter.emit();

    expect(listener).not.toHaveBeenCalled();
  });

  it('keeps other listeners when one unsubscribes', () => {
    const emitter = createEmitter();
    const removed = vi.fn();
    const kept = vi.fn();

    const unsubscribe = emitter.subscribe(removed);
    emitter.subscribe(kept);
    unsubscribe();
    emitter.emit();

    expect(removed).not.toHaveBeenCalled();
    expect(kept).toHaveBeenCalledTimes(1);
  });
});
