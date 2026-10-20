/**
 * @file Enforces using semantic DOM elements over the ARIA `role` property.
 * @author Jesse Beach
 */

import { hasValue, isArrayEmpty, isNil, isString } from '@omnific/utils';
import { roleElements } from 'aria-query';
import type { ARIARoleRelationConcept, ARIARoleRelationConceptAttribute } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import { getProp, getPropValue } from '../util/jsxAst';

/**
 * Formats a role-element concept as a tag snippet for the error message.
 * @param tag - ARIA role relation concept describing a preferred HTML tag.
 * @returns Human-readable tag string such as `<input type="checkbox">`.
 */
function formatTag(tag: ARIARoleRelationConcept): string {
  if (isArrayEmpty(tag.attributes)) {
    return `<${tag.name}>`;
  }

  const attribute = tag.attributes[0] as ARIARoleRelationConceptAttribute | undefined;
  if (isNil(attribute)) {
    return `<${tag.name}>`;
  }
  const value = hasValue(attribute.value) ? `"${attribute.value}"` : '...';

  return `<${tag.name} ${attribute.name}=${value}>`;
}

/**
 * Returns the last space-separated token from a role prop value.
 * @param rawProp - JSX `role` attribute or `undefined`.
 * @returns Last role token, or the original prop value when absent/empty.
 */
function getLastPropValue(rawProp: ReturnType<typeof getProp>): unknown {
  const propValue = getPropValue(rawProp);
  if (!isString(propValue)) {
    return propValue;
  }

  const lastSpaceIndex = propValue.lastIndexOf(' ');

  return lastSpaceIndex === -1
    ? propValue
    : propValue.slice(Math.max(0, lastSpaceIndex + 1));
}

/**
 * ESLint rule: prefer semantic HTML tags over ARIA roles.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforces using semantic DOM elements over the ARIA `role` property.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/prefer-tag-over-role.md',
    },
    schema: [],
    messages: {
      preferTag:
        'Use {{tag}} instead of the "{{role}}" role to ensure accessibility across all devices.',
    },
  },

  create(context) {
    const elementType = getElementType(context);

    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const role = getLastPropValue(getProp(opening.attributes, 'role'));
        if (!isString(role) || role.length === 0) {
          return;
        }

        const matchedTagsSet = roleElements.get(role as Parameters<typeof roleElements.get>[0]);
        if (isNil(matchedTagsSet)) {
          return;
        }

        const matchedTags = [...matchedTagsSet];
        if (
          matchedTags.some(
            matchedTag => matchedTag.name === elementType(opening),
          )
        ) {
          return;
        }

        const firstTag = matchedTags[0];
        const lastTag = matchedTags.at(-1);
        if (isNil(firstTag) || isNil(lastTag)) {
          return;
        }

        context.report({
          data: {
            tag:
              matchedTags.length === 1
                ? formatTag(firstTag)
                : [
                    matchedTags
                      .slice(0, -1)
                      .map((matchedTag) => formatTag(matchedTag))
                      .join(', '),
                    formatTag(lastTag),
                  ].join(', or '),
            role,
          },
          node: opening,
          messageId: 'preferTag',
        });
      },
    };
  },
};

export default rule;
