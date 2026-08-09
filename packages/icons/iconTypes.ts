import type { ComponentPropsWithRef, ReactNode } from 'react';

/**
One SVG artwork element represented by its tag name and attributes.
*/
export type ArtworkNode = readonly [string, Readonly<Record<string, string | number>>];

/**
Props shared by the package's SVG icon components.
*/
export type IconProps = ComponentPropsWithRef<'svg'> & {
  /**
  Icon width and height in pixels.
  */
  size?: number | string;
  /**
  Keeps the apparent stroke width constant when the icon is resized.
  */
  absoluteStrokeWidth?: boolean;
  /**
  Optional artwork or consumer content rendered after the icon nodes.
  */
  children?: ReactNode;
};
