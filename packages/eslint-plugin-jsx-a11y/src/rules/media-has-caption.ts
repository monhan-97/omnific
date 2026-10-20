/**
 * @file <audio> and <video> elements must have a <track> for captions.
 * @author Ethan Cohen
 */

import { isArray, isNil, isString } from '@omnific/utils';
import type { Rule } from 'eslint';
import type { JSXElement, JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import { getLiteralPropValue, getProp } from '../util/jsxAst';

const MEDIA_TYPES = ['audio', 'video'] as const;

const schema = {
  type: 'object',
  properties: {
    audio: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    video: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    track: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
  },
  additionalProperties: false,
} as const;

type MediaHasCaptionOptions = {
  audio: string[];
  video: string[];
  track: string[];
};

const DEFAULT_OPTIONS: MediaHasCaptionOptions = {
  audio: [],
  video: [],
  track: [],
};

/**
 * Resolves effective media-has-caption options with defaults.
 * @param context - ESLint rule context.
 * @returns Normalized options.
 */
function getOptions(context: Rule.RuleContext): MediaHasCaptionOptions {
  const raw = context.options[0] as Partial<MediaHasCaptionOptions> | undefined;
  if (isNil(raw)) {
    return DEFAULT_OPTIONS;
  }
  return {
    audio: isArray(raw.audio) ? raw.audio.filter(isString) : [],
    video: isArray(raw.video) ? raw.video.filter(isString) : [],
    track: isArray(raw.track) ? raw.track.filter(isString) : [],
  };
}

/**
 * ESLint rule: require caption tracks on media elements.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforces that `<audio>` and `<video>` elements must have a `<track>` for captions.',
      url: 'https://github.com/monhan-97/omnific/blob/HEAD/packages/eslint-plugin-jsx-a11y/docs/rules/media-has-caption.md',
    },
    schema: [schema],
    defaultOptions: [DEFAULT_OPTIONS],
    messages: {
      missingCaption:
        'Media elements such as <audio> and <video> must have a <track> for captions.',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    const options = getOptions(context);

    const isMediaType = (type: string): boolean => {
      const mediaTypes: string[] = [
        ...MEDIA_TYPES,
        ...MEDIA_TYPES.flatMap(mediaType => options[mediaType]),
      ];
      return mediaTypes.includes(type);
    };

    const isTrackType = (type: string): boolean => {
      const trackTypes: string[] = ['track', ...options.track];
      return trackTypes.includes(type);
    };

    return {
      JSXElement(node) {
        const element = node as JSXElement;
        const opening = element.openingElement;
        const type = elementType(opening);
        if (!isMediaType(type)) {
          return;
        }
        const mutedProp = getProp(opening.attributes, 'muted');
        const mutedPropVal = getLiteralPropValue(mutedProp);
        if (mutedPropVal === true) {
          return;
        }

        const trackChildren = element.children.filter(child => {
          return child.type === 'JSXElement' && isTrackType(elementType(child.openingElement as JSXOpeningElement));
        }) as JSXElement[];

        if (trackChildren.length === 0) {
          context.report({
            node: opening,
            messageId: 'missingCaption',
          });
          return;
        }

        const hasCaption = trackChildren.some(track => {
          const kindProp = getProp(track.openingElement.attributes, 'kind');
          const kindPropValue = getLiteralPropValue(kindProp) ?? '';
          return String(kindPropValue).toLowerCase() === 'captions';
        });

        if (!hasCaption) {
          context.report({
            node: opening,
            messageId: 'missingCaption',
          });
        }
      },
    };
  },
};

export default rule;
