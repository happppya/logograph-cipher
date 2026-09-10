import React from "react";
import { type LogographInput, generateLogograph } from "./Engine";

interface LogographRendererProps {
  input: LogographInput;
  className?: string;
  overrideColor?: string; // Optional: for unified export or monochrome theming
  ariaLabel?: string;     // Optional: for accessibility
}

export const LogographRenderer: React.FC<LogographRendererProps> = ({ 
  input, 
  className = "",
  overrideColor,
  ariaLabel = "Logographic cipher glyph"
}) => {
  
  // Generate the style-specific paths and visual properties
  const paths = generateLogograph(input);

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
      role="img"
      aria-label={ariaLabel}
      style={{
        fill: "none",
        // If overrideColor is present, apply it; otherwise rely on Tailwind text-* classes
        stroke: overrideColor || "currentColor",
        color: overrideColor || undefined, // Ensures fill="currentColor" inherits the override
        strokeWidth: 2, // Reduced from 4 to 2 as a much safer fallback
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
    >
      {paths.map((p, index) => (
        <path 
          key={index} 
          d={p.d} 
          className={overrideColor ? "" : p.className}
          // Explicitly map the new engine properties with safe fallbacks
          strokeWidth={p.strokeWidth}
          strokeDasharray={p.strokeDasharray}
          fill={p.fill || "none"}
          opacity={p.opacity}
        />
      ))}
    </svg>
  );
};