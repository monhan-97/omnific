import { isNil } from '@omnific/utils';
import { type FunctionComponent, isValidElement } from 'react';
import { describe, expect, it } from 'vitest';

import { createIcon } from '../createIcon';
import type { ArtworkNode, IconProps } from '../iconTypes';

const artworkNodes: readonly ArtworkNode[] = [
  ['path', { d: 'M21 12a9 9 0 1 1-6.219-8.56' }],
  ['circle', { cx: '11', cy: '11', r: '8' }],
];

const readArtworkKeys = (icon: FunctionComponent<IconProps>): (string | null)[] => {
  const element = icon({});

  if (!isValidElement<{ children: unknown[][] }>(element)) {
    throw new TypeError('Expected createIcon to return a React element.');
  }

  const [artwork] = element.props.children;

  if (isNil(artwork)) {
    throw new TypeError('Expected createIcon to render artwork nodes.');
  }

  return artwork.map((node) => (isValidElement(node) ? node.key : null));
};

describe('createIcon', () => {
  it('assigns a unique key to every artwork node', () => {
    const keys = readArtworkKeys(createIcon(artworkNodes) as FunctionComponent<IconProps>);

    expect(keys).toEqual([expect.stringMatching(/^path-\d+$/), expect.stringMatching(/^circle-\d+$/)]);
    expect(new Set(keys).size).toBe(artworkNodes.length);
  });

  it('reuses the artwork keys across renders', () => {
    const Icon = createIcon(artworkNodes) as FunctionComponent<IconProps>;

    expect(readArtworkKeys(Icon)).toEqual(readArtworkKeys(Icon));
  });
});
