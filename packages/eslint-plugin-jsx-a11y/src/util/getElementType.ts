/**
 * @fileoverview Resolves the effective DOM element type for a JSX opening element.
 */

import { hasValue, isArray, isNil, isPlainObject, isString } from '@omnific/utils';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import { elementType, getLiteralPropValue, getProp } from './jsxAst';

import type { JsxA11ySettings } from '../types/settings';

/**
 * Returns a function that resolves the effective element type for a node,
 * honoring `settings['jsx-a11y']` component and polymorphic mappings.
 * @param context - ESLint rule context.
 * @returns Element-type resolver for opening elements.
 */
export default function getElementType(
  context: Rule.RuleContext,
): (node: JSXOpeningElement) => string {
  const settings = context.settings as { 'jsx-a11y'?: JsxA11ySettings };
  const jsxA11ySettings = settings['jsx-a11y'];
  const polymorphicPropName =
    hasValue(jsxA11ySettings) && isString(jsxA11ySettings.polymorphicPropName)
      ? jsxA11ySettings.polymorphicPropName
      : undefined;
  const polymorphicAllowList =
    hasValue(jsxA11ySettings) && isArray(jsxA11ySettings.polymorphicAllowList)
      ? jsxA11ySettings.polymorphicAllowList
      : undefined;
  const componentMap =
    hasValue(jsxA11ySettings) && isPlainObject(jsxA11ySettings.components)
      ? jsxA11ySettings.components
      : undefined;

  return (node: JSXOpeningElement): string => {
    const polymorphicProp = hasValue(polymorphicPropName)
      ? getLiteralPropValue(getProp(node.attributes, polymorphicPropName))
      : undefined;

    let rawType = elementType(node);
    const allowPolymorphic =
      isNil(polymorphicAllowList) || polymorphicAllowList.includes(rawType);
    if (allowPolymorphic && isString(polymorphicProp)) {
      rawType = polymorphicProp;
    }

    if (isNil(componentMap)) {
      return rawType;
    }

    if (Object.hasOwn(componentMap, rawType)) {
      const mapped = componentMap[rawType];
      return isString(mapped) ? mapped : rawType;
    }

    return rawType;
  };
}
