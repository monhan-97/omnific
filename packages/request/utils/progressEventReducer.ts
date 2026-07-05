import { throttle } from '@omnific/utils';

/**
 * XMLHttpRequest 上传时触发的浏览器进度事件。
 */
export type BrowserProgressEvent = ProgressEvent<XMLHttpRequestEventTarget>;

/**
 * 传给监听器的标准化上传进度数据。
 */
export type UploadProgressEvent = {
  loaded: number;
  total?: number;
  progress?: number;
  event?: BrowserProgressEvent;
};

/**
 * 将浏览器上传进度事件节流为标准化进度数据。
 */
export const progressEventReducer = (listener: (event: UploadProgressEvent) => void, freq = 3) => {
  return throttle((event: BrowserProgressEvent) => {
    const loaded = event.loaded;
    const total = event.lengthComputable ? event.total : undefined;
    listener({
      loaded,
      total,
      progress: total ? loaded / total : undefined,
      event,
    });
  }, freq);
};
