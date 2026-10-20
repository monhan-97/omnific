/**
 * @fileoverview Returns whether an element uses a presentation / none role.
 */


import { type JsxAttributes, getLiteralPropValue, getProp } from './jsxAst';

const presentationRoles = new Set(['presentation', 'none']);

/**
 * Returns whether the element has an explicit `presentation` or `none` role.
 * @param _tagName - Element type (unused; kept for call-site symmetry).
 * @param attributes - JSX attributes.
 * @returns `true` when the role is presentation/none.
 */
export default function isPresentationRole(
  _tagName: string,
  attributes: JsxAttributes,
): boolean {
  return presentationRoles.has(getLiteralPropValue(getProp(attributes, 'role')) as string);
}
