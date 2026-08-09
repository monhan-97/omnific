import { type FunctionComponent, createElement, createRef, isValidElement } from 'react';
import { describe, expect, it } from 'vitest';

import { EyeIcon } from '../EyeIcon';
import { EyeOffIcon } from '../EyeOffIcon';
import { LoadingIcon, type LoadingIconProps } from '../LoadingIcon';
import { SvgIcon } from '../SvgIcon';

const artwork = createElement('path', { d: 'M21 12a9 9 0 1 1-6.219-8.56' });

describe('SvgIcon', () => {
  it('renders the audited password visibility artwork', () => {
    const eye = (EyeIcon as FunctionComponent)({});
    const eyeOff = (EyeOffIcon as FunctionComponent)({});

    if (!isValidElement<{ children: unknown[][] }>(eye) || !isValidElement<{ children: unknown[][] }>(eyeOff)) {
      throw new TypeError('Expected password visibility icons to return React elements.');
    }

    expect(eye.props.children[0]).toMatchObject([
      {
        type: 'path',
        props: {
          d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0',
        },
      },
      { type: 'circle', props: { cx: '12', cy: '12', r: '3' } },
    ]);
    expect(eyeOff.props.children[0]).toMatchObject([
      {
        type: 'path',
        props: {
          d: 'M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.8 10.8 0 0 1-1.444 2.49',
        },
      },
      { type: 'path', props: { d: 'M14.084 14.158a3 3 0 0 1-4.242-4.242' } },
      {
        type: 'path',
        props: {
          d: 'M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143',
        },
      },
      { type: 'path', props: { d: 'm2 2 20 20' } },
    ]);
  });

  it('renders the audited artwork with the shared SVG defaults', () => {
    const element = SvgIcon({ children: artwork });

    expect(element.type).toBe('svg');
    expect(element.props).toMatchObject({
      fill: 'none',
      height: 24,
      stroke: 'currentColor',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: 2,
      viewBox: '0 0 24 24',
      width: 24,
      xmlns: 'http://www.w3.org/2000/svg',
    });

    expect(element.props.children).toMatchObject({
      type: 'path',
      props: { d: 'M21 12a9 9 0 1 1-6.219-8.56' },
    });
  });

  it('passes through consumer props, children, and ref', () => {
    const ref = createRef<SVGSVGElement>();
    const child = 'content';
    const element = SvgIcon({
      absoluteStrokeWidth: true,
      className: 'spinner',
      color: 'red',
      height: 32,
      ref,
      size: 48,
      strokeWidth: 4,
      viewBox: '0 0 32 32',
      width: 32,
      children: child,
    });

    expect(element.props).toMatchObject({
      className: 'spinner',
      height: 32,
      ref,
      stroke: 'red',
      strokeWidth: 2,
      viewBox: '0 0 32 32',
      width: 32,
    });
    expect(element.props.children).toBe(child);
  });

  it('places icon artwork before consumer children', () => {
    const Icon = LoadingIcon as FunctionComponent<LoadingIconProps>;
    const element = Icon({ children: 'content' });

    if (!isValidElement<{ children: [unknown[], unknown] }>(element)) {
      throw new TypeError('Expected LoadingIcon to return a React element.');
    }

    expect(element.props.children[0][0]).toMatchObject({
      type: 'path',
      props: { d: 'M21 12a9 9 0 1 1-6.219-8.56' },
    });
    expect(element.props.children[1]).toBe('content');
  });
});
