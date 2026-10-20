/**
 * @fileoverview Returns boolean indicating whether the given element is a DOM element.
 */

import { dom } from 'aria-query';

/**
 * Returns whether `tagName` is a known DOM element name.
 * @param tagName - Element type name.
 * @returns `true` when `tagName` is in the ARIA DOM table.
 */
export default function isDOMElement(tagName: string): boolean {
  return dom.has(tagName);
}
