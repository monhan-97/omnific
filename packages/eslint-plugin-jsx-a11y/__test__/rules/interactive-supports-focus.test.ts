/**
 * @file Enforce that elements with onClick handlers must be focusable.
 * @author Ethan Cohen
 */

import { eventHandlers, eventHandlersByType } from 'jsx-ast-utils-x';

import rule from '../../src/rules/interactive-supports-focus';
import parserOptionsMapper from '../utils/parserOptionsMapper';
import parsers from '../utils/parsers';
import ruleOptionsMapperFactory from '../utils/ruleOptionsMapperFactory';
import { RuleTester } from '../utils/ruleTester';

const ruleTester = new RuleTester();

function template(strings: TemplateStringsArray, ...keys: number[]) {
  return (...values: string[]): string => {
    let result = strings[0] ?? '';
    for (const [index, key] of keys.entries()) {
      result += `${values[key] ?? ''}${strings[index + 1] ?? ''}`;
    }
    return result;
  };
}

const ruleName = 'interactive-supports-focus';
const codeTemplate = template`<${0} role="${1}" ${2}={() => void 0} />`;
const fixedTemplate = template`<${0} tabIndex={${1}} role="${2}" ${3}={() => void 0} />`;
const tabindexTemplate = template`<${0} role="${1}" ${2}={() => void 0} tabIndex="0" />`;
const tabbableTemplate = template`Elements with the '${0}' interactive role must be tabbable.`;
const focusableTemplate = template`Elements with the '${0}' interactive role must be focusable.`;

const componentsSettings = {
  'jsx-a11y': {
    components: {
      Div: 'div',
    },
  },
};

const buttonError = {
  message: tabbableTemplate('button'),
  suggestions: [
    {
      desc: 'Add `tabIndex={0}` to make the element focusable in sequential keyboard navigation.',
      output: '<Div tabIndex={0} onClick={() => void 0} role="button" />',
    },
  ],
};

const recommendedOptions = {
  tabbable: [
    'button',
    'checkbox',
    'link',
    'searchbox',
    'spinbutton',
    'switch',
    'textbox',
  ],
};

const strictOptions = {
  tabbable: [
    'button',
    'checkbox',
    'link',
    'progressbar',
    'searchbox',
    'slider',
    'spinbutton',
    'switch',
    'textbox',
  ],
};

const alwaysValid = [
  { code: '<div />' },
  { code: '<div aria-hidden onClick={() => void 0} />' },
  { code: '<div aria-hidden={true == true} onClick={() => void 0} />' },
  { code: '<div aria-hidden={true === true} onClick={() => void 0} />' },
  { code: '<div aria-hidden={hidden !== false} onClick={() => void 0} />' },
  { code: '<div aria-hidden={hidden != false} onClick={() => void 0} />' },
  { code: '<div aria-hidden={1 < 2} onClick={() => void 0} />' },
  { code: '<div aria-hidden={1 <= 2} onClick={() => void 0} />' },
  { code: '<div aria-hidden={2 > 1} onClick={() => void 0} />' },
  { code: '<div aria-hidden={2 >= 1} onClick={() => void 0} />' },
  { code: '<div onClick={() => void 0} />;' },
  { code: '<div onClick={() => void 0} tabIndex={undefined} />;' },
  { code: '<div onClick={() => void 0} tabIndex="bad" />;' },
  { code: '<div onClick={() => void 0} role={undefined} />;' },
  { code: '<div role="section" onClick={() => void 0} />' },
  { code: '<div onClick={() => void 0} aria-hidden={false} />;' },
  { code: '<div onClick={() => void 0} {...props} />;' },
  { code: '<input type="text" onClick={() => void 0} />' },
  { code: '<input type="hidden" onClick={() => void 0} tabIndex="-1" />' },
  { code: '<input type="hidden" onClick={() => void 0} tabIndex={-1} />' },
  { code: '<input onClick={() => void 0} />' },
  { code: '<input onClick={() => void 0} role="combobox" />' },
  { code: '<button onClick={() => void 0} className="foo" />' },
  { code: '<option onClick={() => void 0} className="foo" />' },
  { code: '<select onClick={() => void 0} className="foo" />' },
  { code: '<area href="#" onClick={() => void 0} className="foo" />' },
  { code: '<area onClick={() => void 0} className="foo" />' },
  { code: '<summary onClick={() => void 0} />' },
  { code: '<textarea onClick={() => void 0} className="foo" />' },
  { code: '<a onClick="showNextPage();">Next page</a>' },
  { code: '<a onClick="showNextPage();" tabIndex={undefined}>Next page</a>' },
  { code: '<a onClick="showNextPage();" tabIndex="bad">Next page</a>' },
  { code: '<a onClick={() => void 0} />' },
  { code: '<a tabIndex="0" onClick={() => void 0} />' },
  { code: '<a tabIndex={dynamicTabIndex} onClick={() => void 0} />' },
  { code: '<a tabIndex={0} onClick={() => void 0} />' },
  { code: '<a role="button" href="#" onClick={() => void 0} />' },
  { code: '<a onClick={() => void 0} href="https://x.y.z" />' },
  { code: '<a onClick={() => void 0} href="https://x.y.z" tabIndex="0" />' },
  { code: '<a onClick={() => void 0} href="https://x.y.z" tabIndex={0} />' },
  { code: '<a onClick={() => void 0} href="https://x.y.z" role="button" />' },
  { code: '<TestComponent onClick={doFoo} />' },
  { code: '<input onClick={() => void 0} type="hidden" />;' },
  { code: '<span onClick="submitForm();">Submit</span>' },
  { code: '<span onClick="submitForm();" tabIndex={undefined}>Submit</span>' },
  { code: '<span onClick="submitForm();" tabIndex="bad">Submit</span>' },
  { code: '<span onClick="doSomething();" tabIndex="0">Click me!</span>' },
  { code: '<span onClick="doSomething();" tabIndex={0}>Click me!</span>' },
  { code: '<span onClick="doSomething();" tabIndex="-1">Click me too!</span>' },
  {
    code: '<a href="javascript:void(0);" onClick="doSomething();">Click ALL the things!</a>',
  },
  { code: '<section onClick={() => void 0} />;' },
  { code: '<main onClick={() => void 0} />;' },
  { code: '<article onClick={() => void 0} />;' },
  { code: '<header onClick={() => void 0} />;' },
  { code: '<footer onClick={() => void 0} />;' },
  { code: '<div role="button" tabIndex="0" onClick={() => void 0} />' },
  { code: '<div role="checkbox" tabIndex="0" onClick={() => void 0} />' },
  { code: '<div role="link" tabIndex="0" onClick={() => void 0} />' },
  { code: '<div role="menuitem" tabIndex="0" onClick={() => void 0} />' },
  {
    code: '<div role="menuitemcheckbox" tabIndex="0" onClick={() => void 0} />',
  },
  { code: '<div role="menuitemradio" tabIndex="0" onClick={() => void 0} />' },
  { code: '<div role="option" tabIndex="0" onClick={() => void 0} />' },
  { code: '<div role="radio" tabIndex="0" onClick={() => void 0} />' },
  { code: '<div role="spinbutton" tabIndex="0" onClick={() => void 0} />' },
  { code: '<div role="switch" tabIndex="0" onClick={() => void 0} />' },
  { code: '<div role="tablist" tabIndex="0" onClick={() => void 0} />' },
  { code: '<div role="tab" tabIndex="0" onClick={() => void 0} />' },
  { code: '<div role="textbox" tabIndex="0" onClick={() => void 0} />' },
  {
    code: '<div role="textbox" aria-disabled="true" onClick={() => void 0} />',
  },
  { code: '<Foo.Bar onClick={() => void 0} aria-hidden={false} />;' },
  { code: '<Input onClick={() => void 0} type="hidden" />;' },
  {
    code: '<Div onClick={() => void 0} role="button" tabIndex="0" />',
    settings: componentsSettings,
  },
];

const neverValid = [
  {
    code: '<Div onClick={() => void 0} role="button" />',
    errors: [buttonError],
    settings: componentsSettings,
  },
];

const interactiveRoles = [
  'button',
  'checkbox',
  'link',
  'gridcell',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'radio',
  'searchbox',
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'textbox',
  'treeitem',
];

const recommendedRoles = [
  'button',
  'checkbox',
  'link',
  'searchbox',
  'spinbutton',
  'switch',
  'textbox',
];

const strictRoles = [
  'button',
  'checkbox',
  'link',
  'progressbar',
  'searchbox',
  'slider',
  'spinbutton',
  'switch',
  'textbox',
];

const staticElements = ['div'];

const triggeringHandlers: string[] = [
  ...eventHandlersByType.mouse,
  ...eventHandlersByType.keyboard,
];

// jsx-ast-utils-x lists `onError` twice (media + image); ESLint 10 rejects duplicate cases.
const uniqueEventHandlers: string[] = [...new Set(eventHandlers)];

function passReducer(
  roles: string[],
  handlers: string[],
  messageTemplate: (...values: string[]) => string,
): Array<{ code: string }> {
  const cases: Array<{ code: string }> = [];
  for (const element of staticElements) {
    for (const role of roles) {
      for (const handler of handlers) {
        cases.push({ code: messageTemplate(element, role, handler) });
      }
    }
  }
  return cases;
}

type FocusSuggestion = {
  desc: string;
  output: string;
};

type FailReducerCase = {
  code: string;
  errors: Array<{ message: string; suggestions: FocusSuggestion[] }>;
};

function failReducer(
  roles: string[],
  messageTemplate: (...values: string[]) => string,
): FailReducerCase[] {
  const cases: FailReducerCase[] = [];
  for (const element of staticElements) {
    for (const role of roles) {
      for (const handler of triggeringHandlers) {
        const suggestions: FocusSuggestion[] = [
          {
            desc: 'Add `tabIndex={0}` to make the element focusable in sequential keyboard navigation.',
            output: fixedTemplate(element, '0', role, handler),
          },
        ];
        if (messageTemplate === focusableTemplate) {
          suggestions.push({
            desc: 'Add `tabIndex={-1}` to make the element focusable but not reachable via sequential keyboard navigation.',
            output: fixedTemplate(element, '-1', role, handler),
          });
        }
        cases.push({
          code: codeTemplate(element, role, handler),
          errors: [
            {
              message: messageTemplate(role),
              suggestions,
            },
          ],
        });
      }
    }
  }
  return cases;
}

const nonTriggeringHandlers = uniqueEventHandlers.filter(
  handler => !triggeringHandlers.includes(handler),
);
const onlyTriggeringHandlers = uniqueEventHandlers.filter(handler =>
  triggeringHandlers.includes(handler),
);
const nonRecommendedRoles = interactiveRoles.filter(
  role => !recommendedRoles.includes(role),
);
const nonStrictRoles = interactiveRoles.filter(role => !strictRoles.includes(role));

ruleTester.run(`${ruleName}:recommended`, rule, {
  valid: parsers
    .all([
      ...alwaysValid,
      ...passReducer(interactiveRoles, nonTriggeringHandlers, codeTemplate),
      ...passReducer(nonRecommendedRoles, onlyTriggeringHandlers, tabindexTemplate),
    ])
    .map(ruleOptionsMapperFactory(recommendedOptions))
    .map((testCase) => parserOptionsMapper(testCase)),
  invalid: parsers
    .all([
      ...neverValid,
      ...failReducer(recommendedRoles, tabbableTemplate),
      ...failReducer(nonRecommendedRoles, focusableTemplate),
    ])
    .map(ruleOptionsMapperFactory(recommendedOptions))
    .map((testCase) => parserOptionsMapper(testCase)),
});

ruleTester.run(`${ruleName}:strict`, rule, {
  valid: parsers
    .all([
      ...alwaysValid,
      ...passReducer(interactiveRoles, nonTriggeringHandlers, codeTemplate),
      ...passReducer(nonStrictRoles, onlyTriggeringHandlers, tabindexTemplate),
    ])
    .map(ruleOptionsMapperFactory(strictOptions))
    .map((testCase) => parserOptionsMapper(testCase)),
  invalid: parsers
    .all([
      ...neverValid,
      ...failReducer(strictRoles, tabbableTemplate),
      ...failReducer(nonStrictRoles, focusableTemplate),
    ])
    .map(ruleOptionsMapperFactory(strictOptions))
    .map((testCase) => parserOptionsMapper(testCase)),
});
