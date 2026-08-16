import type { DOMKeyframesDefinition } from 'motion';
import type { CSSProperties, ReactElement, Ref, RefCallback } from 'react';

/** 过渡已退出。 */
export const EXITED = 'exited';
/** 过渡正在进入。 */
export const ENTERING = 'entering';
/** 过渡已进入。 */
export const ENTERED = 'entered';
/** 过渡正在退出。 */
export const EXITING = 'exiting';
/** 过渡元素未挂载。 */
export const UNMOUNTED = 'unmounted';

/** 过渡动画当前状态。 */
export type TransitionStatus =
  | typeof UNMOUNTED
  | typeof EXITED
  | typeof ENTERING
  | typeof ENTERED
  | typeof EXITING;

/** 过渡动画生命周期回调。 */
export type TransitionCycle = {
  /** 进入动画开始时触发。 */
  onEnter?: (node: HTMLElement) => void;
  /** 进入动画完成时触发。 */
  onEntered?: (node: HTMLElement) => void;
  /** 退出动画开始时触发。 */
  onExit?: (node: HTMLElement) => void;
  /** 退出动画完成时触发。 */
  onExited?: (node: HTMLElement) => void;
};

/** 动画关键帧或根据自定义参数生成关键帧的函数。 */
export type Variant<Custom = unknown> =
  | DOMKeyframesDefinition
  | ((custom: Custom | undefined, node: HTMLElement) => DOMKeyframesDefinition);

/** 进入与退出动画变体集合。 */
export type Variants<Custom = unknown> = Record<'enter' | 'exit', Variant<Custom>>;

/** 各过渡状态对应的行内样式。 */
export type TransitionStyles = Partial<Record<TransitionStatus, CSSProperties>>;

/** useTransitionStatus Hook 返回的过渡状态。 */
export type TransitionResult = {
  /** 同步 Motion 与外部元素引用的回调。 */
  handleRef: RefCallback<HTMLElement> | undefined;
  /** 过渡元素当前是否应挂载。 */
  isMounted: boolean;
  /** 过渡动画当前状态。 */
  status: TransitionStatus;
};

/** useTransitionStatus Hook 配置。 */
export type TransitionOptions<Custom = unknown> = TransitionCycle & {
  /** 组件首次挂载时是否执行进入动画。 */
  appear?: boolean;
  /** 传递给动画变体生成函数的自定义参数。 */
  custom?: Custom;
  /** 动画持续时间，单位为秒。 */
  duration?: number;
  /** 进入动画。 */
  enter?: Variant<Custom>;
  /** 退出动画。 */
  exit?: Variant<Custom>;
  /** 是否显示元素并触发进入或退出状态。 */
  in?: boolean;
  /** 过渡元素引用。 */
  ref?: Ref<HTMLElement>;
  /** 退出动画完成后是否卸载元素。 */
  unmountOnExit?: boolean;
};

/** 可由 Transition 控制的 React 元素。 */
export type TransitionChildren = ReactElement<{
  /** 过渡元素引用。 */
  ref: Ref<HTMLElement>;
  /** 过渡元素行内样式。 */
  style?: CSSProperties;
}>;
