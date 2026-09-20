import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@omnific/atelier';

import {
  ButtonBasicExample,
  ButtonBlockExample,
  ButtonDangerExample,
  ButtonDisabledExample,
  ButtonIconExample,
  ButtonIconOnlyExample,
  ButtonLoadingExample,
  ButtonShapeExample,
  ButtonSizesExample,
  ButtonVariantsExample,
} from '../button/examples';

const meta: Meta<typeof Button> = {
  title: 'Components / Button',
  component: Button,
  decorators: [
    Story => (
      <div style={{ padding: 40 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type ButtonStory = StoryObj<typeof Button>;

export const Basic: ButtonStory = {
  name: '基础按钮',
  args: {
    children: '确认',
    variant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: '展示 Button 的默认用法。',
      },
    },
  },
  render: ButtonBasicExample,
};

export const Block: ButtonStory = {
  name: '块级按钮',
  args: {
    block: true,
    children: '继续',
    variant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: '展示占满父容器可用宽度的按钮。',
      },
    },
  },
  render: ButtonBlockExample,
};

export const Danger: ButtonStory = {
  name: '危险按钮',
  args: {
    children: '删除',
    variant: 'danger',
  },
  parameters: {
    coverageNotes: [
      'danger 是独立 variant，不再与 dashed 叠加；Variants 矩阵已包含该取值，这里只展示单独使用场景。',
    ],
    docs: {
      description: {
        story: '展示 Button 的 danger 变体。',
      },
    },
  },
  render: ButtonDangerExample,
};

export const Disabled: ButtonStory = {
  name: '禁用状态',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: '禁用按钮不可触发点击操作。',
      },
    },
  },
  render: ButtonDisabledExample,
};

export const Icon: ButtonStory = {
  name: '带图标按钮',
  args: {
    children: '查看详情',
    variant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: '展示同时包含图标和文本的按钮。',
      },
    },
  },
  render: ButtonIconExample,
};

export const IconOnly: ButtonStory = {
  name: '纯图标按钮',
  args: {
    variant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: '纯图标按钮通过 aria-label 提供可访问名称。',
      },
    },
  },
  render: ButtonIconOnlyExample,
};

export const Loading: ButtonStory = {
  name: '加载状态',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: '通过触发按钮切换加载状态；加载中的按钮会显示进度图标并阻止重复点击。',
      },
    },
  },
  render: ButtonLoadingExample,
};

export const Shape: ButtonStory = {
  name: '形状按钮',
  parameters: {
    controls: { disable: true },
    coverageNotes: [
      'default 形状由 Basic 覆盖，circle 形状由 IconOnly 和 Shape 覆盖，round 形状由 Shape 单独展示；三种取值都在这里显式跑一遍。',
    ],
    docs: {
      description: {
        story: '展示 Button 的默认、circle 和 round 形状。',
      },
    },
  },
  render: ButtonShapeExample,
};

export const Sizes: ButtonStory = {
  name: '尺寸矩阵',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: '展示 Button 的 small、default 和 large 尺寸。',
      },
    },
  },
  render: ButtonSizesExample,
};

export const Variants: ButtonStory = {
  name: '视觉变体矩阵',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: '展示 Button 的 primary、secondary、dashed、outline 和 danger 变体。',
      },
    },
  },
  render: ButtonVariantsExample,
};
