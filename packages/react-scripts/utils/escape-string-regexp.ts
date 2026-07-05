/**
 * 转义字符串，使其可以安全插入正则表达式。
 */
function escapeStringRegexp(string: string) {
  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return string
    .replaceAll(/[$()*+.?[\\\]^{|}]/g, String.raw`\$&`)
    .replaceAll('-', String.raw`\x2d`);
}

export default escapeStringRegexp;
