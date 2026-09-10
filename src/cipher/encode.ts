import type { LogographInput } from '../logograph/types';

/** Values a single glyph can hold; each radical consumes five of them as bit flags. */
export const VALUE_COUNT = 32;

/** One token is either a run of digits or one renderable character. */
const TOKEN_PATTERN = /\d+|[A-Za-z,.!?:-]/g;

const PUNCTUATION_VALUES: Readonly<Record<string, number>> = {
  ',': 26,
  '.': 27,
  '!': 28,
  '?': 29,
  ':': 30,
  '-': 31,
};

const LETTER_A = 'A'.charCodeAt(0);

/**
 * Maps one token to a radical value: digits are reduced modulo 32, letters become 0-25,
 * and punctuation fills the remaining slots. This mapping is the cipher's public contract.
 */
export const tokenToValue = (token: string): number => {
  if (/^\d+$/.test(token)) return parseInt(token, 10) % VALUE_COUNT;

  const char = token.toUpperCase();
  if (char >= 'A' && char <= 'Z') return char.charCodeAt(0) - LETTER_A;

  return PUNCTUATION_VALUES[char] ?? 0;
};

export const textToValues = (text: string): number[] =>
  (text.match(TOKEN_PATTERN) ?? []).map(tokenToValue);

/** Groups values into glyph inputs of four, zero-padding the final run. */
export const valuesToGlyphs = (values: readonly number[]): LogographInput[] => {
  const glyphs: LogographInput[] = [];

  for (let i = 0; i < Math.max(values.length, 1); i += 4) {
    glyphs.push([values[i] ?? 0, values[i + 1] ?? 0, values[i + 2] ?? 0, values[i + 3] ?? 0]);
  }

  return glyphs;
};

export const textToGlyphs = (text: string): LogographInput[] => valuesToGlyphs(textToValues(text));
