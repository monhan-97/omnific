import CanceledError from '../cancel/CanceledError';
import FetchError from '../core/FetchError';

const composeSignals = (timeout: number = 0, signals: (AbortSignal | undefined)[] = []) => {
  const newSignals = signals.filter(Boolean) as AbortSignal[];

  if (timeout || newSignals.length > 0) {
    const abortController = new AbortController();

    let aborted = false;

    let timer: ReturnType<typeof globalThis.setTimeout> | undefined;

    if (timeout) {
      timer = globalThis.setTimeout(() => {
        abortController.abort(
          new FetchError(`timeout of ${timeout} ms exceeded`, FetchError.ETIMEDOUT),
        );
        clean();
      }, timeout);
    }

    function abort(reason?: unknown) {
      abortController.abort(reason instanceof Error ? reason : new CanceledError(undefined));
      clean();
    }

    for (const signal of newSignals) {
      signal.addEventListener('abort', onabort);
    }

    function onabort(e: Event) {
      abort((e.target as AbortSignal | null)?.reason);
    }

    for (const signal of newSignals) {
      if (signal.aborted) {
        abort(signal.reason);
        break;
      }
    }

    function clean() {
      if (!aborted) {
        aborted = true;
        timer && globalThis.clearTimeout(timer);
        for (const signal of newSignals) {
          signal.removeEventListener('abort', onabort);
        }
      }
    }

    return {
      signal: abortController.signal,
      clean,
    };
  }
};

export default composeSignals;
