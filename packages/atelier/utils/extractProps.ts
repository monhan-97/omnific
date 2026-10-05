import { hasValue, isNil } from '@omnific/utils';
import { clsx } from 'clsx';
import type { CSSProperties } from 'react';

import { atelierStyleMaps, getAtelierClassName } from '../props';
import type { AtelierClassProps, AtelierStyleProps } from '../props';

type ExtractPropsResult<Props extends object> = Props & {
  className?: string;
  style?: CSSProperties;
};

/**
 * 提取全局 props，生成静态 class 与 inline style，并透传剩余原生 props。
 */
export const extractProps = <Props extends object>(props: Props): ExtractPropsResult<Props> => {
  const sourceProps = props as ExtractPropsResult<Props> & Record<string, unknown>;

  const restProps: Record<string, unknown> = {};

  const classNames: string[] = [];

  const style: CSSProperties = {};

  for (const propName in sourceProps) {
    const value = sourceProps[propName];

    if (isNil(value)) continue;

    const stringValue = String(value);

    const className = getAtelierClassName(propName as keyof AtelierClassProps, stringValue);

    if (hasValue(className)) {
      classNames.push(className);
      continue;
    }

    const styleResolver = atelierStyleMaps[propName as keyof AtelierStyleProps];

    if (hasValue(styleResolver)) {
      Object.assign(style, styleResolver(stringValue));
      continue;
    }

    restProps[propName] = value;
  }

  restProps.className = clsx(classNames, sourceProps.className);

  restProps.style = Object.assign(style, sourceProps.style);

  return restProps as ExtractPropsResult<Props>;
};
