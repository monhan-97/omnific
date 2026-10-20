/**
 * @file Enforce that elements with onClick handlers must be tabbable.
 * @author Ethan Cohen
 */

import { hasValue } from '@omnific/utils';
import { dom, roles } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import { roleKeys } from '../util/ariaTables';
import getElementType from '../util/getElementType';
import getTabIndex from '../util/getTabIndex';
import isDisabledElement from '../util/isDisabledElement';
import isHiddenFromScreenReader from '../util/isHiddenFromScreenReader';
import isInteractiveElement from '../util/isInteractiveElement';
import isInteractiveRole from '../util/isInteractiveRole';
import isNonInteractiveElement from '../util/isNonInteractiveElement';
import isNonInteractiveRole from '../util/isNonInteractiveRole';
import isPresentationRole from '../util/isPresentationRole';
import { eventHandlersByType, getLiteralPropValue, getProp, hasAnyProp } from '../util/jsxAst';

const tabbableRoleEnum = roleKeys.filter(name => {
  const role = roles.get(name);
  return (
    hasValue(role) && !role.abstract && role.superClass.some(klasses => klasses.includes('widget'))
  );
});

const schema = {
  type: 'object',
  properties: {
    tabbable: {
      type: 'array',
      items: {
        type: 'string',
        enum: tabbableRoleEnum,
      },
      uniqueItems: true,
      additionalItems: false,
      minItems: 0,
    },
  },
  additionalProperties: false,
} as const;

const interactiveProps = [...eventHandlersByType.mouse, ...eventHandlersByType.keyboard];

type InteractiveSupportsFocusOptions = {
  tabbable?: string[];
};

/**
 * ESLint rule: interactive-role elements with handlers must be focusable.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that elements with interactive handlers like `onClick` must be focusable.',
      url: 'https://github.com/monhan-97/omnific/tree/HEAD/packages/eslint-plugin-jsx-a11y/docs/rules/interactive-supports-focus.md',
    },
    hasSuggestions: true,
    schema: [schema],
    defaultOptions: [{ tabbable: [] }],
    messages: {
      tabbable: "Elements with the '{{role}}' interactive role must be tabbable.",
      focusable: "Elements with the '{{role}}' interactive role must be focusable.",
      'tabIndex=0':
        'Add `tabIndex={0}` to make the element focusable in sequential keyboard navigation.',
      'tabIndex=-1':
        'Add `tabIndex={-1}` to make the element focusable but not reachable via sequential keyboard navigation.',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const options = (context.options[0] ?? { tabbable: [] }) as InteractiveSupportsFocusOptions;
        const tabbable = options.tabbable ?? [];
        const { attributes } = opening;
        const type = elementType(opening);
        const hasInteractiveProps = hasAnyProp(attributes, interactiveProps);
        const hasTabindex = hasValue(getTabIndex(getProp(attributes, 'tabIndex')));

        // Do not test higher level JSX components, as we do not know what
        // low-level DOM element this maps to.
        // Presentation is an intentional signal from the author that this
        // element is not meant to be perceivable. For example, a click screen
        // to close a dialog .
        if (
          hasTabindex
          || !hasInteractiveProps
          || !dom.has(type)
          || isDisabledElement(attributes)
          || isHiddenFromScreenReader(type, attributes)
          || isPresentationRole(type, attributes)
          || !isInteractiveRole(type, attributes)
          || isInteractiveElement(type, attributes)
          || isNonInteractiveElement(type, attributes)
          || isNonInteractiveRole(type, attributes)
        ) {
          return;
        }

        const role = getLiteralPropValue(getProp(attributes, 'role'));
        const roleName = String(role);
        if (tabbable.includes(roleName)) {
          // Always tabbable, tabIndex = 0
          context.report({
            node: opening,
            messageId: 'tabbable',
            data: { role: roleName },
            suggest: [
              {
                messageId: 'tabIndex=0',
                fix(fixer) {
                  return fixer.insertTextAfter(opening.name, ' tabIndex={0}');
                },
              },
            ],
          });
          return;
        }

        // Focusable, tabIndex = -1 or 0
        context.report({
          node: opening,
          messageId: 'focusable',
          data: { role: roleName },
          suggest: [
            {
              messageId: 'tabIndex=0',
              fix(fixer) {
                return fixer.insertTextAfter(opening.name, ' tabIndex={0}');
              },
            },
            {
              messageId: 'tabIndex=-1',
              fix(fixer) {
                return fixer.insertTextAfter(opening.name, ' tabIndex={-1}');
              },
            },
          ],
        });
      },
    };
  },
};

export default rule;
