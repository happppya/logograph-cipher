import type { FC } from 'react';
import { generateLogograph } from './Engine';
import { resolvePath } from './pathAttributes';
import type { LogographInput } from './types';

interface LogographRendererProps {
  input: LogographInput;
  className?: string;
  /** Forces one stroke/fill color and drops the per-style Tailwind classes. */
  overrideColor?: string;
  ariaLabel?: string;
}

export const LogographRenderer: FC<LogographRendererProps> = ({
  input,
  className = '',
  overrideColor,
  ariaLabel = 'Logographic cipher glyph',
}) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full ${className}`}
    role="img"
    aria-label={ariaLabel}
    style={{
      fill: 'none',
      stroke: overrideColor ?? 'currentColor',
      color: overrideColor,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }}
  >
    {generateLogograph(input).map((path, index) => {
      const { d, fill, strokeWidth, strokeDasharray, opacity } = resolvePath(path);

      return (
        <path
          key={index}
          d={d}
          className={overrideColor ? '' : path.className}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          fill={fill}
          opacity={opacity}
        />
      );
    })}
  </svg>
);
