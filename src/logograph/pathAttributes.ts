import type { RenderPath } from './types';

/** Used when a radical does not specify its own stroke weight. */
export const DEFAULT_STROKE_WIDTH = 2;

export interface ResolvedPath {
  d: string;
  fill: string;
  strokeWidth: number;
  strokeDasharray?: string;
  opacity?: number;
}

/**
 * Applies engine defaults once, so the on-screen renderer and the SVG exporter
 * cannot disagree about how a path looks.
 */
export const resolvePath = (path: RenderPath): ResolvedPath => ({
  d: path.d,
  fill: path.fill ?? 'none',
  strokeWidth: path.strokeWidth ?? DEFAULT_STROKE_WIDTH,
  strokeDasharray: path.strokeDasharray,
  opacity: path.opacity,
});
