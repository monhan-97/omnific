/** Atelier 样式的根类名前缀。 */
export const rootPrefixCls = 'atelier';

/** 获取 Atelier 组件的 CSS 类名前缀。 */
export const getPrefixCls = (suffixCls: string) => `${rootPrefixCls}-${suffixCls}`;
