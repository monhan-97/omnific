import type { Easing } from './easings';

/**
 * 单个关键帧取值。
 *
 * - `number`：数值（长度类属性会补 `px`）
 * - `string`：原样交给 WAAPI（如 `%`、`auto`、带单位值）
 * - `null`：用当前计算样式补齐
 */
export type ValueKeyframe = string | number | null;

/**
 * 规范化后的关键帧取值（无 `null`）。
 */
export type ResolvedValueKeyframe = Exclude<ValueKeyframe, null>;

/**
 * DOM / CSS 关键帧定义（单值终点，首帧由当前计算样式补齐）。
 *
 * 暂不支持 CSS 自定义属性（`--*`）。
 */
export type DOMKeyframesDefinition = {
  [key: string]: ValueKeyframe | undefined;
};

/**
 * 动画过渡选项（`duration` / `delay` 单位为秒）。
 */
export type AnimationOptions = {
  /**
   * 延迟，单位秒。
   */
  delay?: number;
  /**
   * 时长，单位秒。
   */
  duration?: number;
  /**
   * 命名缓动（见 `supportedWaapiEasing`）。
   */
  ease?: Easing;
};

/**
 * 可播放动画控件。
 */
export type AnimationPlaybackControls = {
  /**
   * 停止动画并提交当前样式。
   */
  stop: () => void;
  /**
   * 播放动画。
   */
  play: () => void;
  /**
   * 暂停动画。
   */
  pause: () => void;
  /**
   * 取消动画。
   */
  cancel: () => void;
  /**
   * 立即完成动画。
   */
  complete: () => void;
  /**
   * 动画完成 Promise：正常结束时 resolve；`stop` / `cancel` 时以 `AbortError` reject。
   */
  finished: Promise<void>;
};

/**
 * 可 `await` / `.then` 的动画控件。
 */
export type AnimationPlaybackControlsWithThen = AnimationPlaybackControls & PromiseLike<void>;

/**
 * `useAnimate` 作用域（可作为 React ref）。
 */
export type AnimationScope<T = Element> = {
  /**
   * 绑定的 DOM 元素；挂载前为 `null`。
   */
  current: T | null;
  /**
   * 当前作用域内仍在运行的动画控件。
   */
  animations: AnimationPlaybackControls[];
};
