import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  SystemLocalThemeExample,
  SystemSharedThemeExample,
  SystemSwitchThemeExample,
} from '../system/examples';

const meta: Meta = {
  title: 'Foundations / System',
  decorators: [
    (Story) => (
      <div style={{ padding: 40 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: { disable: true },
  },
};

export default meta;

type SystemStory = StoryObj;

export const LocalTheme: SystemStory = {
  name: '局部主题',
  parameters: {
    docs: {
      description: {
        story:
          '左侧使用 preview 注入的全局主题；右侧将 `useTheme` 的 ref 挂到容器，仅覆盖该子树的 CSS 变量。',
      },
    },
  },
  render: SystemLocalThemeExample,
};

export const SwitchTheme: SystemStory = {
  name: '切换主题',
  parameters: {
    docs: {
      description: {
        story:
          '上方切换全局 documentElement 主题（Light / Dark / Warm）；右侧私有容器挂独立 `system`，不受全局切换影响。',
      },
    },
  },
  render: SystemSwitchThemeExample,
};

export const SharedTheme: SystemStory = {
  name: '多容器共用主题',
  parameters: {
    docs: {
      description: {
        story:
          '多个容器调用 `useTheme` 并传入同一 `system`（相同 `name`）。只注入一张 `<style>`；挂载 / 卸载面板只增减引用次数。',
      },
    },
  },
  render: SystemSharedThemeExample,
};
