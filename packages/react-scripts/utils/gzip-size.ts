import type { InputType } from 'node:zlib';
import zlib from 'node:zlib';

function getOptions(options?: zlib.ZlibOptions): zlib.ZlibOptions {
  return {
    level: 9,
    ...options,
  };
}

export function gzipSync(input: InputType, options?: zlib.ZlibOptions) {
  return zlib.gzipSync(input, getOptions(options)).length;
}
