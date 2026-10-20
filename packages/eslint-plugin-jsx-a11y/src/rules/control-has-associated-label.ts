/**
 * @file Enforce controls are associated with a text label.
 * @author Jesse Beach
 */

import { isNil, isString } from '@omnific/utils';
import type { Rule } from 'eslint';
import type { JSXElement, JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import isDOMElement from '../util/isDOMElement';
import isHiddenFromScreenReader from '../util/isHiddenFromScreenReader';
import isInteractiveElement from '../util/isInteractiveElement';
import isInteractiveRole from '../util/isInteractiveRole';
import { getLiteralPropValue, getProp } from '../util/jsxAst';
import mayHaveAccessibleLabel from '../util/mayHaveAccessibleLabel';

const ignoreList = ['link'] as const;

const schema = {
  type: 'object',
  properties: {
    labelAttributes: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    controlComponents: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    ignoreElements: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    ignoreRoles: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    depth: {
      description: 'JSX tree depth limit to check for accessible label',
      type: 'integer',
      minimum: 0,
    },
  },
  additionalProperties: false,
} as const;

type ControlHasAssociatedLabelOptions = {
  labelAttributes: string[];
  controlComponents: string[];
  ignoreElements: string[];
  ignoreRoles: string[];
  depth?: number;
};

/**
 * ESLint rule: enforce interactive controls have a text label.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that a control (an interactive element) has a text label.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/control-has-associated-label.md',
    },
    schema: [schema],
    defaultOptions: [
      {
        labelAttributes: [],
        controlComponents: [],
        ignoreElements: [],
        ignoreRoles: [],
      },
    ],
    messages: {
      missingLabel: 'A control must be associated with a text label.',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    const options: ControlHasAssociatedLabelOptions = {
      labelAttributes: [],
      controlComponents: [],
      ignoreElements: [],
      ignoreRoles: [],
      ...(context.options[0] as Partial<ControlHasAssociatedLabelOptions> | undefined),
    };
    const { labelAttributes, controlComponents, ignoreElements, ignoreRoles } = options;

    const newIgnoreElements = new Set([...ignoreElements, ...ignoreList]);

    /**
     * Validates a JSX element for an associated accessible label.
     * @param node - JSX element.
     */
    const ruleVisitor = (node: JSXElement) => {
      const opening = node.openingElement as JSXOpeningElement;
      const tag = elementType(opening);
      const role = getLiteralPropValue(getProp(opening.attributes, 'role'));
      // Ignore interactive elements that might get their label from a source
      // that cannot be discerned from static analysis, like
      // <label><input />Save</label>
      if (newIgnoreElements.has(tag)) {
        return;
      }
      // Ignore roles that are "interactive" but should not require a label.
      if (isString(role) && ignoreRoles.includes(role)) {
        return;
      }
      const props = opening.attributes;
      const nodeIsDOMElement = isDOMElement(tag);
      const nodeIsHiddenFromScreenReader = isHiddenFromScreenReader(tag, props);
      const nodeIsInteractiveElement = isInteractiveElement(tag, props);
      const nodeIsInteractiveRole = isInteractiveRole(tag, props);
      const nodeIsControlComponent = controlComponents.includes(tag);

      if (nodeIsHiddenFromScreenReader) {
        return;
      }

      let hasAccessibleLabel = true;
      if (
        nodeIsInteractiveElement ||
        nodeIsControlComponent ||
        (nodeIsInteractiveRole && nodeIsDOMElement)
      ) {
        // Prevent crazy recursion.
        const recursionDepth = Math.min(isNil(options.depth) ? 2 : options.depth, 25);
        hasAccessibleLabel = mayHaveAccessibleLabel(
          node,
          recursionDepth,
          labelAttributes,
          elementType,
          controlComponents,
        );
      }

      if (!hasAccessibleLabel) {
        context.report({
          node: opening,
          messageId: 'missingLabel',
        });
      }
    };

    // Create visitor selectors.
    return {
      JSXElement(node) {
        ruleVisitor(node as JSXElement);
      },
    };
  },
};

export default rule;
