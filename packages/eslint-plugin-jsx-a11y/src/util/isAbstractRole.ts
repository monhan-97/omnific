/**
 * @fileoverview Returns whether an element uses an abstract ARIA role.
 */

import { hasValue, isString } from '@omnific/utils';
import { dom, roles } from 'aria-query';
import type { ARIARoleDefinitionKey } from 'aria-query';

import { type JsxAttributes, getLiteralPropValue, getProp } from './jsxAst';

const abstractRoles = new Set(
  roles.keys().filter(role => {
    const definition = roles.get(role);
    // aria-query role definitions expose an `abstract` boolean flag.
    return hasValue(definition) && definition.abstract;
  }),
);

const DOMElements = new Set(dom.keys());

/**
 * Returns whether a DOM element uses an abstract ARIA role.
 * Higher-level JSX components are skipped (unknown DOM mapping).
 * @param tagName - Element type name.
 * @param attributes - JSX attributes.
 * @returns `true` when the explicit role is abstract.
 */
export default function isAbstractRole(
  tagName: string,
  attributes: JsxAttributes,
): boolean {
  // Do not test higher level JSX components, as we do not know what
  // low-level DOM element this maps to.
  if (DOMElements.has(tagName)) {
    const role = getLiteralPropValue(getProp(attributes, 'role'));
    return isString(role) && abstractRoles.has(role as ARIARoleDefinitionKey);
  }

  return false;
}
