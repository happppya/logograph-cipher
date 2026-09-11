# AGENTS.md

Guidance for agents (and humans) working in this repository.

## Project overview

**LogographCipher** is a client-side React app that turns numbers and text into "logograph" cipher
glyphs rendered as inline SVG. It is a pure static SPA: no server, no routing, no data fetching, no
persistence — all state is local React state, owned by `src/App.tsx`.

One screen, split into a preview canvas and a control sidebar, with two modes:

- **Builder** — craft a single glyph by dragging four sliders (values `0`–`31`).
- **Sequence** — tokenize a text/number string into a grid of glyphs, choose grid size, ink/paper
  colors, and export the result as a standalone `.svg` file.

## Commands

```bash
npm install          # install dependencies (package-lock.json is committed)
npm run dev          # Vite dev server with HMR
npm run build        # tsc -b && vite build  -> must pass before finishing work
npm run lint         # oxlint  (currently 0 warnings; keep it that way)
npm run preview      # serve the production build in dist/
```

There is **no test runner** installed (no Vitest/Jest). Verification means: `npm run build` +
`npm run lint` are clean, plus a manual pass in `npm run dev` / the preview.

## Stack and configuration

- **React 19** with the automatic JSX runtime (`"jsx": "react-jsx"`). Do **not** import the React
  default export unless you actually use the `React` namespace; import hooks and types instead
  (`import type { FC } from 'react'`). An unused import is a hard build error, not just a lint
  warning.
- **TypeScript 6**, project references: `tsconfig.json` → `tsconfig.app.json` (compiles `src/`) and
  `tsconfig.node.json` (build tooling). Notable flags in `tsconfig.app.json`:
  - `noUnusedLocals`, `noUnusedParameters` — dead locals/params fail the build.
  - `verbatimModuleSyntax` — use `import type { ... }` for type-only imports.
  - `erasableSyntaxOnly` — no enums / parameter properties / other non-erasable syntax; use
    `as const` objects instead of enums.
  - `noFallthroughCasesInSwitch`, `moduleResolution: "bundler"`, `allowImportingTsExtensions`,
    `noEmit`, `allowArbitraryExtensions`.
  - Build info is written to `node_modules/.tmp/`.
- **Vite 8** (rolldown-based) with `@vitejs/plugin-react` (`vite.config.ts`).
- **Tailwind CSS 4** via the `@tailwindcss/vite` plugin. CSS-first config: there is **no**
  `tailwind.config.js`; the framework is pulled in with `@import "tailwindcss";` at the top of
  `src/index.css`. Tailwind scans source text, so utility class names only exist if they appear
  literally in a source file — including in string literals (see the style modules under
  `src/logograph/styles/`).
- **oxlint** (`.oxlintrc.json`, plugins `react`/`typescript`/`oxc`).

Runtime dependencies are deliberately minimal: `react`, `react-dom`, `tailwindcss`. Prefer solving
things with what's already here instead of adding packages.

## Architecture

```
index.html                    # shell; loads /src/main.tsx, title "logographcipher"
src/main.tsx                  # StrictMode bootstrap into #root
src/App.tsx                   # the only state owner: mode, builder input, text, grid, palette + layout
src/types.ts                  # shared UI state shapes: Mode, GridSize, Palette
src/index.css                 # Tailwind import + `color-scheme: dark`
src/components/
  ModeTabs.tsx                # Builder / Sequence switcher
  BuilderControls.tsx         # the four radical sliders + morphology badge
  SequenceControls.tsx        # text, grid size, ink/paper colors, Export button
  SequenceGrid.tsx            # preview grid of glyphs (plus empty-cell placeholders)
src/cipher/encode.ts         # tokenizing + value mapping (the cipher contract, pure)
src/logograph/
  types.ts                    # LogographInput, RenderPath, GlyphStyle, RadicalLabels
  Engine.ts                   # style registry, dominant-value selection, generateLogograph
  styles/{emperor,celestial,prismatic,abyssal}.ts   # one geometry module per style
  pathAttributes.ts           # engine defaults shared by renderer and exporter
  Renderer.tsx                # engine output -> <svg viewBox="0 0 100 100">
  svgExport.ts                # engine output -> standalone SVG document string
public/favicon.svg            # referenced by index.html
```

Dependency direction is one-way: `components/` → `cipher/` + `logograph/` → `logograph/types.ts`.
`App.tsx` holds all state and passes values/callbacks down; components stay presentational, and
`logograph/` stays free of React (except `Renderer.tsx`). Put new geometry in the relevant style
module, not in components.

## Engine model (the part most likely to bite you)

### Input and style selection

`LogographInput` is a 4-tuple `[number, number, number, number]`, each value `0`–`31`. Each value
drives one *radical* of the glyph, interpreted as five bit flags: `1`, `2`, `4`, `8`, `16`.

The **style** is picked by *position of the largest value* (ties resolve to the lowest index), via
`selectStyle` / `GLYPH_STYLES` in `Engine.ts`. The array order is load-bearing:

| Dominant index | Style | Radicals | Visual language |
| --- | --- | --- | --- |
| 0 | `Emperor` | Frame, Crown, Heart, Roots | 100% horizontal/vertical strokes, heaviest weights — architecture |
| 1 | `Celestial` | Spine, Left Wing, Right Wing, Aura | ~90% curves, thinnest strokes, no straight segment at all — orbits |
| 2 | `Prismatic` | Matrix, Facet, Core, Refraction | Angled edges rather than axis-aligned ones, plus a solid faceted gem and rays that escape the hull |
| 3 | `Abyssal` | Vent, Current, Polyp, Depth | Asymmetric organic curves, dashed tendrils and solid nodes |

Each style module exports a `GlyphStyle`: its display `name`, its four slider `radicals`, and its
`build` function. The Builder UI reads the name and labels straight from the selected style, so
style metadata has exactly one home — never re-derive the dominance rule in a component.

### Output shape

Every `build` returns exactly four `RenderPath` objects, one per radical, in a fixed order, so
callers can rely on index stability. A path's `d` may be an empty string when all five flags are
`0`; that renders harmlessly (and appears as `<path d="" />` in exports). Optional per-path visuals:
`strokeWidth`, `strokeDasharray`, `fill` (`"currentColor"` for solid nodes), `opacity`.

### Geometry conventions

- Fixed `0 0 100 100` viewBox, y grows downward, glyph center at `(50, 50)`.
- Each style file declares its bit meanings as `as const` maps (`FRAME.leftWall`, `CROWN.roof`, …);
  use those instead of raw `& 1` / `& 2` literals. Add a key when you add a subpath.
- Radicals occupy reserved zones documented in the header comment of each style file. Respect them:
  containment ("no zone bleeding") is what makes styles visually consistent. Adjacent bands may meet
  deliberately (Emperor's heart columns tie the crown to the roots) but a radical must never scatter
  across the canvas. Radicals that need layered depth express it with `opacity`, not by overlapping
  coordinates. Abyssal's path order (depth, vent, current, polyp) is back-to-front on purpose.
- **Every flag must be a large feature.** Sequence mode draws every glyph in one ink color, so shape,
  weight, and texture are the only things carrying the cipher; a subtle bit is a lost bit. Flipping a
  single flag must change roughly 1% or more of the glyph's bounding box — measure it rather than
  guessing, with the harness described under "Verifying look and legibility". Two traps break this
  rule, and both were real bugs here: nesting a new subpath *inside* an already-filled shape (it
  disappears — Prismatic's core, four invisible flags), and drawing a new feature directly on top of
  another radical's geometry (Emperor's stabilizers, which ran alongside the frame pillars). Give each
  flag its own slot, or at most share junction points.
- Stroke weights carry as much identity as shape: Emperor runs 3.5/3/2.75, Prismatic 1.75-2.5,
  Celestial 1.75-2.5, Abyssal 1.5-2.75. Keep Emperor the heaviest and Celestial the lightest, or the
  two stop reading as different objects at a 64px cell.
- Path data is absolute-command SVG (`M`, `L`, `A`, `C`, `Q`, `Z`) with explicit coordinates and a
  trailing space per subpath. Geometry is collected in a `string[]` per radical and joined into one
  `d`, so appending a subpath means pushing another literal.
- `className` carries the per-style Tailwind color utilities (`text-emerald-500`, `text-indigo-400`,
  …). Stroke inherits through `currentColor`. When `LogographRenderer` receives `overrideColor`, it
  drops the per-path class names and forces `stroke`/`color` — that's how monochrome sequence
  rendering and export stay consistent.

### Sequence encoding (the cipher contract)

`src/cipher/encode.ts` holds the whole mapping. `textToGlyphs` tokenizes with
`/\d+|[A-Za-z,.!?:-]/g`, uppercases letters, then maps:

- digits → `parseInt(token, 10) % 32`
- `A`–`Z` → `0`–`25`
- punctuation → `,` 26, `.` 27, `!` 28, `?` 29, `:` 30, `-` 31

Tokens are grouped into runs of four (zero-padded) so each glyph consumes four tokens; empty input
still yields one zeroed glyph. This mapping is the cipher's public contract: changing it invalidates
previously exported SVGs and decoded sequences, so treat it as a breaking change and update this
document if you touch it.

## Conventions and gotchas

- **One source of truth for path visuals.** `resolvePath` in `logograph/pathAttributes.ts` applies
  defaults (`fill: "none"`, `strokeWidth: 2`) for both consumers: `Renderer.tsx` (JSX) and
  `svgExport.ts` (`serializePath`, string). A new `RenderPath` property must be added to
  `resolvePath`, the JSX path, and `serializePath` — the last two cannot share code because one emits
  React props and one emits SVG text.
- **Export geometry.** `buildSequenceSvg` uses `cellSize = 120`, `padding = 20`, and clips to
  `columns * rows` glyphs; the grid background/ink come from the palette. It writes the file with a
  Blob + temporary anchor (`downloadFile` in `App.tsx`).
- **Dominant-value UX.** Because style comes from the largest value, moving a single slider can
  switch the entire glyph's morphology; the Builder's "Active Morphology" badge and slider names
  change accordingly. That's intended, not a bug.
- **Verifying look and legibility.** There is no test runner, and screenshots are not always available,
  so verify geometry by rasterizing it: import `generateLogograph` and `resolvePath` from the dev server
  in the browser (`await import('/src/logograph/Engine.ts')`), render the paths into an
  `<svg width="128" height="128" viewBox="0 0 100 100">`, draw it to a canvas, and compare masks. Two
  numbers matter: the XOR area from flipping one flag (1.1% or better in any style, at both 128px and
  the real 64px cell size) and whether a nearest-centroid classifier can still name the style from
  pixels alone (95%+ today). Remember that `fill="currentColor"` resolves to *black* in a data-URL
  image document — map it to white in the harness or filled shapes measure as invisible.
- **Gradient utilities.** Use `bg-radial from-… to-…` (Tailwind 4.1+). Writing
  `bg-[radial-gradient(…,var(--tw-gradient-stops))]` without a gradient-position utility leaves
  `--tw-gradient-position` empty, which invalidates the var chain and silently computes to
  `background-image: none`.
- **Line endings.** Everything under `src/logograph/` (including `styles/`) is CRLF; all other `src/`
  files are LF. Preserve each file's existing endings so diffs stay readable.
- **State locality.** No global store, no context, no URL state. Adding persistence (localStorage,
  shareable links) means introducing that concept deliberately.
