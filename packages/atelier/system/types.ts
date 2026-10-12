/**
 * 颜色叶子值。
 */
export type ColorValue = string;

/**
 * 嵌套颜色配置。
 *
 * base 是保留键，表示当前分组自己的颜色。
 */
export type ColorSet = {
  [key: string]: ColorValue | ColorSet;
};

/**
 * 展开后的扁平颜色表。
 */
export type FlatColorSet = Record<string, string>;

/**
 * applyCssVars / useTheme 的参数契约。
 */
export type SystemContext = {
  /**
   * 主题名称。
   */
  name: string;
  /**
   * 展开后的扁平颜色表。
   */
  colors: FlatColorSet;
  /**
   * 扁平颜色 CSS 变量表。
   */
  cssVars: Readonly<Record<string, string>>;
};
