import type { Meta, StoryObj } from '@storybook/react-vite';

import { MenuItem } from '@omnific/atelier';

import {
  MenuItemBasicExample,
  MenuItemDisabledExample,
  MenuItemDividerExample,
  MenuItemIconExample,
  MenuItemSelectedExample,
  MenuItemShowcaseExample,
  MenuItemSizeExample,
  MenuItemThemeExample,
} from '../menu/examples';

const meta: Meta<typeof MenuItem> = {
  title: 'Components / MenuItem',
  component: MenuItem,
  decorators: [
    Story => (
      <div style={{ padding: 40 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type MenuItemStory = StoryObj<typeof MenuItem>;

export const Basic: MenuItemStory = {
  name: '基础菜单项',
  args: {
    children: '首页',
  },
  parameters: {
    docs: {
      description: {
        story: '渲染原生 button，并通过 children 组合 ListItemIcon、ListItemText。',
      },
    },
  },
  render: MenuItemBasicExample,
};

export const Selected: MenuItemStory = {
  name: '选中状态',
  args: {
    children: '首页',
    selected: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'selected 输出 data-selected 和选中背景；导航场景请显式传 aria-current，选择型菜单可使用 menuitemradio / menuitemcheckbox。',
      },
    },
  },
  render: MenuItemSelectedExample,
};

export const Size: MenuItemStory = {
  name: '尺寸',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'size 复用 ComponentSize：small 使用 24px，default 使用 32px，large 使用 40px。',
      },
    },
  },
  render: MenuItemSizeExample,
};

export const Disabled: MenuItemStory = {
  name: '禁用状态',
  args: {
    children: '不可用菜单项',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'disabled 使用原生 button disabled，并降低整体透明度。',
      },
    },
  },
  render: MenuItemDisabledExample,
};

export const Divider: MenuItemStory = {
  name: '分隔线',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'divider 在底部输出 1px 语义边框。',
      },
    },
  },
  render: MenuItemDividerExample,
};

export const AntDesignThemes: MenuItemStory = {
  name: 'Ant Design Light / Dark / Size',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '通过 `antdLightSystem`、`antdDarkSystem` 与 `size="small"` 展示皮肤和尺寸组合。',
      },
    },
  },
  render: MenuItemThemeExample,
};

export const Showcase: MenuItemStory = {
  name: '状态总览',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: '集中展示默认、选中、图标、尺寸、分隔线和禁用状态。',
      },
    },
  },
  render: MenuItemShowcaseExample,
};

export const Icon: MenuItemStory = {
  name: '图标组合',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: '通过 ListItemIcon 与 ListItemText 组合图标和文字。',
      },
    },
  },
  render: MenuItemIconExample,
};
