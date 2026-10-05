/**
 * 用于拆分常见命名格式的正则；实现参考 es-toolkit 的 `kebabCase`。
 */
const CASE_SPLIT_PATTERN =
  /\p{Lu}?\p{Ll}+|[0-9]+|\p{Lu}+(?!\p{Ll})|\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{L}+/gu;

/**
 * 将字符串拆分为单词。
 *
 * @param value 待拆分字符串。
 * @returns 拆分后的单词数组。
 */
function words(value: string): string[] {
  return [...(value.match(CASE_SPLIT_PATTERN) ?? [])];
}

/**
 * 将字符串转换为 kebab-case。
 *
 * @param value 待转换字符串。
 * @returns 转换后的 kebab-case 字符串。
 *
 * @example
 * kebabCase('camelCase') // 'camel-case'
 * kebabCase('some whitespace') // 'some-whitespace'
 * kebabCase('HTTPRequest') // 'http-request'
 */
export function kebabCase(value: string): string {
  return words(value)
    .map(word => word.toLowerCase())
    .join('-');
}
