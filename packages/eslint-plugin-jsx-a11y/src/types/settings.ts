/**
 * Plugin settings under `settings['jsx-a11y']`.
 */
export type JsxA11ySettings = {
  /** Maps custom component names to DOM element names. */
  components?: Record<string, string>;
  /** Prop name used for polymorphic element resolution. */
  polymorphicPropName?: string;
  /** Component names allowed to use the polymorphic prop. */
  polymorphicAllowList?: string[];
};
