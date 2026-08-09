/**
 * 将字节数格式化为适合 CLI 展示的短文本。
 */
export function formatBytes(value: number) {
  const units = ['B', 'kB', 'MB', 'GB'] as const;
  const sign = value < 0 ? '-' : '';
  let size = Math.abs(value);
  let unitIndex = 0;

  while (size >= 1000 && unitIndex < units.length - 1) {
    size /= 1000;
    unitIndex += 1;
  }

  const fractionDigits = unitIndex === 0 ? 0 : size < 10 ? 2 : size < 100 ? 1 : 0;
  const label = size.toFixed(fractionDigits).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');

  return `${sign}${label} ${units[unitIndex]}`;
}
