import type { ESLint, Linter, Rule } from 'eslint';

import flatConfigBase from './configs/flat-config-base';
import altText from './rules/alt-text';
import anchorAmbiguousText from './rules/anchor-ambiguous-text';
import anchorHasContent from './rules/anchor-has-content';
import anchorIsValid from './rules/anchor-is-valid';
import ariaActivedescendantHasTabindex from './rules/aria-activedescendant-has-tabindex';
import ariaProps from './rules/aria-props';
import ariaProptypes from './rules/aria-proptypes';
import ariaRole from './rules/aria-role';
import ariaUnsupportedElements from './rules/aria-unsupported-elements';
import autocompleteValid from './rules/autocomplete-valid';
import clickEventsHaveKeyEvents from './rules/click-events-have-key-events';
import controlHasAssociatedLabel from './rules/control-has-associated-label';
import headingHasContent from './rules/heading-has-content';
import htmlHasLang from './rules/html-has-lang';
import iframeHasTitle from './rules/iframe-has-title';
import imgRedundantAlt from './rules/img-redundant-alt';
import interactiveSupportsFocus from './rules/interactive-supports-focus';
import labelHasAssociatedControl from './rules/label-has-associated-control';
import lang from './rules/lang';
import mediaHasCaption from './rules/media-has-caption';
import mouseEventsHaveKeyEvents from './rules/mouse-events-have-key-events';
import noAccessKey from './rules/no-access-key';
import noAriaHiddenOnFocusable from './rules/no-aria-hidden-on-focusable';
import noAutofocus from './rules/no-autofocus';
import noDistractingElements from './rules/no-distracting-elements';
import noInteractiveElementToNoninteractiveRole from './rules/no-interactive-element-to-noninteractive-role';
import noNoninteractiveElementInteractions from './rules/no-noninteractive-element-interactions';
import noNoninteractiveElementToInteractiveRole from './rules/no-noninteractive-element-to-interactive-role';
import noNoninteractiveTabindex from './rules/no-noninteractive-tabindex';
import noRedundantRoles from './rules/no-redundant-roles';
import noStaticElementInteractions from './rules/no-static-element-interactions';
import preferTagOverRole from './rules/prefer-tag-over-role';
import roleHasRequiredAriaProps from './rules/role-has-required-aria-props';
import roleSupportsAriaProps from './rules/role-supports-aria-props';
import scope from './rules/scope';
import tabindexNoPositive from './rules/tabindex-no-positive';

/**
 * Rule names exported by this plugin.
 */
export type RuleName =
  | 'alt-text'
  | 'anchor-ambiguous-text'
  | 'anchor-has-content'
  | 'anchor-is-valid'
  | 'aria-activedescendant-has-tabindex'
  | 'aria-props'
  | 'aria-proptypes'
  | 'aria-role'
  | 'aria-unsupported-elements'
  | 'autocomplete-valid'
  | 'click-events-have-key-events'
  | 'control-has-associated-label'
  | 'heading-has-content'
  | 'html-has-lang'
  | 'iframe-has-title'
  | 'img-redundant-alt'
  | 'interactive-supports-focus'
  | 'label-has-associated-control'
  | 'lang'
  | 'media-has-caption'
  | 'mouse-events-have-key-events'
  | 'no-access-key'
  | 'no-aria-hidden-on-focusable'
  | 'no-autofocus'
  | 'no-distracting-elements'
  | 'no-interactive-element-to-noninteractive-role'
  | 'no-noninteractive-element-interactions'
  | 'no-noninteractive-element-to-interactive-role'
  | 'no-noninteractive-tabindex'
  | 'no-redundant-roles'
  | 'no-static-element-interactions'
  | 'prefer-tag-over-role'
  | 'role-has-required-aria-props'
  | 'role-supports-aria-props'
  | 'scope'
  | 'tabindex-no-positive';

const meta = {
  name: '@omnific/eslint-plugin-jsx-a11y',
  version: '0.2.1',
} as const;

/**
 * Rule table exported by the plugin.
 */
export const rules: Record<RuleName, Rule.RuleModule> = Object.freeze({
  'alt-text': altText,
  'anchor-ambiguous-text': anchorAmbiguousText,
  'anchor-has-content': anchorHasContent,
  'anchor-is-valid': anchorIsValid,
  'aria-activedescendant-has-tabindex': ariaActivedescendantHasTabindex,
  'aria-props': ariaProps,
  'aria-proptypes': ariaProptypes,
  'aria-role': ariaRole,
  'aria-unsupported-elements': ariaUnsupportedElements,
  'autocomplete-valid': autocompleteValid,
  'click-events-have-key-events': clickEventsHaveKeyEvents,
  'control-has-associated-label': controlHasAssociatedLabel,
  'heading-has-content': headingHasContent,
  'html-has-lang': htmlHasLang,
  'iframe-has-title': iframeHasTitle,
  'img-redundant-alt': imgRedundantAlt,
  'interactive-supports-focus': interactiveSupportsFocus,
  'label-has-associated-control': labelHasAssociatedControl,
  lang,
  'media-has-caption': mediaHasCaption,
  'mouse-events-have-key-events': mouseEventsHaveKeyEvents,
  'no-access-key': noAccessKey,
  'no-aria-hidden-on-focusable': noAriaHiddenOnFocusable,
  'no-autofocus': noAutofocus,
  'no-distracting-elements': noDistractingElements,
  'no-interactive-element-to-noninteractive-role': noInteractiveElementToNoninteractiveRole,
  'no-noninteractive-element-interactions': noNoninteractiveElementInteractions,
  'no-noninteractive-element-to-interactive-role': noNoninteractiveElementToInteractiveRole,
  'no-noninteractive-tabindex': noNoninteractiveTabindex,
  'no-redundant-roles': noRedundantRoles,
  'no-static-element-interactions': noStaticElementInteractions,
  'prefer-tag-over-role': preferTagOverRole,
  'role-has-required-aria-props': roleHasRequiredAriaProps,
  'role-supports-aria-props': roleSupportsAriaProps,
  scope,
  'tabindex-no-positive': tabindexNoPositive,
});

const recommendedRules: Linter.RulesRecord = {
  'jsx-a11y/alt-text': 'error',
  'jsx-a11y/anchor-ambiguous-text': 'off',
  'jsx-a11y/anchor-has-content': 'error',
  'jsx-a11y/anchor-is-valid': 'error',
  'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
  'jsx-a11y/aria-props': 'error',
  'jsx-a11y/aria-proptypes': 'error',
  'jsx-a11y/aria-role': 'error',
  'jsx-a11y/aria-unsupported-elements': 'error',
  'jsx-a11y/autocomplete-valid': 'error',
  'jsx-a11y/click-events-have-key-events': 'error',
  'jsx-a11y/control-has-associated-label': [
    'off',
    {
      ignoreElements: ['audio', 'canvas', 'embed', 'input', 'textarea', 'tr', 'video'],
      ignoreRoles: [
        'grid',
        'listbox',
        'menu',
        'menubar',
        'radiogroup',
        'row',
        'tablist',
        'toolbar',
        'tree',
        'treegrid',
      ],
    },
  ],
  'jsx-a11y/heading-has-content': 'error',
  'jsx-a11y/html-has-lang': 'error',
  'jsx-a11y/iframe-has-title': 'error',
  'jsx-a11y/img-redundant-alt': 'error',
  'jsx-a11y/interactive-supports-focus': [
    'error',
    {
      tabbable: ['button', 'checkbox', 'link', 'searchbox', 'spinbutton', 'switch', 'textbox'],
    },
  ],
  'jsx-a11y/label-has-associated-control': 'error',
  'jsx-a11y/media-has-caption': 'error',
  'jsx-a11y/mouse-events-have-key-events': 'error',
  'jsx-a11y/no-access-key': 'error',
  'jsx-a11y/no-autofocus': 'error',
  'jsx-a11y/no-distracting-elements': 'error',
  'jsx-a11y/no-interactive-element-to-noninteractive-role': [
    'error',
    {
      tr: ['none', 'presentation'],
      canvas: ['img'],
    },
  ],
  'jsx-a11y/no-noninteractive-element-interactions': [
    'error',
    {
      handlers: [
        'onClick',
        'onError',
        'onLoad',
        'onMouseDown',
        'onMouseUp',
        'onKeyPress',
        'onKeyDown',
        'onKeyUp',
      ],
      alert: ['onKeyUp', 'onKeyDown', 'onKeyPress'],
      body: ['onError', 'onLoad'],
      dialog: ['onKeyUp', 'onKeyDown', 'onKeyPress'],
      iframe: ['onError', 'onLoad'],
      img: ['onError', 'onLoad'],
    },
  ],
  'jsx-a11y/no-noninteractive-element-to-interactive-role': [
    'error',
    {
      ul: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
      ol: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
      li: ['menuitem', 'menuitemradio', 'menuitemcheckbox', 'option', 'row', 'tab', 'treeitem'],
      table: ['grid'],
      td: ['gridcell'],
      fieldset: ['radiogroup', 'presentation'],
    },
  ],
  'jsx-a11y/no-noninteractive-tabindex': [
    'error',
    {
      tags: [],
      roles: ['tabpanel'],
      allowExpressionValues: true,
    },
  ],
  'jsx-a11y/no-redundant-roles': 'error',
  'jsx-a11y/no-static-element-interactions': [
    'error',
    {
      allowExpressionValues: true,
      handlers: ['onClick', 'onMouseDown', 'onMouseUp', 'onKeyPress', 'onKeyDown', 'onKeyUp'],
    },
  ],
  'jsx-a11y/role-has-required-aria-props': 'error',
  'jsx-a11y/role-supports-aria-props': 'error',
  'jsx-a11y/scope': 'error',
  'jsx-a11y/tabindex-no-positive': 'error',
};

const strictRules: Linter.RulesRecord = {
  'jsx-a11y/alt-text': 'error',
  'jsx-a11y/anchor-has-content': 'error',
  'jsx-a11y/anchor-is-valid': 'error',
  'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
  'jsx-a11y/aria-props': 'error',
  'jsx-a11y/aria-proptypes': 'error',
  'jsx-a11y/aria-role': 'error',
  'jsx-a11y/aria-unsupported-elements': 'error',
  'jsx-a11y/autocomplete-valid': 'error',
  'jsx-a11y/click-events-have-key-events': 'error',
  'jsx-a11y/control-has-associated-label': [
    'off',
    {
      ignoreElements: ['audio', 'canvas', 'embed', 'input', 'textarea', 'tr', 'video'],
      ignoreRoles: [
        'grid',
        'listbox',
        'menu',
        'menubar',
        'radiogroup',
        'row',
        'tablist',
        'toolbar',
        'tree',
        'treegrid',
      ],
    },
  ],
  'jsx-a11y/heading-has-content': 'error',
  'jsx-a11y/html-has-lang': 'error',
  'jsx-a11y/iframe-has-title': 'error',
  'jsx-a11y/img-redundant-alt': 'error',
  'jsx-a11y/interactive-supports-focus': [
    'error',
    {
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
    },
  ],
  'jsx-a11y/label-has-associated-control': 'error',
  'jsx-a11y/media-has-caption': 'error',
  'jsx-a11y/mouse-events-have-key-events': 'error',
  'jsx-a11y/no-access-key': 'error',
  'jsx-a11y/no-autofocus': 'error',
  'jsx-a11y/no-distracting-elements': 'error',
  'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
  'jsx-a11y/no-noninteractive-element-interactions': [
    'error',
    {
      body: ['onError', 'onLoad'],
      iframe: ['onError', 'onLoad'],
      img: ['onError', 'onLoad'],
    },
  ],
  'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
  'jsx-a11y/no-noninteractive-tabindex': 'error',
  'jsx-a11y/no-redundant-roles': 'error',
  'jsx-a11y/no-static-element-interactions': 'error',
  'jsx-a11y/role-has-required-aria-props': 'error',
  'jsx-a11y/role-supports-aria-props': 'error',
  'jsx-a11y/scope': 'error',
  'jsx-a11y/tabindex-no-positive': 'error',
};

/**
 * Builds the frozen plugin object with self-referential flat configs.
 * @returns Immutable plugin instance.
 */
const createPlugin = (): ESLint.Plugin => {
  const configs: Record<string, Linter.Config> = {};
  const plugin: ESLint.Plugin = {
    meta,
    rules,
    configs,
  };

  configs.recommended = Object.freeze({
    ...flatConfigBase,
    name: 'jsx-a11y/recommended',
    plugins: {
      'jsx-a11y': plugin,
    },
    rules: recommendedRules,
  });

  configs.strict = Object.freeze({
    ...flatConfigBase,
    name: 'jsx-a11y/strict',
    plugins: {
      'jsx-a11y': plugin,
    },
    rules: strictRules,
  });

  Object.freeze(configs);
  return Object.freeze(plugin);
};

/**
 * JSX accessibility ESLint plugin.
 */
const jsxA11y: ESLint.Plugin = createPlugin();

/**
 * Flat configs exposed by the plugin (`recommended`, `strict`).
 */
export const configs: ESLint.Plugin['configs'] = jsxA11y.configs;

export default jsxA11y;

export type { JsxA11ySettings } from './types/settings';
