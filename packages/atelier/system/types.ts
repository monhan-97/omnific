/**
 * 单个 token 节点。
 */
export type TokenNode = {
  /**
   * CSS 值。
   */
  value: string;
};

/**
 * 一类 token；键可用 `bg.muted` 这类带点路径段。
 */
export type TokenCategory = Record<string, TokenNode>;

/**
 * 从具体 token 分类对象推导可用键的联合类型。
 */
export type TokenCategoryKeys<T> = keyof T & (string | number);

/**
 * 主题 tokens。
 */
export type ThemeTokens = {
  /**
   * 颜色 token。
   */
  colors?: TokenCategory;
  /**
   * 间距 token。
   */
  spacing?: TokenCategory;
  /**
   * 圆角 token。
   */
  radii?: TokenCategory;
  /**
   * 阴影 token。
   */
  shadows?: TokenCategory;
  /**
   * 字体族 token。
   */
  fonts?: TokenCategory;
  /**
   * 字号 token。
   */
  fontSizes?: TokenCategory;
  /**
   * 控件高度 token。
   */
  controlHeights?: TokenCategory;
  /**
   * 焦点环 token。
   */
  focusRings?: TokenCategory;
};

/**
 * 精简版 SystemContext；实例只描述运行时主题能力，不携带具体 tokens 泛型。
 */
export type SystemContext = {
  /**
   * 主题名称；同名 system 在注入时复用同一张 `<style>`。
   */
  name: string;
  /**
   * 合并后的 tokens。
   */
  _config: ThemeTokens;
  /**
   * 已缓存的扁平 CSS 变量表（变量名 → 值）。
   */
  cssVars: Readonly<Record<string, string>>;
};
