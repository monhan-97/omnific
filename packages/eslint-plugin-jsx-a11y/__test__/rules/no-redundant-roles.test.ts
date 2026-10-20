/**
 * @file Migrated from eslint-plugin-jsx-a11y-x no-redundant-roles.
 */

import { RuleTester } from '../utils/ruleTester';
import parserOptionsMapper from '../utils/parserOptionsMapper';
import parsers from '../utils/parsers';
import ruleOptionsMapperFactory from '../utils/ruleOptionsMapperFactory';
import rule from '../../src/rules/no-redundant-roles';

const ruleTester = new RuleTester();

const expectedError = (element: string, implicitRole: string) => ({
  message: `The element ${element} has an implicit role of ${implicitRole}. Defining this explicitly is redundant and should be avoided.`,
});

const ruleName = 'jsx-a11y/no-redundant-roles';

const componentsSettings = {
  'jsx-a11y': {
    components: {
      Button: 'button',
    },
  },
};

const alwaysValid = [
  { code: '<div />;' },
  { code: '<button role="main" />' },
  { code: '<MyComponent role="button" />' },
  { code: `<button role={\`\${foo}button\`} />` },
  { code: `<Button role={\`\${foo}button\`} />`, settings: componentsSettings },
  { code: '<select role="menu"><option>1</option><option>2</option></select>' },
  {
    code: '<select role="menu" size={2}><option>1</option><option>2</option></select>',
  },
  {
    code: '<select role="menu" multiple><option>1</option><option>2</option></select>',
  },
];

const neverValid = [
  {
    code: '<body role="DOCUMENT" />',
    errors: [expectedError('body', 'document')],
  },
  // button - treated as button by default
  {
    code: '<button role="button" />',
    errors: [expectedError('button', 'button')],
  },
  {
    code: '<Button role="button" />',
    settings: componentsSettings,
    errors: [expectedError('button', 'button')],
  },
  // select - treated as combobox by default
  {
    code: '<select role="combobox"><option>1</option><option>2</option></select>',
    errors: [expectedError('select', 'combobox')],
  },
  {
    code: '<select role="combobox" size="" />',
    errors: [expectedError('select', 'combobox')],
  },
  {
    code: '<select role="combobox" size={1} />',
    errors: [expectedError('select', 'combobox')],
  },
  {
    code: '<select role="combobox" size="1" />',
    errors: [expectedError('select', 'combobox')],
  },
  {
    code: '<select role="combobox" size={null}></select>',
    errors: [expectedError('select', 'combobox')],
  },
  {
    code: '<select role="combobox" size={undefined}></select>',
    errors: [expectedError('select', 'combobox')],
  },
  {
    code: '<select role="combobox" multiple={undefined}></select>',
    errors: [expectedError('select', 'combobox')],
  },
  {
    code: '<select role="combobox" multiple={false}></select>',
    errors: [expectedError('select', 'combobox')],
  },
  {
    code: '<select role="combobox" multiple=""></select>',
    errors: [expectedError('select', 'combobox')],
  },
  // select - treated as listbox when multiple OR size > 1
  {
    code: '<select role="listbox" size="3" />',
    errors: [expectedError('select', 'listbox')],
  },
  {
    code: '<select role="listbox" size={2} />',
    errors: [expectedError('select', 'listbox')],
  },
  {
    code: '<select role="listbox" multiple><option>1</option><option>2</option></select>',
    errors: [expectedError('select', 'listbox')],
  },
  {
    code: '<select role="listbox" multiple={true}></select>',
    errors: [expectedError('select', 'listbox')],
  },
];

ruleTester.run(`${ruleName}:recommended`, rule, {
  valid: parsers
    .all([...alwaysValid, { code: '<nav role="navigation" />' }])
    .map((testCase) => parserOptionsMapper(testCase)),
  invalid: parsers.all(neverValid).map((testCase) => parserOptionsMapper(testCase)),
});

const noNavExceptionsOptions = { nav: [] };
const listException = { ul: ['list'], ol: ['list'] };

const alwaysValidWithNoNavExceptions = alwaysValid.map(
  ruleOptionsMapperFactory(noNavExceptionsOptions),
);
const neverValidWithNoNavExceptions = [
  ...neverValid,
  {
    code: '<nav role="navigation" />',
    errors: [expectedError('nav', 'navigation')],
  },
].map(ruleOptionsMapperFactory(noNavExceptionsOptions));

ruleTester.run(`${ruleName}:recommended`, rule, {
  valid: parsers
    .all(alwaysValidWithNoNavExceptions)
    .map((testCase) => parserOptionsMapper(testCase)),
  invalid: parsers
    .all(neverValidWithNoNavExceptions)
    .map((testCase) => parserOptionsMapper(testCase)),
});

const listOverrideValid = [
  { code: '<ul role="list" />' },
  { code: '<ol role="list" />' },
  { code: '<dl role="list" />' },
  { code: '<img src="example.svg" role="img" />' },
  { code: '<svg role="img" />' },
].map(ruleOptionsMapperFactory(listException));

ruleTester.run(`${ruleName}:recommended (valid list role override)`, rule, {
  valid: parsers
    .all(listOverrideValid)
    .map((testCase) => parserOptionsMapper(testCase)),
  invalid: parsers
    .all([
      { code: '<ul role="list" />', errors: [expectedError('ul', 'list')] },
      { code: '<ol role="list" />', errors: [expectedError('ol', 'list')] },
      { code: '<img role="img" />', errors: [expectedError('img', 'img')] },
      {
        code: '<img src={someVariable} role="img" />',
        errors: [expectedError('img', 'img')],
      },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
});
