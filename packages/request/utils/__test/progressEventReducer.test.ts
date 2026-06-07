import { describe, expect, it, vi } from 'vitest';

import { progressEventReducer } from '../progressEventReducer';

describe('progressEventReducer', () => {
  it('normalizes computable progress events', () => {
    const listener = vi.fn();
    const reducer = progressEventReducer(listener);
    const event = {
      loaded: 5,
      total: 10,
      lengthComputable: true,
    } as ProgressEvent<XMLHttpRequestEventTarget>;

    reducer(event);
    reducer.flush();

    expect(listener).toHaveBeenCalledWith({
      loaded: 5,
      total: 10,
      progress: 0.5,
      event,
    });
  });

  it('omits total and progress when length is not computable', () => {
    const listener = vi.fn();
    const reducer = progressEventReducer(listener);
    const event = {
      loaded: 5,
      total: 0,
      lengthComputable: false,
    } as ProgressEvent<XMLHttpRequestEventTarget>;

    reducer(event);
    reducer.flush();

    expect(listener).toHaveBeenCalledWith({
      loaded: 5,
      total: undefined,
      progress: undefined,
      event,
    });
  });
});
