import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from 'react';

/** 通用控件校验状态。 */
export type ComponentStatus = 'error' | 'warning';

/** 通用控件尺寸。 */
export type ComponentSize = 'small' | 'default' | 'large';

/** 通用控件视觉形态。 */
export type ComponentVariant = 'outlined' | 'borderless';

/** Flex 交叉轴对齐方式。 */
export type FlexAlign = 'top' | 'middle' | 'bottom' | 'stretch';

/** Flex 主轴排列方式。 */
export type FlexJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';

/** Flex 换行方式。 */
export type FlexWrap = 'wrap' | 'no-wrap' | 'wrap-reverse';

/** 文本对齐方式。 */
export type TextAlign = 'left' | 'center' | 'right';

/** 为多态组件声明实际渲染的组件或元素类型。 */
export type ComponentProp<Component extends ElementType> = {
  /** 自定义渲染组件或原生元素。 */
  component?: Component;
};

/** 计算多态组件自有属性与 component 属性需要覆盖的键。 */
export type PropsToOmit<Component extends ElementType, Properties> = keyof (
  ComponentProp<Component> & Properties
);

/** 获取多态组件对应元素或组件的 ref 类型。 */
export type PolymorphicRef<Component extends ElementType> = ComponentPropsWithRef<Component>['ref'];

/** 合并多态组件自有属性与实际渲染目标的原生属性。 */
export type PolymorphicComponentProp<
  Component extends ElementType,
  Properties = Record<never, never>,
> = PropsWithChildren<Properties & ComponentProp<Component>> &
  Omit<ComponentPropsWithoutRef<Component>, PropsToOmit<Component, Properties>>;

/** 在多态组件属性基础上增加与渲染目标匹配的 ref。 */
export type PolymorphicComponentPropWithRef<
  Component extends ElementType,
  Properties = Record<never, never>,
> = PolymorphicComponentProp<Component, Properties> & {
  /** 实际渲染元素或组件的引用。 */
  ref?: PolymorphicRef<Component>;
};

