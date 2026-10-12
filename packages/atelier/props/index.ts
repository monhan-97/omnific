import { hasValue, isNil, kebabCase } from '@omnific/utils';
import type { CSSProperties } from 'react';

import { displayValues } from './display.props';
import type { DisplayValue } from './display.props';
import {
  alignContentValues,
  alignValues,
  flexBasisValues,
  flexDirectionValues,
  flexGrowValues,
  flexShrinkValues,
  flexWrapValues,
} from './flex.props';
import type {
  AlignContentValue,
  AlignValue,
  FlexBasisValue,
  FlexDirectionValue,
  FlexGrowValue,
  FlexShrinkValue,
  FlexWrapValue,
} from './flex.props';
import { gapValues } from './gap.props';
import type { GapValue } from './gap.props';
import { heightValues } from './height.props';
import type { HeightValue } from './height.props';
import {
  contentDistributionValues,
  justifyItemsValues,
  justifySelfValues,
  placeItemsValues,
} from './justify.props';
import type {
  ContentDistributionValue,
  JustifyItemsValue,
  JustifySelfValue,
  PlaceItemsValue,
} from './justify.props';
import { marginValues } from './margin.props';
import type { MarginValue } from './margin.props';
import { overflowValues } from './overflow.props';
import type { OverflowValue } from './overflow.props';
import { paddingValues } from './padding.props';
import type { PaddingValue } from './padding.props';
import { positionEdgeValues, positionValues } from './position.props';
import type { PositionEdgeValue, PositionValue } from './position.props';
import { radiusValues } from './radius.props';
import type { RadiusValue } from './radius.props';
import { shadowValues } from './shadow.props';
import type { ShadowValue } from './shadow.props';
import { widthValues } from './width.props';
import type { WidthValue } from './width.props';

import type { DefaultColorKey } from '../system/defaults';
import { toColorVarName } from '../system/css-vars';
import { getPrefixCls } from '../utils/getPrefixCls';

/**
 * Atelier class 类型 props。
 */
export type AtelierClassProps = {
  p?: PaddingValue;
  px?: PaddingValue;
  py?: PaddingValue;
  pt?: PaddingValue;
  pr?: PaddingValue;
  pb?: PaddingValue;
  pl?: PaddingValue;
  m?: MarginValue;
  mx?: MarginValue;
  my?: MarginValue;
  mt?: MarginValue;
  mr?: MarginValue;
  mb?: MarginValue;
  ml?: MarginValue;
  display?: DisplayValue;
  position?: PositionValue;
  inset?: PositionEdgeValue;
  top?: PositionEdgeValue;
  right?: PositionEdgeValue;
  bottom?: PositionEdgeValue;
  left?: PositionEdgeValue;
  overflow?: OverflowValue;
  overflowX?: OverflowValue;
  overflowY?: OverflowValue;
  width?: WidthValue;
  minWidth?: WidthValue;
  maxWidth?: WidthValue;
  height?: HeightValue;
  minHeight?: HeightValue;
  maxHeight?: HeightValue;
  flexBasis?: FlexBasisValue;
  flexGrow?: FlexGrowValue;
  flexShrink?: FlexShrinkValue;
  flexDirection?: FlexDirectionValue;
  flexWrap?: FlexWrapValue;
  alignItems?: AlignValue;
  alignContent?: AlignContentValue;
  alignSelf?: AlignValue;
  justifyItems?: JustifyItemsValue;
  justifyContent?: ContentDistributionValue;
  justifySelf?: JustifySelfValue;
  placeItems?: PlaceItemsValue;
  placeContent?: ContentDistributionValue;
  gap?: GapValue;
  columnGap?: GapValue;
  rowGap?: GapValue;
  radius?: RadiusValue;
  shadow?: ShadowValue;
};

/**
 * Atelier style 类型 props。
 */
export type AtelierStyleProps = {
  bg?: DefaultColorKey;
  borderColor?: DefaultColorKey;
};

/**
 * Atelier 全量公共 props 类型。
 */
export type AtelierProps = AtelierClassProps & AtelierStyleProps;

type ClassPropConfig = {
  values: readonly string[];
  allowNegative?: boolean;
  parseValue?: (value: string) => string;
};

const parseSizingValue = (value: string) => (value.endsWith('%') ? value.slice(0, -1) : value);

/**
 * Atelier class props 的静态配置：只声明值域与命名规则，不预先展开成 class 名。
 */
const classPropConfigs: Record<keyof AtelierClassProps, ClassPropConfig> = {
  p: { values: paddingValues },
  px: { values: paddingValues },
  py: { values: paddingValues },
  pt: { values: paddingValues },
  pr: { values: paddingValues },
  pb: { values: paddingValues },
  pl: { values: paddingValues },
  m: { values: marginValues, allowNegative: true },
  mx: { values: marginValues, allowNegative: true },
  my: { values: marginValues, allowNegative: true },
  mt: { values: marginValues, allowNegative: true },
  mr: { values: marginValues, allowNegative: true },
  mb: { values: marginValues, allowNegative: true },
  ml: { values: marginValues, allowNegative: true },
  display: { values: displayValues },
  position: { values: positionValues },
  inset: { values: positionEdgeValues, allowNegative: true },
  top: { values: positionEdgeValues, allowNegative: true },
  right: { values: positionEdgeValues, allowNegative: true },
  bottom: { values: positionEdgeValues, allowNegative: true },
  left: { values: positionEdgeValues, allowNegative: true },
  overflow: { values: overflowValues },
  overflowX: { values: overflowValues },
  overflowY: { values: overflowValues },
  width: { values: widthValues, parseValue: parseSizingValue },
  minWidth: { values: widthValues, parseValue: parseSizingValue },
  maxWidth: { values: widthValues, parseValue: parseSizingValue },
  height: { values: heightValues, parseValue: parseSizingValue },
  minHeight: { values: heightValues, parseValue: parseSizingValue },
  maxHeight: { values: heightValues, parseValue: parseSizingValue },
  flexBasis: { values: flexBasisValues, parseValue: parseSizingValue },
  flexGrow: { values: flexGrowValues },
  flexShrink: { values: flexShrinkValues },
  flexDirection: { values: flexDirectionValues },
  flexWrap: { values: flexWrapValues },
  alignItems: { values: alignValues },
  alignContent: { values: alignContentValues },
  alignSelf: { values: alignValues },
  justifyItems: { values: justifyItemsValues },
  justifyContent: { values: contentDistributionValues },
  justifySelf: { values: justifySelfValues },
  placeItems: { values: placeItemsValues },
  placeContent: { values: contentDistributionValues },
  gap: { values: gapValues },
  columnGap: { values: gapValues },
  rowGap: { values: gapValues },
  radius: { values: radiusValues },
  shadow: { values: shadowValues },
};

const classCache = new Map<keyof AtelierClassProps, Map<string, string>>();

/**
 * 按需生成单个 prop 与值对应的 Atelier 类名，并只缓存实际用到的那一条。
 *
 * 非 class prop 或非法值返回 `undefined`，由调用方继续透传。
 */
export const getAtelierClassName = (
  propName: keyof AtelierClassProps,
  value: string,
): string | undefined => {
  const config = Object.hasOwn(classPropConfigs, propName) ? classPropConfigs[propName] : undefined;

  if (isNil(config)) return undefined;

  const cachedClassNames = classCache.get(propName);

  const cachedClassName = cachedClassNames?.get(value);

  if (hasValue(cachedClassName)) return cachedClassName;

  const { allowNegative = false, parseValue, values } = config;

  if (!values.includes(value)) return undefined;

  const isNegative = allowNegative && value.startsWith('-');
  const valueWithoutSign = isNegative ? value.slice(1) : value;
  const parsedValue = parseValue ? parseValue(valueWithoutSign) : valueWithoutSign;
  const className = `${isNegative ? '-' : ''}${getPrefixCls(kebabCase(propName))}-${parsedValue}`;

  if (hasValue(cachedClassNames)) {
    cachedClassNames.set(value, className);
  } else {
    classCache.set(propName, new Map([[value, className]]));
  }

  return className;
};

/**
 * Atelier 全量 style 映射。
 */
export const atelierStyleMaps = {
  bg: (value: string) => ({
    background: `var(${toColorVarName(value)})`,
  }),
  borderColor: (value: string) =>
    ({
      '--color-border': `var(${toColorVarName(value)})`,
    }) as CSSProperties,
} satisfies Record<keyof AtelierStyleProps, (value: string) => CSSProperties>;
