import '@omnific/atelier/styles.css';

import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
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
