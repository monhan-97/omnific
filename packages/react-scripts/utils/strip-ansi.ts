function ansiRegex(options: { onlyFirst?: boolean } = {}) {
  const { onlyFirst } = options;

  const pattern = [
    String.raw`[\u001B\u009B][[\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*|[a-zA-Z\d]+(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)`,
    String.raw`(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))`,
  ].join('|');

  return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

/**
 * 移除字符串中的 ANSI 转义序列。
 */
function stripAnsi(string: string) {
  const regex = ansiRegex();

  return string.replace(regex, '');
}

export default stripAnsi;
