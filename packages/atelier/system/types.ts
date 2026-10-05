/**
 * 单个颜色值节点。
 */
export type ColorValue = {
  /**
   * CSS 颜色值。
   */
  value: string;
};

/**
 * 扁平语义颜色表。
 *
 * 只约束值的结构，不枚举颜色键。
 * 具体颜色键由 `defineColors` 或 `defaultColors` 自动推导。
 */
export type ColorSet = Record<string, ColorValue>;

/**
 * applyCssVars / useTheme 的参数契约。
 *
 * 不是 createSystem 的返回值类型来源；返回值仍由 createSystem 自动推导。
 */
export type SystemContext = {
  /**
   * 主题名称；同名 system 在注入时复用同一张 `<style>`。
   */
  name: string;
  /**
   * 合并后的扁平颜色表。
   */
  colors: ColorSet;
  /**
   * 已缓存的颜色 CSS 变量表。
   */
  cssVars: Readonly<Record<string, string>>;
};
