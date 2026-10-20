/**
 * @fileoverview Implicit ARIA role for `img`.
 */

import { hasValue, isString, isStringEmpty } from '@omnific/utils';
import type { ARIARoleDefinitionKey } from 'aria-query';

import { type JsxAttributes, getLiteralPropValue, getProp } from '../jsxAst';

/**
 * Returns the implicit role for an img tag.
 * @param attributes - JSX attributes.
 * @returns Implicit role or `null`.
 */
export default function getImplicitRoleForImg(
  attributes: JsxAttributes,
): ARIARoleDefinitionKey | null {
  const alt = getProp(attributes, 'alt');

  if (hasValue(alt)) {
    const altValue = getLiteralPropValue(alt);
    if (isString(altValue) && isStringEmpty(altValue)) {
      return null;
    }
  }

  /**
   * If the src attribute can be determined to be an svg, allow the role to be
   * set to 'img' so that VoiceOver on Safari can be better supported.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#identifying_svg_as_an_image
   * @see https://bugs.webkit.org/show_bug.cgi?id=216364
   */
  const src = getProp(attributes, 'src');
  if (hasValue(src)) {
    const srcValue = getLiteralPropValue(src);
    if (isString(srcValue) && srcValue.includes('.svg')) {
      return null;
    }
  }

  return 'img';
}
