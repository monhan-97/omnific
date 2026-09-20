import { create } from 'storybook/theming';

import atelierLogo from './atelier-logo.svg';

/**
Atelier Storybook manager theme.
*/
export const atelierTheme = create({
  base: 'light',
  brandImage: atelierLogo,
  brandTarget: '_blank',
  brandTitle: 'Atelier',
  brandUrl: 'https://github.com/monhan-97/omnific',
});
