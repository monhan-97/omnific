import type { Meta, StoryObj } from '@storybook/react-vite';

import { Box } from '@omnific/atelier';

import {
  BoxBasicExample,
  BoxFlexExample,
  BoxSizingExample,
  BoxSpacingExample,
  BoxSurfaceExample,
} from '../box/examples';

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
    p: '4',
  },
  parameters: {
    docs: {
      description: {
        story: 'Box 通过共享 CSS 类名应用间距与布局。',
      },
    },
  },
  render: BoxBasicExample,
};

export const Spacing: BoxStory = {
  name: '间距刻度',
  args: {
    bg: 'bg-muted',
    border: true,
    children: '受 Controls 控制的 Box',
    p: '4',
    radius: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story:
          '首个 Box 由 Controls 驱动；下方展示 padding 刻度、px / py 轴向简写，以及负 margin 造成的叠压。',
      },
    },
  },
  render: BoxSpacingExample,
};

export const Sizing: BoxStory = {
  name: '尺寸控制',
  args: {
    bg: 'accent-subtle',
    border: true,
    children: '受 Controls 控制的 Box',
    p: '2',
    radius: 'sm',
    width: '50%',
  },
  parameters: {
    docs: {
      description: {
        story:
          '首个 Box 由 Controls 驱动；下方展示百分比宽度、minWidth / maxWidth 约束与 height 刻度。',
      },
    },
  },
  render: BoxSizingExample,
};

export const Flex: BoxStory = {
  name: 'Flex 布局',
  args: {
    alignItems: 'center',
    bg: 'bg-muted',
    border: true,
    display: 'flex',
    justifyContent: 'space-between',
    p: '3',
    radius: 'md',
  },
  parameters: {
    docs: {
      description: {
        story:
          '首个容器由 Controls 驱动；下方展示 flexDirection、弹性伸缩（flexBasis / flexGrow）与 flexWrap。',
      },
    },
  },
  render: BoxFlexExample,
};

export const Surface: BoxStory = {
  name: '表面样式',
  args: {
    bg: 'bg',
    border: true,
    children: '带边框、圆角与阴影的内容块',
    p: '4',
    radius: 'md',
    shadow: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '展示 padding、背景、圆角、边框与阴影的组合。',
      },
    },
  },
  render: BoxSurfaceExample,
};
