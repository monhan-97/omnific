import CanceledError from '../cancel/CanceledError';
import FetchError from '../core/FetchError';
import type { RequestConfig } from '../types';

/**
 * 将超时和中止信号组合成一个带清理能力的信号。
 */
const composeSignals = (
  timeout: number = 0,
  signals: (AbortSignal | undefined)[] = [],
  config?: RequestConfig,
) => {
  const newSignals = signals.filter(Boolean) as AbortSignal[];

  if (timeout || newSignals.length > 0) {
    const abortController = new AbortController();

    let isAborted = false;

    let timer: ReturnType<typeof globalThis.setTimeout> | undefined;
    let abortReason: Error | undefined;

    if (timeout) {
      timer = globalThis.setTimeout(() => {
        abortReason = new FetchError(
          `timeout of ${timeout} ms exceeded`,
          FetchError.ETIMEDOUT,
          config,
        );
        abortController.abort(abortReason);
        clean();
      }, timeout);
    }

    function abort(reason?: unknown) {
      abortReason = reason instanceof Error ? reason : new CanceledError(undefined);
      abortController.abort(abortReason);
      clean();
    }

    for (const signal of newSignals) {
      signal.addEventListener('abort', onabort);
    }

    function onabort(event: Event) {
      abort((event.target as AbortSignal | null)?.reason);
    }

    for (const signal of newSignals) {
      if (signal.aborted) {
        abort(signal.reason);
        break;
      }
    }

    function clean() {
      if (isAborted) {
        return;
      }

      isAborted = true;
      timer && globalThis.clearTimeout(timer);
      for (const signal of newSignals) {
        signal.removeEventListener('abort', onabort);
      }
    }

    return {
      signal: abortController.signal,
      get reason() {
        return abortReason;
      },
      clean,
    };
  }
};

export default composeSignals;
