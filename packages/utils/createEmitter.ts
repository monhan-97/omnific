/** 发射器订阅者。 */
export type EmitterListener<T> = (value: T) => void;

/** 提供订阅能力的对象。 */
export interface Subscribable<T = void> {
  /** 订阅变化，返回取消订阅函数。 */
  readonly subscribe: (listener: EmitterListener<T>) => () => void;
}

/** 单通道变更发射器。 */
export interface Emitter<T = void> extends Subscribable<T> {
  /** 通知所有订阅者。 */
  readonly emit: (value: T) => void;
}

/**
 * 创建单通道变更发射器。
 *
 * 只负责保存订阅者并在 `emit` 时逐个触发，不包含状态与通知时机。
 *
 * @example
 * const emitter = createEmitter<string>();
 * const unsubscribe = emitter.subscribe(value => console.log(value));
 * emitter.emit('ready');
 */
export const createEmitter = <T = void>(): Emitter<T> => {
  const listeners = new Set<EmitterListener<T>>();

  const subscribe = (listener: EmitterListener<T>) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  const emit = (value: T) => {
    for (const listener of listeners) {
      listener(value);
    }
  };

  return { subscribe, emit };
};
