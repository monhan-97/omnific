import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@omnific/atelier';

import {
  ButtonBasicExample,
  ButtonBlockExample,
  ButtonColorsExample,
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
  },
  parameters: {
    docs: {
      description: {
        story: '展示 Button 默认的 default + outlined 用法。',
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
    color: 'primary',
    variant: 'solid',
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

export const Colors: ButtonStory = {
  name: '颜色角色',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'default 使用 outlined，primary 和 danger 使用 solid，与旧 Button 的默认、主按钮和危险按钮视觉对应。',
      },
    },
  },
  render: ButtonColorsExample,
};

export const Danger: ButtonStory = {
  name: '危险按钮',
  args: {
    children: '删除',
    color: 'danger',
    variant: 'solid',
  },
  parameters: {
    coverageNotes: [
      'danger 现在是独立 color，不再与 variant 叠加；Colors 矩阵已包含该取值，这里只展示单独使用场景。',
    ],
    docs: {
      description: {
        story: '展示 danger 颜色角色。',
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
    color: 'primary',
    variant: 'solid',
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
    color: 'primary',
    variant: 'solid',
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
  name: '视觉组合矩阵',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: '展示旧 Button 五种视觉组合在 color / variant API 下的映射。',
      },
    },
  },
  render: ButtonVariantsExample,
};
