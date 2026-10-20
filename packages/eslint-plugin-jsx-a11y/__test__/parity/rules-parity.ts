/**
 * Representative rule samples with expected outcomes from eslint-plugin-jsx-a11y-x@0.2.0.
 * Regenerated during dependency-replacement; oracle deps must not remain in package.json.
 */

export type RuleParityCase = {
  /** Rule name without plugin prefix. */
  rule: string;
  /** JSX snippet under test. */
  code: string;
  /** Whether the upstream plugin reports an error. */
  expectError: boolean;
  /** Upstream report messages (text). */
  messages: string[];
};

/**
 * Expected rule outcomes from the upstream plugin oracle.
 */
export const rulesParityCases: RuleParityCase[] = [
  {
    "rule": "alt-text",
    "code": "<img />",
    "expectError": true,
    "messages": [
      "img elements must have an alt prop, either with meaningful text, or an empty string for decorative images."
    ]
  },
  {
    "rule": "alt-text",
    "code": "<img alt=\"cat\" />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "anchor-has-content",
    "code": "<a href=\"/\"></a>",
    "expectError": true,
    "messages": [
      "Anchors must have content and the content must be accessible by a screen reader."
    ]
  },
  {
    "rule": "anchor-has-content",
    "code": "<a href=\"/\">Go</a>",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "anchor-is-valid",
    "code": "<a onClick={() => {}} />",
    "expectError": true,
    "messages": [
      "Anchor used as a button. Anchors are primarily expected to navigate. Use the button element instead. Learn more: https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/blob/HEAD/docs/rules/anchor-is-valid.md"
    ]
  },
  {
    "rule": "anchor-is-valid",
    "code": "<a href=\"/\" />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "anchor-ambiguous-text",
    "code": "<a href=\"/\">click here</a>",
    "expectError": true,
    "messages": [
      "Ambiguous text within anchor. Screen reader users rely on link text for context; the words \"click here\", \"here\", \"link\", \"a link\", \"learn more\" are ambiguous and do not provide enough context."
    ]
  },
  {
    "rule": "anchor-ambiguous-text",
    "code": "<a href=\"/\">Read docs</a>",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "aria-activedescendant-has-tabindex",
    "code": "<div aria-activedescendant=\"id\" />",
    "expectError": true,
    "messages": [
      "An element that manages focus with `aria-activedescendant` must have a tabindex"
    ]
  },
  {
    "rule": "aria-activedescendant-has-tabindex",
    "code": "<div aria-activedescendant=\"id\" tabIndex={0} />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "aria-props",
    "code": "<div aria-labeledby=\"x\" />",
    "expectError": true,
    "messages": [
      "aria-labeledby: This attribute is an invalid ARIA attribute. Did you mean to use aria-labelledby?"
    ]
  },
  {
    "rule": "aria-props",
    "code": "<div aria-labelledby=\"x\" />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "aria-proptypes",
    "code": "<div aria-hidden=\"yes\" />",
    "expectError": true,
    "messages": [
      "The value for aria-hidden must be a boolean."
    ]
  },
  {
    "rule": "aria-proptypes",
    "code": "<div aria-hidden=\"true\" />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "aria-role",
    "code": "<div role=\"datepicker\" />",
    "expectError": true,
    "messages": [
      "Elements with ARIA roles must use a valid, non-abstract ARIA role."
    ]
  },
  {
    "rule": "aria-role",
    "code": "<div role=\"button\" />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "aria-unsupported-elements",
    "code": "<meta aria-hidden=\"true\" />",
    "expectError": true,
    "messages": [
      "This element does not support ARIA roles, states and properties. Try removing the prop 'aria-hidden'."
    ]
  },
  {
    "rule": "aria-unsupported-elements",
    "code": "<div aria-hidden=\"true\" />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "autocomplete-valid",
    "code": "<input autocomplete=\"foo\" />",
    "expectError": true,
    "messages": [
      "the autocomplete attribute is incorrectly formatted"
    ]
  },
  {
    "rule": "autocomplete-valid",
    "code": "<input autocomplete=\"name\" />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "click-events-have-key-events",
    "code": "<div onClick={() => {}} />",
    "expectError": true,
    "messages": [
      "Visible, non-interactive elements with click handlers must have at least one keyboard listener."
    ]
  },
  {
    "rule": "click-events-have-key-events",
    "code": "<div onClick={() => {}} onKeyDown={() => {}} />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "control-has-associated-label",
    "code": "<input type=\"text\" />",
    "expectError": true,
    "messages": [
      "A control must be associated with a text label."
    ]
  },
  {
    "rule": "control-has-associated-label",
    "code": "<input type=\"text\" aria-label=\"Name\" />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "heading-has-content",
    "code": "<h1></h1>",
    "expectError": true,
    "messages": [
      "Headings must have content and the content must be accessible by a screen reader."
    ]
  },
  {
    "rule": "heading-has-content",
    "code": "<h1>Title</h1>",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "html-has-lang",
    "code": "<html></html>",
    "expectError": true,
    "messages": [
      "<html> elements must have the lang prop."
    ]
  },
  {
    "rule": "html-has-lang",
    "code": "<html lang=\"en\"></html>",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "iframe-has-title",
    "code": "<iframe />",
    "expectError": true,
    "messages": [
      "<iframe> elements must have a unique title property."
    ]
  },
  {
    "rule": "iframe-has-title",
    "code": "<iframe title=\"map\" />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "img-redundant-alt",
    "code": "<img alt=\"image of a cat\" />",
    "expectError": true,
    "messages": [
      "Redundant alt attribute. Screen-readers already announce `img` tags as an image. You don’t need to use the words `image`, `photo,` or `picture` (or any specified custom words) in the alt prop."
    ]
  },
  {
    "rule": "img-redundant-alt",
    "code": "<img alt=\"a cat\" />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "interactive-supports-focus",
    "code": "<div role=\"button\" onClick={() => {}} />",
    "expectError": true,
    "messages": [
      "Elements with the 'button' interactive role must be focusable."
    ]
  },
  {
    "rule": "interactive-supports-focus",
    "code": "<div role=\"button\" tabIndex={0} onClick={() => {}} />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "label-has-associated-control",
    "code": "<label>Name</label>",
    "expectError": true,
    "messages": [
      "A form label must either have a valid htmlFor attribute or a control as a descendant."
    ]
  },
  {
    "rule": "label-has-associated-control",
    "code": "<label>Name<input /></label>",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "lang",
    "code": "<html lang=\"zz\" />",
    "expectError": true,
    "messages": [
      "lang attribute must have a valid value."
    ]
  },
  {
    "rule": "lang",
    "code": "<html lang=\"en\" />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "media-has-caption",
    "code": "<video></video>",
    "expectError": true,
    "messages": [
      "Media elements such as <audio> and <video> must have a <track> for captions."
    ]
  },
  {
    "rule": "media-has-caption",
    "code": "<video><track kind=\"captions\" /></video>",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "mouse-events-have-key-events",
    "code": "<div onMouseOver={() => {}} />",
    "expectError": true,
    "messages": [
      "onMouseOver must be accompanied by onFocus for accessibility."
    ]
  },
  {
    "rule": "mouse-events-have-key-events",
    "code": "<div onMouseOver={() => {}} onFocus={() => {}} />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "no-access-key",
    "code": "<div accessKey=\"h\" />",
    "expectError": true,
    "messages": [
      "No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard commands used by screen readers and keyboard-only users create a11y complications."
    ]
  },
  {
    "rule": "no-access-key",
    "code": "<div />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "no-aria-hidden-on-focusable",
    "code": "<button aria-hidden=\"true\" />",
    "expectError": true,
    "messages": [
      "aria-hidden=\"true\" must not be set on focusable elements."
    ]
  },
  {
    "rule": "no-aria-hidden-on-focusable",
    "code": "<div aria-hidden=\"true\" />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "no-autofocus",
    "code": "<input autoFocus />",
    "expectError": true,
    "messages": [
      "The autoFocus prop should not be enabled, as it can reduce usability and accessibility for users."
    ]
  },
  {
    "rule": "no-autofocus",
    "code": "<input />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "no-distracting-elements",
    "code": "<marquee />",
    "expectError": true,
    "messages": [
      "Do not use <marquee> elements as they can create visual accessibility issues and are deprecated."
    ]
  },
  {
    "rule": "no-distracting-elements",
    "code": "<div />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "no-interactive-element-to-noninteractive-role",
    "code": "<button role=\"presentation\" />",
    "expectError": true,
    "messages": [
      "Interactive elements should not be assigned non-interactive roles."
    ]
  },
  {
    "rule": "no-interactive-element-to-noninteractive-role",
    "code": "<button />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "no-noninteractive-element-interactions",
    "code": "<h1 onClick={() => {}} />",
    "expectError": true,
    "messages": [
      "Non-interactive elements should not be assigned mouse or keyboard event listeners."
    ]
  },
  {
    "rule": "no-noninteractive-element-interactions",
    "code": "<h1 />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "no-noninteractive-element-to-interactive-role",
    "code": "<h1 role=\"button\" />",
    "expectError": true,
    "messages": [
      "Non-interactive elements should not be assigned interactive roles."
    ]
  },
  {
    "rule": "no-noninteractive-element-to-interactive-role",
    "code": "<h1 />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "no-noninteractive-tabindex",
    "code": "<h1 tabIndex={0} />",
    "expectError": true,
    "messages": [
      "`tabIndex` should only be declared on interactive elements."
    ]
  },
  {
    "rule": "no-noninteractive-tabindex",
    "code": "<button tabIndex={0} />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "no-redundant-roles",
    "code": "<button role=\"button\" />",
    "expectError": true,
    "messages": [
      "The element button has an implicit role of button. Defining this explicitly is redundant and should be avoided."
    ]
  },
  {
    "rule": "no-redundant-roles",
    "code": "<div role=\"button\" />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "no-static-element-interactions",
    "code": "<div onClick={() => {}} />",
    "expectError": true,
    "messages": [
      "Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element."
    ]
  },
  {
    "rule": "no-static-element-interactions",
    "code": "<button onClick={() => {}} />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "prefer-tag-over-role",
    "code": "<div role=\"button\" />",
    "expectError": true,
    "messages": [
      "Use <input type=\"button\">, <input type=\"image\">, <input type=\"reset\">, <input type=\"submit\">, or <button> instead of the \"button\" role to ensure accessibility across all devices."
    ]
  },
  {
    "rule": "prefer-tag-over-role",
    "code": "<button />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "role-has-required-aria-props",
    "code": "<span role=\"checkbox\" />",
    "expectError": true,
    "messages": [
      "Elements with the ARIA role \"checkbox\" must have the following attributes defined: aria-checked"
    ]
  },
  {
    "rule": "role-has-required-aria-props",
    "code": "<span role=\"checkbox\" aria-checked=\"true\" />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "role-supports-aria-props",
    "code": "<div role=\"img\" aria-checked=\"true\" />",
    "expectError": true,
    "messages": [
      "The attribute aria-checked is not supported by the role img."
    ]
  },
  {
    "rule": "role-supports-aria-props",
    "code": "<div role=\"checkbox\" aria-checked=\"true\" />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "scope",
    "code": "<div scope=\"col\" />",
    "expectError": true,
    "messages": [
      "The scope prop can only be used on <th> elements."
    ]
  },
  {
    "rule": "scope",
    "code": "<th scope=\"col\" />",
    "expectError": false,
    "messages": []
  },
  {
    "rule": "tabindex-no-positive",
    "code": "<div tabIndex={1} />",
    "expectError": true,
    "messages": [
      "Avoid positive integer values for tabIndex."
    ]
  },
  {
    "rule": "tabindex-no-positive",
    "code": "<div tabIndex={0} />",
    "expectError": false,
    "messages": []
  }
];
