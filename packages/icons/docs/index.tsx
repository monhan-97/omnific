import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { isNil } from '@omnific/utils';

import { IconGallery } from './IconGallery';
import { iconEntries } from './icon-entries';

const rootElement = document.querySelector('#root');

if (isNil(rootElement)) {
  throw new Error('Missing #root element.');
}

createRoot(rootElement).render(
  <StrictMode>
    <IconGallery icons={iconEntries} />
  </StrictMode>,
);
