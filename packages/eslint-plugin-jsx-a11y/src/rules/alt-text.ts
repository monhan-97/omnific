/**
 * @file Enforce all elements that require alternative text have it.
 * @author Ethan Cohen
 */

import { hasValue, isNil, isString, isStringEmpty } from '@omnific/utils';
import type { Rule } from 'eslint';
import type { JSXElement, JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import hasAccessibleChild from '../util/hasAccessibleChild';
import isPresentationRole from '../util/isPresentationRole';
import { asRuleNode, getLiteralPropValue, getProp, getPropValue } from '../util/jsxAst';

const DEFAULT_ELEMENTS = ['img', 'object', 'area', 'input[type="image"]'] as const;

const schema = {
  type: 'object',
  properties: {
    elements: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    img: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    object: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    area: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    'input[type="image"]': {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
  },
  additionalProperties: false,
} as const;

type AltTextOptions = {
  elements: string[];
  img?: string[];
  object?: string[];
  area?: string[];
  'input[type="image"]'?: string[];
};

/**
 * Returns whether an aria-label / aria-labelledby prop has a usable value.
 * @param prop - JSX attribute or `undefined`.
 * @returns `true` when the prop value is present and non-empty.
 */
function ariaLabelHasValue(prop: ReturnType<typeof getProp>): boolean {
  const value = getPropValue(prop);
  if (isNil(value)) {
    return false;
  }
  if (isString(value) && isStringEmpty(value)) {
    return false;
  }
  return true;
}

type RuleHandler = (
  context: Rule.RuleContext,
  node: JSXOpeningElement,
  nodeType: string,
  elementType: (opening: JSXOpeningElement) => string,
) => void;

const ruleByElement: Record<string, RuleHandler> = {
  img(context, node, nodeType) {
    const altProp = getProp(node.attributes, 'alt');

    // Missing alt prop error.
    if (isNil(altProp)) {
      if (isPresentationRole(nodeType, node.attributes)) {
        context.report({
          node,
          messageId: 'preferAlt',
        });
        return;
      }
      // Check for `aria-label` to provide text alternative
      // Don't create an error if the attribute is used correctly. But if it
      // isn't, suggest that the developer use `alt` instead.
      const ariaLabelProp = getProp(node.attributes, 'aria-label');
      if (hasValue(ariaLabelProp)) {
        if (!ariaLabelHasValue(ariaLabelProp)) {
          context.report({
            node,
            messageId: 'ariaLabelMissingValue',
          });
        }
        return;
      }
      // Check for `aria-labelledby` to provide text alternative
      // Don't create an error if the attribute is used correctly. But if it
      // isn't, suggest that the developer use `alt` instead.
      const ariaLabelledbyProp = getProp(node.attributes, 'aria-labelledby');
      if (hasValue(ariaLabelledbyProp)) {
        if (!ariaLabelHasValue(ariaLabelledbyProp)) {
          context.report({
            node,
            messageId: 'ariaLabelledbyMissingValue',
          });
        }
        return;
      }

      context.report({
        node,
        messageId: 'missingAlt',
        data: { nodeType },
      });
      return;
    }

    // Check if alt prop is undefined.
    const altValue = getPropValue(altProp);
    const isNullValued = isNil(altProp.value); // <img alt />

    if (altValue === '' || (!isNullValued && altValue)) {
      return;
    }

    // Undefined alt prop error.
    context.report({
      node,
      messageId: 'invalidAlt',
      data: { nodeType },
    });
  },

  object(context, node, _unusedNodeType, elementType) {
    const ariaLabelProp = getProp(node.attributes, 'aria-label');
    const arialLabelledByProp = getProp(node.attributes, 'aria-labelledby');
    const hasLabel =
      ariaLabelHasValue(ariaLabelProp) || ariaLabelHasValue(arialLabelledByProp);
    const titleProp = getLiteralPropValue(getProp(node.attributes, 'title'));
    const hasTitleAttr = Boolean(titleProp);
    const parent = asRuleNode(node).parent as JSXElement;

    if (hasLabel || hasTitleAttr || hasAccessibleChild(parent, elementType)) {
      return;
    }

    context.report({
      node,
      messageId: 'object',
    });
  },

  area(context, node) {
    const ariaLabelProp = getProp(node.attributes, 'aria-label');
    const arialLabelledByProp = getProp(node.attributes, 'aria-labelledby');
    const hasLabel =
      ariaLabelHasValue(ariaLabelProp) || ariaLabelHasValue(arialLabelledByProp);

    if (hasLabel) {
      return;
    }

    const altProp = getProp(node.attributes, 'alt');
    if (isNil(altProp)) {
      context.report({
        node,
        messageId: 'area',
      });
      return;
    }

    const altValue = getPropValue(altProp);
    const isNullValued = isNil(altProp.value); // <area alt />

    if (altValue === '' || (!isNullValued && altValue)) {
      return;
    }

    context.report({
      node,
      messageId: 'area',
    });
  },

  'input[type="image"]'(context, node, nodeType) {
    // Only test input[type="image"]
    if (nodeType === 'input') {
      const typePropValue = getPropValue(getProp(node.attributes, 'type'));
      if (typePropValue !== 'image') {
        return;
      }
    }
    const ariaLabelProp = getProp(node.attributes, 'aria-label');
    const arialLabelledByProp = getProp(node.attributes, 'aria-labelledby');
    const hasLabel =
      ariaLabelHasValue(ariaLabelProp) || ariaLabelHasValue(arialLabelledByProp);

    if (hasLabel) {
      return;
    }

    const altProp = getProp(node.attributes, 'alt');
    if (isNil(altProp)) {
      context.report({
        node,
        messageId: 'inputImage',
      });
      return;
    }

    const altValue = getPropValue(altProp);
    const isNullValued = isNil(altProp.value); // <area alt />

    if (altValue === '' || (!isNullValued && altValue)) {
      return;
    }

    context.report({
      node,
      messageId: 'inputImage',
    });
  },
};

/**
 * ESLint rule: enforce alternative text on elements that require it.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce all elements that require alternative text have meaningful information to relay back to end user.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/alt-text.md',
    },
    schema: [schema],
    defaultOptions: [{ elements: [...DEFAULT_ELEMENTS] }],
    messages: {
      preferAlt:
        'Prefer alt="" over a presentational role. First rule of aria is to not use aria if it can be achieved via native HTML.',
      ariaLabelMissingValue:
        'The aria-label attribute must have a value. The alt attribute is preferred over aria-label for images.',
      ariaLabelledbyMissingValue:
        'The aria-labelledby attribute must have a value. The alt attribute is preferred over aria-labelledby for images.',
      missingAlt:
        '{{nodeType}} elements must have an alt prop, either with meaningful text, or an empty string for decorative images.',
      invalidAlt: 'Invalid alt value for {{nodeType}}. Use alt="" for presentational images.',
      object:
        'Embedded <object> elements must have alternative text by providing inner text, aria-label or aria-labelledby props.',
      area: 'Each area of an image map must have a text alternative through the `alt`, `aria-label`, or `aria-labelledby` prop.',
      inputImage:
        '<input> elements with type="image" must have a text alternative through the `alt`, `aria-label`, or `aria-labelledby` prop.',
    },
  },

  create(context) {
    const options = (context.options[0] ?? { elements: [...DEFAULT_ELEMENTS] }) as AltTextOptions;
    // Elements to validate for alt text.
    const elementOptions = options.elements;
    // Get custom components for just the elements that will be tested.
    const customComponents = elementOptions.flatMap(
      element => (options[element as keyof AltTextOptions] as string[] | undefined) ?? [],
    );
    const typesToValidate = new Set(
      [...customComponents, ...elementOptions].map(type =>
        type === 'input[type="image"]' ? 'input' : type,
      ),
    );
    const elementType = getElementType(context);

    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const nodeType = elementType(opening);
        if (!typesToValidate.has(nodeType)) {
          return;
        }

        let DOMElement = nodeType;
        if (DOMElement === 'input') {
          DOMElement = 'input[type="image"]';
        }

        // Map nodeType to the DOM element if we are running this on a custom component.
        if (!elementOptions.includes(DOMElement)) {
          const mapped = elementOptions.find(element => {
            const customComponentsForElement =
              (options[element as keyof AltTextOptions] as string[] | undefined) ?? [];
            return customComponentsForElement.includes(nodeType);
          });
          if (isNil(mapped)) {
            return;
          }
          DOMElement = mapped;
        }

        ruleByElement[DOMElement]?.(context, opening, nodeType, elementType);
      },
    };
  },
};

export default rule;
