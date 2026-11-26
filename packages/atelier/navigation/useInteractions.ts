import type { FocusEventHandler, KeyboardEventHandler, MouseEventHandler } from 'react';
import { useEventCallback } from '@omnific/hooks';
import { createChainedFunction, hasValue, isNil } from '@omnific/utils';

/** 可合并的交互事件 props。 */
export type InteractionProps = {
  /** focus 事件处理器。 */
  onFocus?: FocusEventHandler<HTMLElement>;
  /** keydown 事件处理器。 */
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  /** keyup 事件处理器。 */
  onKeyUp?: KeyboardEventHandler<HTMLElement>;
  /** click 事件处理器。 */
  onClick?: MouseEventHandler<HTMLElement>;
};

/** 单个交互对象。 */
export type Interaction = InteractionProps;

const mergeInteractionProps = (
  ...propsList: Array<InteractionProps | null | undefined>
): InteractionProps => {
  const focusHandlers: Array<FocusEventHandler<HTMLElement>> = [];
  const keyDownHandlers: Array<KeyboardEventHandler<HTMLElement>> = [];
  const keyUpHandlers: Array<KeyboardEventHandler<HTMLElement>> = [];
  const clickHandlers: Array<MouseEventHandler<HTMLElement>> = [];

  for (const props of propsList) {
    if (isNil(props)) continue;

    if (hasValue(props.onFocus)) focusHandlers.push(props.onFocus);
    if (hasValue(props.onKeyDown)) keyDownHandlers.push(props.onKeyDown);
    if (hasValue(props.onKeyUp)) keyUpHandlers.push(props.onKeyUp);
    if (hasValue(props.onClick)) clickHandlers.push(props.onClick);
  }

  const merged: InteractionProps = {};

  if (focusHandlers.length > 0) merged.onFocus = createChainedFunction(...focusHandlers);
  if (keyDownHandlers.length > 0) merged.onKeyDown = createChainedFunction(...keyDownHandlers);
  if (keyUpHandlers.length > 0) merged.onKeyUp = createChainedFunction(...keyUpHandlers);
  if (clickHandlers.length > 0) merged.onClick = createChainedFunction(...clickHandlers);

  return merged;
};

/**
 * 合并多个交互对象的事件 props。
 *
 * 事件处理器按传入顺序执行，调用方 props 最后执行。
 */
export const useInteractions = (
  interactions: ReadonlyArray<Interaction | null | undefined> = [],
) => {
  const getReferenceProps = useEventCallback((userProps: InteractionProps = {}) =>
    mergeInteractionProps(...interactions, userProps),
  );

  return {
    getReferenceProps,
    getFloatingProps: getReferenceProps,
  };
};
