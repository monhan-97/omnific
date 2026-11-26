import { vi } from 'vitest';

type MockEventListener = () => void;

/**
 * jsdom 无 WAAPI，测试用 mock。
 */
export type MockAnimation = {
  playState: AnimationPlayState;
  currentTime: number;
  onfinish: ((this: Animation, event: AnimationPlaybackEvent) => void) | null;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  play: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  cancel: ReturnType<typeof vi.fn>;
  finish: ReturnType<typeof vi.fn>;
  commitStyles: ReturnType<typeof vi.fn>;
  triggerFinish: () => void;
  triggerCancel: () => void;
  triggerRemove: () => void;
};

/**
 * 创建可手动触发 finish / cancel / remove 的 Animation mock。
 */
export const createMockAnimation = (): MockAnimation => {
  let onfinish: MockAnimation['onfinish'] = null;
  let playState: AnimationPlayState = 'running';
  const listeners = new Map<string, Set<MockEventListener>>();

  const addEventListener = vi.fn((type: string, listener: MockEventListener) => {
    const listenersForType = listeners.get(type) ?? new Set<MockEventListener>();
    listenersForType.add(listener);
    listeners.set(type, listenersForType);
  });

  const removeEventListener = vi.fn((type: string, listener: MockEventListener) => {
    listeners.get(type)?.delete(listener);
  });

  const dispatch = (type: string) => {
    const listenersForType = listeners.get(type) ?? new Set<MockEventListener>();
    for (const listener of listenersForType) {
      listener();
    }
  };

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
    addEventListener,
    removeEventListener,
    play: vi.fn(() => {
      playState = 'running';
    }),
    pause: vi.fn(() => {
      playState = 'paused';
    }),
    cancel: vi.fn(() => {
      playState = 'idle';
      onfinish = null;
      listeners.clear();
    }),
    finish: vi.fn(() => {
      onfinish?.call(animation as unknown as Animation, {} as AnimationPlaybackEvent);
    }),
    commitStyles: vi.fn(),
    triggerFinish() {
      onfinish?.call(animation as unknown as Animation, {} as AnimationPlaybackEvent);
    },
    triggerCancel() {
      playState = 'idle';
      dispatch('cancel');
    },
    triggerRemove() {
      dispatch('remove');
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
