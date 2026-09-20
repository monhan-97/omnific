import { addons } from 'storybook/manager-api';

import { atelierTheme } from './storybook-theme';

addons.setConfig({
  theme: atelierTheme,
});
