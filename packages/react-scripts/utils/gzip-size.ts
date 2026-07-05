import type { InputType } from 'node:zlib';
import zlib from 'node:zlib';

function getOptions(options?: zlib.ZlibOptions): zlib.ZlibOptions {
  return {
    level: 9,
    ...options,
  };
}

/**
 * 返回输入内容 gzip 压缩后的字节长度。
 */
export function gzipSync(input: InputType, options?: zlib.ZlibOptions) {
  return zlib.gzipSync(input, getOptions(options)).length;
}
