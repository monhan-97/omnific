/**
 * @file Enforce label tags have an associated control.
 * @author Jesse Beach
 */

import { hasValue, isArray, isPlainObject } from '@omnific/utils';
import type { Rule } from 'eslint';
import type { JSXElement, JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import { getProp, getPropValue, hasProp } from '../util/jsxAst';
import mayContainChildComponent from '../util/mayContainChildComponent';
import mayHaveAccessibleLabel from '../util/mayHaveAccessibleLabel';
import { getPicomatch } from '../util/picomatchCache';

const schema = {
  type: 'object',
  properties: {
    labelComponents: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
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
    assert: {
      description: 'Assert that the label has htmlFor, a nested label, both or either',
      type: 'string',
      enum: ['htmlFor', 'nesting', 'both', 'either'],
    },
    depth: {
      description: 'JSX tree depth limit to check for accessible label',
      type: 'integer',
      minimum: 0,
    },
  },
  additionalProperties: false,
} as const;

type LabelHasAssociatedControlOptions = {
  labelComponents: string[];
  labelAttributes: string[];
  controlComponents: string[];
  assert: 'htmlFor' | 'nesting' | 'both' | 'either';
  depth: number;
};

/**
 * Returns whether the opening element has a non-empty htmlFor / for attribute.
 * @param node - JSX opening element.
 * @param context - ESLint rule context.
 * @returns `true` when a valid association attribute is present.
 */
function validateHtmlFor(node: JSXOpeningElement, context: Rule.RuleContext): boolean {
  const settings = context.settings as {
    'jsx-a11y'?: {
      attributes?: {
        for?: string[];
      };
    };
  };
  const jsxA11ySettings = settings['jsx-a11y'];
  const attributes =
    hasValue(jsxA11ySettings) && isPlainObject(jsxA11ySettings.attributes)
      ? jsxA11ySettings.attributes
      : undefined;
  const htmlForAttributes =
    hasValue(attributes) && isArray(attributes.for) ? attributes.for : ['htmlFor'];

  for (const attribute of htmlForAttributes) {
    if (hasProp(node.attributes, attribute)) {
      const htmlForAttr = getProp(node.attributes, attribute);
      const htmlForValue = getPropValue(htmlForAttr);

      return hasValue(htmlForAttr) && Boolean(htmlForValue);
    }
  }

  return false;
}

/**
 * ESLint rule: enforce label elements have accessible text and an associated control.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that a `label` tag has a text label and an associated control.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/label-has-associated-control.md',
    },
    schema: [schema],
    defaultOptions: [
      {
        labelComponents: [],
        labelAttributes: [],
        controlComponents: [],
        assert: 'either',
        depth: 2,
      },
    ],
    messages: {
      accessibleLabel: 'A form label must have accessible text.',
      htmlFor: 'A form label must have a valid htmlFor attribute.',
      nesting: 'A form label must have an associated control as a descendant.',
      either:
        'A form label must either have a valid htmlFor attribute or a control as a descendant.',
      both: 'A form label must have a valid htmlFor attribute and a control as a descendant.',
    },
  },

  create(context) {
    const options: LabelHasAssociatedControlOptions = {
      labelComponents: [],
      labelAttributes: [],
      controlComponents: [],
      assert: 'either',
      depth: 2,
      ...(context.options[0] as Partial<LabelHasAssociatedControlOptions> | undefined),
    };
    const labelComponents = options.labelComponents;
    const assertType = options.assert;
    const labelComponentNames = ['label', ...labelComponents];
    const elementType = getElementType(context);
    const labelMatchers = labelComponentNames.map(name => getPicomatch(name));

    /**
     * Validates a label JSX element.
     * @param node - JSX element.
     */
    const ruleVisitor = (node: JSXElement) => {
      const opening = node.openingElement as JSXOpeningElement;
      const resolvedType = elementType(opening);
      const isLabelComponent = labelMatchers.some(match => match(resolvedType));
      if (!isLabelComponent) {
        return;
      }

      const controlComponents = [
        'input',
        'meter',
        'output',
        'progress',
        'select',
        'textarea',
        ...options.controlComponents,
      ];
      // Prevent crazy recursion.
      const recursionDepth = Math.min(options.depth, 25);
      const hasHtmlFor = validateHtmlFor(opening, context);
      // Check for multiple control components.
      const hasNestedControl = controlComponents.some(name =>
        mayContainChildComponent(node, name, recursionDepth, elementType),
      );
      const hasAccessibleLabel = mayHaveAccessibleLabel(
        node,
        recursionDepth,
        options.labelAttributes,
        elementType,
        controlComponents,
      );

      // Bail out immediately if we don't have an accessible label.
      if (!hasAccessibleLabel) {
        context.report({
          node: opening,
          messageId: 'accessibleLabel',
        });
        return;
      }
      switch (assertType) {
        case 'htmlFor': {
          if (!hasHtmlFor) {
            context.report({
              node: opening,
              messageId: 'htmlFor',
            });
          }
          break;
        }
        case 'nesting': {
          if (!hasNestedControl) {
            context.report({
              node: opening,
              messageId: 'nesting',
            });
          }
          break;
        }
        case 'both': {
          if (!hasHtmlFor || !hasNestedControl) {
            context.report({
              node: opening,
              messageId: 'both',
            });
          }
          break;
        }
        case 'either': {
          if (!hasHtmlFor && !hasNestedControl) {
            context.report({
              node: opening,
              messageId: 'either',
            });
          }
          break;
        }
        default: {
          break;
        }
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
