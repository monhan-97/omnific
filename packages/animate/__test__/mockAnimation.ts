import { vi } from 'vitest';

/**
 * jsdom 无 WAAPI，测试用 mock。
 */
export type MockAnimation = {
  playState: AnimationPlayState;
  currentTime: number;
  onfinish: ((this: Animation, event: AnimationPlaybackEvent) => void) | null;
  play: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  cancel: ReturnType<typeof vi.fn>;
  finish: ReturnType<typeof vi.fn>;
  commitStyles: ReturnType<typeof vi.fn>;
  triggerFinish: () => void;
};

/**
 * 创建可手动触发 finish 的 Animation mock。
 */
export const createMockAnimation = (): MockAnimation => {
  let onfinish: MockAnimation['onfinish'] = null;
  let playState: AnimationPlayState = 'running';

  const animation: MockAnimation = {
    get playState() {
      return playState;
    },
    currentTime: 150,
    get onfinish() {
      return onfinish;
    },
    set onfinish(handler) {
      onfinish = handler;
    },
    play: vi.fn(() => {
      playState = 'running';
    }),
    pause: vi.fn(() => {
      playState = 'paused';
    }),
    cancel: vi.fn(() => {
      playState = 'idle';
      onfinish = null;
    }),
    finish: vi.fn(() => {
      onfinish?.call(animation as unknown as Animation, {} as AnimationPlaybackEvent);
    }),
    commitStyles: vi.fn(),
    triggerFinish() {
      onfinish?.call(animation as unknown as Animation, {} as AnimationPlaybackEvent);
    },
  };

  return animation;
};

/**
 * 为元素安装 `animate` mock（jsdom 默认无此方法）。
 */
export const stubElementAnimate = (element: Element, implementation: () => MockAnimation) => {
  Object.defineProperty(element, 'animate', {
    configurable: true,
    writable: true,
    value: vi.fn(implementation),
  });

  return element.animate as ReturnType<typeof vi.fn>;
};
