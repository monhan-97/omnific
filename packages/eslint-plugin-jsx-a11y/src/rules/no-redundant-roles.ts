/**
 * @file Enforce explicit role property is not the same as implicit/default role
 *   property on element.
 * @author Ethan Cohen <@evcohen>
 */

import { isArray, isNil, isPlainObject } from '@omnific/utils';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import getExplicitRole from '../util/getExplicitRole';
import getImplicitRole from '../util/getImplicitRole';

const DEFAULT_ROLE_EXCEPTIONS: Record<string, string[]> = {
  nav: ['navigation'],
};

type AllowedRedundantRolesOptions = Record<string, string[]>;

/**
 * ESLint rule: enforce explicit role is not the same as the implicit role.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce explicit role property is not the same as implicit/default role property on element.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/no-redundant-roles.md',
    },
    schema: [
      {
        type: 'object',
        additionalProperties: {
          type: 'array',
          items: {
            type: 'string',
          },
          uniqueItems: true,
        },
        description:
          'An object mapping element types to arrays of roles that are allowed to be redundant for those elements.',
      },
    ],
    defaultOptions: [{}],
    messages: {
      redundantRole:
        'The element {{element}} has an implicit role of {{implicitRole}}. Defining this explicitly is redundant and should be avoided.',
    },
  },

  create(context) {
    const options = context.options;
    const elementType = getElementType(context);
    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const type = elementType(opening);
        const implicitRole = getImplicitRole(type, opening.attributes);
        const explicitRole = getExplicitRole(type, opening.attributes);

        if (implicitRole !== explicitRole || isNil(implicitRole)) {
          return;
        }

        const allowedRedundantRoles = (options[0] ?? {}) as AllowedRedundantRolesOptions;
        const redundantRolesForElement = isPlainObject(allowedRedundantRoles)
          && Object.hasOwn(allowedRedundantRoles, type)
          && isArray(allowedRedundantRoles[type]) ? allowedRedundantRoles[type] : DEFAULT_ROLE_EXCEPTIONS[type] ?? [];

        if (redundantRolesForElement.includes(implicitRole)) {
          return;
        }

        context.report({
          node: opening,
          messageId: 'redundantRole',
          data: {
            element: type,
            implicitRole: implicitRole.toLowerCase(),
          },
        });
      },
    };
  },
};

export default rule;
