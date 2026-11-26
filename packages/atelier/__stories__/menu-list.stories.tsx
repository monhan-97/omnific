import type { Meta, StoryObj } from '@storybook/react-vite';

import { MenuList } from '@omnific/atelier';

import {
  MenuListDisabledExample,
  MenuListKeyboardExample,
  MenuListSelectedExample,
  MenuListSizeExample,
  MenuListTypeaheadExample,
} from '../menu/examples';

const meta: Meta<typeof MenuList> = {
  title: 'Components / MenuList',
  component: MenuList,
  decorators: [
    Story => (
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

type MenuListStory = StoryObj<typeof MenuList>;

export const Size: MenuListStory = {
  name: '尺寸',
  parameters: {
    docs: {
      description: {
        story:
          'MenuList 的 size 通过 data-size 与 CSS 自定义属性传播给内部 MenuItem；MenuItem 自身的 size 可以覆盖列表尺寸。',
      },
    },
  },
  render: MenuListSizeExample,
};

export const Selected: MenuListStory = {
  name: '选中状态',
  parameters: {
    docs: {
      description: {
        story:
          'MenuList 通过 selectedKey 和 onSelect 提供受控单选；MenuItem 的 value 对应 onSelect 返回的选中值。',
      },
    },
  },
  render: MenuListSelectedExample,
};

export const Disabled: MenuListStory = {
  name: '禁用项',
  parameters: {
    docs: {
      description: {
        story: '方向键导航会跳过 disabled MenuItem，点击禁用项也不会改变选中值；示例使用 defaultSelectedKey 演示非受控初始选中。',
      },
    },
  },
  render: MenuListDisabledExample,
};

export const KeyboardNavigation: MenuListStory = {
  name: '键盘导航',
  parameters: {
    docs: {
      description: {
        story:
          '聚焦 MenuList 容器后激活第一个可用项；方向键移动焦点，Home / End 跳到首尾，焦点始终是真实 DOM focus。',
      },
    },
  },
  render: MenuListKeyboardExample,
};

export const Typeahead: MenuListStory = {
  name: '字符搜索',
  parameters: {
    docs: {
      description: {
        story:
          '输入可打印字符按前缀匹配菜单项；重复首字母可在同首字母项之间循环，750ms 无输入后重置缓冲。',
      },
    },
  },
  render: MenuListTypeaheadExample,
};
