/**
 * @file Enforce ARIA state and property values are valid.
 * @author Ethan Cohen
 */

import {
  isBoolean,
  isNil,
  isNull,
  isString,
  isUndefined,
} from '@omnific/utils';
import { aria } from 'aria-query';
import type { ARIAProperty, ARIAPropertyDefinition } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXAttribute } from 'estree-jsx';

import { asRuleNode, getLiteralPropValue, getPropValue, propName } from '../util/jsxAst';

/**
 * Token values accepted by aria-query (string tokens and booleans like `true`).
 */
type AriaPermittedValue = string | boolean;

/**
 * Validates a literal ARIA attribute value against its expected type.
 * @param value - Literal prop value.
 * @param expectedType - ARIA property type from aria-query.
 * @param permittedValues - Allowed token values when applicable.
 * @returns Whether the value matches the expected type.
 */
export function validityCheck(
  value: unknown,
  expectedType: ARIAPropertyDefinition['type'] | null | undefined,
  permittedValues: readonly AriaPermittedValue[] = [],
): boolean {
  switch (expectedType) {
    case 'boolean': {
      return isBoolean(value);
    }
    case 'string':
    case 'id': {
      return isString(value);
    }
    case 'tristate': {
      return isBoolean(value) || value === 'mixed';
    }
    case 'integer':
    case 'number': {
      // Booleans resolve to 0/1 values so hard check that it's not first.
      // ponytail: Number() coercion matches upstream; upgrade if aria-query
      // gains a stricter numeric validator.
      return !isBoolean(value) && !Number.isNaN(Number(value));
    }
    case 'token': {
      const token = isString(value) ? value.toLowerCase() : value;
      return permittedValues.includes(token as AriaPermittedValue);
    }
    case 'idlist': {
      return (
        isString(value)
        && value.split(' ').every(idToken => validityCheck(idToken, 'id', []))
      );
    }
    case 'tokenlist': {
      return (
        isString(value)
        && value
          .split(' ')
          .every(listToken => permittedValues.includes(listToken.toLowerCase()))
      );
    }
    default: {
      return false;
    }
  }
}

/**
 * Enforce ARIA state and property values are valid.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce ARIA state and property values are valid.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/aria-proptypes.md',
    },
    schema: [],
    messages: {
      tristate: 'The value for {{name}} must be a boolean or the string "mixed".',
      token: 'The value for {{name}} must be a single token from the following: {{permittedValues}}.',
      tokenlist:
        'The value for {{name}} must be a list of one or more tokens from the following: {{permittedValues}}.',
      idlist:
        'The value for {{name}} must be a list of strings that represent DOM element IDs (idlist)',
      id: 'The value for {{name}} must be a string that represents a DOM element ID',
      typed: 'The value for {{name}} must be a {{type}}.',
    },
  },

  create(context: Rule.RuleContext) {
    return {
      JSXAttribute(attribute: JSXAttribute) {
        const name = propName(attribute);
        const normalizedName = name.toLowerCase();

        // Not a valid aria-* state or property.
        const ariaAttributes = aria.get(normalizedName as ARIAProperty);
        // Ignore the attribute if its value is null or undefined.
        if (!normalizedName.startsWith('aria-') || isNil(ariaAttributes) || isNil(getPropValue(attribute))) {
          return;
        }

        const value = getLiteralPropValue(attribute);

        // Ignore the attribute if its value is not a literal.
        // getLiteralPropValue returns `null` for non-literals; `undefined` is a
        // distinct literal absence used with allowUndefined.
        if (isNull(value)) {
          return;
        }

        // These are the attributes of the property/state to check against.
        const attributes = ariaAttributes;
        const permittedType = attributes.type;
        // aria-query types spell this `allowundefined` (no camelCase).
        const allowUndefined = attributes.allowundefined || false;
        const permittedValues = attributes.values || [];

        const isValid =
          validityCheck(value, permittedType, permittedValues)
          || (allowUndefined && isUndefined(value));

        if (isValid) {
          return;
        }

        const messageId = (() => {
          switch (permittedType) {
            case 'tristate': {
              return 'tristate' as const;
            }
            case 'token': {
              return 'token' as const;
            }
            case 'tokenlist': {
              return 'tokenlist' as const;
            }
            case 'idlist': {
              return 'idlist' as const;
            }
            case 'id': {
              return 'id' as const;
            }
            default: {
              return 'typed' as const;
            }
          }
        })();

        context.report({
          node: asRuleNode(attribute),
          messageId,
          data: {
            name,
            type: permittedType,
            permittedValues: String(permittedValues),
          },
        });
      },
    };
  },
};

export default rule;
