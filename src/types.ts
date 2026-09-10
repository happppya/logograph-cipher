/** The app's two working modes: one glyph at a time, or a whole encoded sequence. */
export type Mode = 'builder' | 'sequence';

/** Preview/export grid dimensions, in glyph cells. */
export interface GridSize {
  columns: number;
  rows: number;
}

/** Sequence colors: `ink` draws the glyphs, `paper` fills the background. */
export interface Palette {
  ink: string;
  paper: string;
}
