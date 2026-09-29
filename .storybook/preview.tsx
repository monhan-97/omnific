import '@omnific/atelier/styles.css';

import type { ReactNode } from 'react';
import type { Preview } from '@storybook/react-vite';

import { defaultSystem, useTheme } from '@omnific/atelier/system';

type PreviewThemeProps = {
  children: ReactNode;
};

const PreviewTheme = (props: PreviewThemeProps) => {
  const { children } = props;

  useTheme(defaultSystem);

  return <>{children}</>;
};

const preview: Preview = {
  decorators: [
    Story => (
      <PreviewTheme>
        <Story />
      </PreviewTheme>
    ),
  ],
  parameters: {
    actions: {
      disable: true,
    },
    controls: {
      disable: false,
    },
    layout: 'padded',
    options: {
      storySort: {
        order: ['Foundations', 'Layout', 'Typography', 'Components'],
      },
    },
  },
};

export default preview;
