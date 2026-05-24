import { throttle } from '@omnific/utils';

export type BrowserProgressEvent = ProgressEvent<XMLHttpRequestEventTarget>;

export type UploadProgressEvent = {
  loaded: number;
  total?: number;
  progress?: number;
  event?: BrowserProgressEvent;
};

export const progressEventReducer = (listener: (e: UploadProgressEvent) => void, freq = 3) => {
  return throttle((e: BrowserProgressEvent) => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    listener({
      loaded,
      total,
      progress: total ? loaded / total : undefined,
      event: e,
    });
  }, freq);
};
