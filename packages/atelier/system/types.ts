/**
 * primitive token 叶子值。
 */
export type TokenValue = string;

/**
 * primitive token 组，例如 gray、accent。
 */
export type TokenGroup = Record<string, TokenValue>;

/**
 * 嵌套 primitive token 配置。
 *
 * 顶层允许 white、black 这类单值，组内只允许一层色阶。
 */
export type TokenDefinition = Record<string, TokenValue | TokenGroup>;

/**
 * 语义颜色叶子值。
 */
export type ColorValue = string;

/**
 * 语义颜色组，例如 bg、fg、accent。
 */
export type ColorGroup = Record<string, ColorValue>;

/**
 * 嵌套语义颜色配置。
 */
export type ColorDefinition = Record<string, ColorGroup>;

/**
 * 一个主题的配置。
 *
 * tokens 与 semanticTokens 都使用嵌套结构，只描述当前主题。
 */
export type ThemeConfig = {
  tokens?: {
    colors?: TokenDefinition;
  };
  semanticTokens?: {
    colors?: ColorDefinition;
  };
};

/**
 * applyCssVars / useTheme 的参数契约。
 */
export type SystemContext = {
  /**
   * 主题名称。
   */
  name: string;
  /**
   * 由传入 `ThemeConfig` 解析出的扁平颜色 CSS 变量。
   */
  cssVars: Readonly<Record<string, string>>;
};
