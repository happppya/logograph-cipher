/** Four values in 0-31, one per radical. Each value is a five-flag bitmask (1, 2, 4, 8, 16). */
export type LogographInput = [number, number, number, number];

/** One radical's drawing, in the glyph's 0-100 coordinate space. */
export interface RenderPath {
  d: string;
  /** Tailwind `text-*` utility the stroke inherits from, unless the caller overrides the color. */
  className: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  /** `"currentColor"` turns enclosed shapes into solid nodes. */
  fill?: string;
  /** Layered depth is expressed here rather than by overlapping coordinates. */
  opacity?: number;
}

/** Slider labels for radicals 0-3, in input order. */
export type RadicalLabels = readonly [string, string, string, string];

/** A visual family: how it is labelled in the UI and how its geometry is built. */
export interface GlyphStyle {
  /** Display name, e.g. `"Emperor"`. */
  name: string;
  radicals: RadicalLabels;
  /** Always returns exactly four paths, one per radical, in a stable order. */
  build: (input: LogographInput) => RenderPath[];
}
