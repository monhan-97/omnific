/**
 * @fileoverview Returns an array of suggestions given a word and a dictionary.
 */

import editDistance from 'damerau-levenshtein';

/**
Minimum edit distance to be considered a good suggestion.
*/
const THRESHOLD = 2;

/**
 * Ranked suggestion candidate.
 */
type SuggestionCandidate = {
  /**
  Dictionary word.
  */
  word: string;
  /**
  Edit distance from the query word.
  */
  steps: number;
};

/**
 * Returns an array of suggestions given a word, dictionary, and result limit.
 * @param word - Misspelled or unknown token.
 * @param dictionary - Candidate strings.
 * @param limit - Maximum suggestions to return.
 * @returns Closest dictionary words within the edit-distance threshold.
 */
export default function getSuggestion(
  word: string,
  dictionary: readonly string[] = [],
  limit = 2,
): string[] {
  const distances: SuggestionCandidate[] = [];
  for (const dictionaryWord of dictionary) {
    const { steps } = editDistance(word.toUpperCase(), dictionaryWord.toUpperCase());
    if (steps <= THRESHOLD) {
      distances.push({ word: dictionaryWord, steps });
    }
  }

  return distances
    .sort((a, b) => a.steps - b.steps)
    .slice(0, limit)
    .map(distance => distance.word);
}
