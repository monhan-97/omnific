import type { Meta, StoryObj } from '@storybook/react-vite';

import { Box } from '@omnific/atelier';

import { BoxBasicExample, BoxSurfaceExample } from '../box/examples';

const meta: Meta<typeof Box> = {
  title: 'Components / Box',
  component: Box,
  decorators: [
    Story => (
      <div style={{ padding: 40 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type BoxStory = StoryObj<typeof Box>;

export const Basic: BoxStory = {
  name: '基础容器',
  args: {
    children: 'Box',
    p: 4,
    bg: 'bg.muted',
  },
  parameters: {
    docs: {
      description: {
        story: 'Box 通过 token 插槽变量与 CSS 类名应用间距与背景等简写 props。',
      },
    },
  },
  render: BoxBasicExample,
};

export const Surface: BoxStory = {
  name: '表面样式',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: '展示 padding、背景、圆角、边框与阴影的组合。',
      },
    },
  },
  render: BoxSurfaceExample,
};
