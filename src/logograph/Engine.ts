export type LogographInput = [number, number, number, number];

export interface RenderPath {
  d: string;
  className: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  fill?: string;
  opacity?: number;
}

// ============================================================================
// STYLE 0: "EMPEROR" (Bento-Box Grid System)
// Structural rules: Strict horizontal/vertical containment. No zone bleeding.
// ============================================================================
const generateEmperorStyle = (input: LogographInput): RenderPath[] => {
  const [frameVal, crownVal, heartVal, rootsVal] = input;
  const paths: RenderPath[] = [];

  // 1. Outer Enclosure (Perimeter Zone: X:15-85, Y:15-85)
  let framePath = "";
  if (frameVal & 1) framePath += "M 15 15 L 15 85 "; // Left Wall
  if (frameVal & 2) framePath += "M 85 15 L 85 85 "; // Right Wall
  if (frameVal & 4) framePath += "M 15 15 L 85 15 "; // Ceiling
  if (frameVal & 8) framePath += "M 15 85 L 85 85 "; // Floor
  if (frameVal & 16) framePath += "M 18 20 L 18 80 M 82 20 L 82 80 "; // Inner structural pillars
  if (frameVal === 0) framePath += "M 25 15 L 75 15 M 25 85 L 75 85 "; // Default open top/bottom
  paths.push({ d: framePath, className: "text-emerald-500", strokeWidth: 3 });

  // 2. Crown Radical (Top Zone: Y:22-34)
  let crownPath = "";
  if (crownVal & 1) crownPath += "M 25 24 L 75 24 "; // High horizontal bar
  if (crownVal & 2) crownPath += "M 35 30 L 50 22 L 65 30 "; // Triangular roof
  if (crownVal & 4) crownPath += "M 50 22 L 50 34 "; // Center kingpin
  if (crownVal & 8) crownPath += "M 28 34 L 35 26 "; // Left sweeping diagonal
  if (crownVal & 16) crownPath += "M 72 34 L 65 26 "; // Right sweeping diagonal
  paths.push({ d: crownPath, className: "text-emerald-400", strokeWidth: 2 });

  // 3. Heart Radical (Center Zone: Y:40-60, X:25-75)
  let heartPath = "";
  if (heartVal & 1) heartPath += "M 30 42 L 70 42 L 70 58 L 30 58 Z "; // Central chamber
  if (heartVal & 2) heartPath += "M 30 50 L 70 50 "; // Chamber divider
  if (heartVal & 4) heartPath += "M 50 40 L 50 60 "; // Vertical conduit
  if (heartVal & 8) heartPath += "M 38 45 L 62 55 M 62 45 L 38 55 "; // Inner cross
  if (heartVal & 16) heartPath += "M 22 50 L 28 50 M 72 50 L 78 50 "; // External couplers
  paths.push({ d: heartPath, className: "text-emerald-300", strokeWidth: 1.5 });

  // 4. Roots Radical (Bottom Zone: Y:66-80)
  let rootsPath = "";
  if (rootsVal & 1) rootsPath += "M 50 66 L 50 80 "; // Deep taproot
  if (rootsVal & 2) rootsPath += "M 48 70 L 28 78 "; // Left leg
  if (rootsVal & 4) rootsPath += "M 52 70 L 72 78 "; // Right leg
  if (rootsVal & 8) rootsPath += "M 35 80 L 65 80 "; // Grounding foundation
  if (rootsVal & 16) rootsPath += "M 25 68 L 25 76 M 75 68 L 75 76 "; // Side stabilizers
  paths.push({ d: rootsPath, className: "text-emerald-600", strokeWidth: 2.5 });

  return paths;
};

// ============================================================================
// STYLE 1: "CELESTIAL" (Concentric Orbital System)
// Structural rules: Smooth Bezier curves (C/S/Q), nested radii, directional flow.
// ============================================================================
const generateCelestialStyle = (input: LogographInput): RenderPath[] => {
  const [spineVal, leftVal, rightVal, auraVal] = input;
  const paths: RenderPath[] = [];

  // 1. Background Aura (Lowest Z-Index, High radius, Low opacity)
  let auraPath = "";
  if (auraVal & 1) auraPath += "M 50 10 A 40 40 0 1 0 50 90 A 40 40 0 1 0 50 10 Z "; // Full outer orbit
  if (auraVal & 2) auraPath += "M 15 50 A 35 35 0 0 1 85 50 "; // Upper crescent
  if (auraVal & 4) auraPath += "M 85 50 A 35 35 0 0 1 15 50 "; // Lower crescent
  if (auraVal & 8) auraPath += "M 50 20 A 30 30 0 1 0 50 80 A 30 30 0 1 0 50 20 Z "; // Inner resonance ring
  if (auraVal & 16) auraPath += "M 50 5 L 50 15 M 50 85 L 50 95 M 5 50 L 15 50 M 85 50 L 95 50 "; // Cardinal axis ticks
  paths.push({ d: auraPath, className: "text-purple-400", strokeWidth: 1, opacity: 0.35 });

  // 2. Central Spine (The primary vertical S-curves)
  let spinePath = "";
  if (spineVal & 1) spinePath += "M 50 15 C 65 35, 35 65, 50 85 "; // Primary harmonic wave
  if (spineVal & 2) spinePath += "M 50 15 C 35 35, 65 65, 50 85 "; // Inverse harmonic wave
  if (spineVal & 4) spinePath += "M 50 25 L 50 75 "; // Core plumb line
  if (spineVal & 8) spinePath += "M 42 40 Q 50 50 42 60 M 58 40 Q 50 50 58 60 "; // Central eye
  if (spineVal & 16) spinePath += "M 45 50 L 55 50 "; // Equator lock
  if (spineVal === 0) spinePath += "M 50 30 L 50 70 "; // Fallback spine
  paths.push({ d: spinePath, className: "text-indigo-400", strokeWidth: 2.5 });

  // 3. Left Wing Currents (Nested exclusively in X:15-45)
  let leftPath = "";
  if (leftVal & 1) leftPath += "M 45 25 Q 25 25 20 45 "; // Upper sweeping sail
  if (leftVal & 2) leftPath += "M 20 55 Q 25 75 45 75 "; // Lower sweeping sail
  if (leftVal & 4) leftPath += "M 40 35 Q 28 50 40 65 "; // Inner bow
  if (leftVal & 8) leftPath += "M 15 35 C 10 50, 10 50, 15 65 "; // Outer boundary arc
  if (leftVal & 16) leftPath += "M 30 45 Q 25 50 30 55 "; // Pulse node
  paths.push({ d: leftPath, className: "text-indigo-300", strokeWidth: 1.75 });

  // 4. Right Wing Currents (Nested exclusively in X:55-85)
  let rightPath = "";
  if (rightVal & 1) rightPath += "M 55 25 Q 75 25 80 45 "; // Upper sweeping sail
  if (rightVal & 2) rightPath += "M 80 55 Q 75 75 55 75 "; // Lower sweeping sail
  if (rightVal & 4) rightPath += "M 60 35 Q 72 50 60 65 "; // Inner bow
  if (rightVal & 8) rightPath += "M 85 35 C 90 50, 90 50, 85 65 "; // Outer boundary arc
  if (rightVal & 16) rightPath += "M 70 45 Q 75 50 70 55 "; // Pulse node
  paths.push({ d: rightPath, className: "text-indigo-500", strokeWidth: 1.75 });

  return paths;
};

// ============================================================================
// STYLE 2: "PRISMATIC" (Isometric/Hex Lattice)
// Structural rules: Sharp angles, parallel offsetting, geometric density.
// ============================================================================
const generatePrismaticStyle = (input: LogographInput): RenderPath[] => {
  const [matrixVal, facetVal, coreVal, refractionVal] = input;
  const paths: RenderPath[] = [];

  // 1. Outer Matrix Shell (Primary polygonal boundary)
  let matrixPath = "";
  if (matrixVal & 1) matrixPath += "M 50 10 L 85 30 L 85 70 L 50 90 L 15 70 L 15 30 Z "; // Hexagon
  if (matrixVal & 2) matrixPath += "M 50 15 L 80 50 L 50 85 L 20 50 Z "; // Diamond
  if (matrixVal & 4) matrixPath += "M 25 25 L 75 25 L 75 75 L 25 75 Z "; // Square
  if (matrixVal & 8) matrixPath += "M 50 10 L 90 90 L 10 90 Z "; // Upward Delta
  if (matrixVal & 16) matrixPath += "M 15 20 L 85 20 L 85 80 L 15 80 Z "; // Wide Rectangle
  if (matrixVal === 0) matrixPath += "M 30 30 L 70 30 L 70 70 L 30 70 Z "; // Fallback Box
  paths.push({ d: matrixPath, className: "text-cyan-500", strokeWidth: 2.5 });

  // 2. Internal Facets (Triangulation lines connecting vertices)
  let facetPath = "";
  if (facetVal & 1) facetPath += "M 15 30 L 85 70 M 15 70 L 85 30 "; // Cross chords
  if (facetVal & 2) facetPath += "M 50 10 L 50 90 M 15 50 L 85 50 "; // Orthogonal axes
  if (facetVal & 4) facetPath += "M 50 15 L 75 75 L 25 75 Z "; // Inner inverted triangle
  if (facetVal & 8) facetPath += "M 32 32 L 68 32 L 68 68 L 32 68 Z "; // Parallel inner box
  if (facetVal & 16) facetPath += "M 50 30 L 70 50 L 50 70 L 30 50 Z "; // Inner diamond
  paths.push({ d: facetPath, className: "text-blue-400", strokeWidth: 1.5 });

  // 3. Dense Core Gem (Strictly centered, max radius 12)
  let corePath = "";
  if (coreVal & 1) corePath += "M 50 40 L 60 50 L 50 60 L 40 50 Z "; // Diamond core
  if (coreVal & 2) corePath += "M 44 44 L 56 44 L 56 56 L 44 56 Z "; // Square core
  if (coreVal & 4) corePath += "M 50 38 L 50 62 M 38 50 L 62 50 "; // Crosshair core
  if (coreVal & 8) corePath += "M 45 45 L 55 55 M 55 45 L 45 55 "; // X core
  if (coreVal & 16) corePath += "M 50 46 L 54 50 L 50 54 L 46 50 Z "; // Micro center dot
  paths.push({ d: corePath, className: "text-teal-300", strokeWidth: 2, fill: "currentColor", opacity: 0.8 });

  // 4. Refraction Rays (External ticks pointing away from center)
  let refPath = "";
  if (refractionVal & 1) refPath += "M 50 2 L 50 10 M 50 90 L 50 98 "; // North/South rays
  if (refractionVal & 2) refPath += "M 2 50 L 10 50 M 90 50 L 98 50 "; // East/West rays
  if (refractionVal & 4) refPath += "M 15 15 L 22 22 M 85 85 L 78 78 "; // NW/SE rays
  if (refractionVal & 8) refPath += "M 85 15 L 78 22 M 15 85 L 22 78 "; // NE/SW rays
  if (refractionVal & 16) refPath += "M 30 10 L 33 15 M 70 10 L 67 15 M 30 90 L 33 85 M 70 90 L 67 85 "; // Off-axis pins
  paths.push({ d: refPath, className: "text-cyan-200", strokeWidth: 1.5 });

  return paths;
};

// ============================================================================
// STYLE 3: "ABYSSAL" (Asymmetric Organic/Branching System)
// Structural rules: Controlled chaos, distinct node punctuation, depth layering.
// ============================================================================
const generateAbyssalStyle = (input: LogographInput): RenderPath[] => {
  const [ventVal, currentVal, polypVal, depthVal] = input;
  const paths: RenderPath[] = [];

  // 1. Background Depth (Soft, low-opacity ambient kelp/shadows)
  let depthPath = "";
  if (depthVal & 1) depthPath += "M 20 95 C 10 70, 30 40, 15 15 "; // Deep left kelp
  if (depthVal & 2) depthPath += "M 80 95 C 90 70, 70 40, 85 15 "; // Deep right kelp
  if (depthVal & 4) depthPath += "M 40 90 C 30 60, 60 50, 45 20 "; // Mid-shadow drift
  if (depthVal & 8) depthPath += "M 60 90 C 70 60, 40 50, 55 20 "; // Reverse mid-shadow
  if (depthVal & 16) depthPath += "M 10 50 Q 50 60 90 50 "; // Deep benthic line
  paths.push({ d: depthPath, className: "text-red-400", strokeWidth: 3, opacity: 0.25 });

  // 2. Hydrothermal Vents (Heavy, bottom-up primary structures)
  let ventPath = "";
  if (ventVal & 1) ventPath += "M 35 90 Q 30 60 45 35 T 30 15 "; // Left rising vent
  if (ventVal & 2) ventPath += "M 65 90 Q 70 60 55 35 T 70 15 "; // Right rising vent
  if (ventVal & 4) ventPath += "M 50 95 C 50 75, 35 65, 50 45 C 65 25, 50 15, 50 10 "; // Serpentine stalk
  if (ventVal & 8) ventPath += "M 25 85 C 40 80, 45 65, 30 50 "; // Short left spur
  if (ventVal & 16) ventPath += "M 75 85 C 60 80, 55 65, 70 50 "; // Short right spur
  if (ventVal === 0) ventPath += "M 50 85 Q 45 60 50 35 "; // Fallback stalk
  paths.push({ d: ventPath, className: "text-rose-500", strokeWidth: 2.5 });

  // 3. Drifting Currents (Thin, horizontal/diagonal cutting tendrils)
  let currentPath = "";
  if (currentVal & 1) currentPath += "M 10 30 C 35 20, 65 40, 90 30 "; // Upper cross-current
  if (currentVal & 2) currentPath += "M 10 70 C 35 80, 65 60, 90 70 "; // Lower cross-current
  if (currentVal & 4) currentPath += "M 20 45 Q 50 30 80 55 "; // Diagonal shear
  if (currentVal & 8) currentPath += "M 20 65 Q 50 80 80 45 "; // Inverse diagonal shear
  if (currentVal & 16) currentPath += "M 35 40 C 45 40, 45 60, 35 60 Z "; // Localized vortex
  paths.push({ d: currentPath, className: "text-pink-400", strokeWidth: 1.25, strokeDasharray: "4 2" });

  // 4. Polyp Nodes (High-contrast circular dots spawned in open coordinates)
  // Using explicit arc drawing to render pure SVG circles without external tags
  let polypPath = "";
  const drawCircle = (x: number, y: number, r: number) => 
    `M ${x - r} ${y} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0 `;

  if (polypVal & 1) polypPath += drawCircle(50, 25, 4); // Apex biolum-node
  if (polypVal & 2) polypPath += drawCircle(25, 45, 3) + drawCircle(75, 45, 3); // Flanking pair
  if (polypVal & 4) polypPath += drawCircle(35, 75, 3.5) + drawCircle(65, 75, 3.5); // Basal pair
  if (polypVal & 8) polypPath += drawCircle(50, 50, 5); // Central heart node
  if (polypVal & 16) polypPath += drawCircle(20, 25, 2) + drawCircle(80, 25, 2) + drawCircle(50, 75, 2); // Triad spores
  paths.push({ d: polypPath, className: "text-fuchsia-300", strokeWidth: 1.5, fill: "currentColor" });

  return paths;
};

// ============================================================================
// MASTER ROUTER
// ============================================================================
export const generateLogograph = (input: LogographInput): RenderPath[] => {
  const maxVal = Math.max(...input);
  const dominantIndex = input.indexOf(maxVal);

  switch (dominantIndex) {
    case 0:
      return generateEmperorStyle(input);
    case 1:
      return generateCelestialStyle(input);
    case 2:
      return generatePrismaticStyle(input);
    case 3:
    default:
      return generateAbyssalStyle(input);
  }
};