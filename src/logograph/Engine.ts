import { ABYSSAL_STYLE } from './styles/abyssal';
import { CELESTIAL_STYLE } from './styles/celestial';
import { EMPEROR_STYLE } from './styles/emperor';
import { PRISMATIC_STYLE } from './styles/prismatic';
import type { GlyphStyle, LogographInput, RenderPath } from './types';

export type { GlyphStyle, LogographInput, RadicalLabels, RenderPath } from './types';

/**
 * Indexed by dominant radical: the *position* of the largest input value selects the style,
 * so the order here is part of the cipher's visual contract.
 */
export const GLYPH_STYLES: readonly GlyphStyle[] = [
  EMPEROR_STYLE,
  CELESTIAL_STYLE,
  PRISMATIC_STYLE,
  ABYSSAL_STYLE,
];

/** Index of the largest value; ties resolve to the lowest index. */
export const selectStyleIndex = (input: LogographInput): number => input.indexOf(Math.max(...input));

export const selectStyle = (input: LogographInput): GlyphStyle =>
  GLYPH_STYLES[selectStyleIndex(input)] ?? ABYSSAL_STYLE;

export const generateLogograph = (input: LogographInput): RenderPath[] => selectStyle(input).build(input);
