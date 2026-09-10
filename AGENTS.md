# AGENTS.md

Guidance for agents (and humans) working in this repository.

## Project overview

**LogographCipher** is a client-side React app that turns numbers and text into "logograph" cipher
glyphs rendered as inline SVG. It is a pure static SPA: no server, no routing, no data fetching, no
persistence — all state is local React state.

One screen, split into a preview canvas and a control sidebar, with two modes:

- **Builder** — craft a single glyph by dragging four sliders (values `0`–`31`).
- **Sequence** — tokenize a text/number string into a grid of glyphs, choose grid size, ink/paper
  colors, and export the result as a standalone `.svg` file.

## Commands

```bash
npm install          # install dependencies (package-lock.json is committed)
npm run dev          # Vite dev server with HMR
npm run build        # tsc -b && vite build  -> must pass before finishing work
npm run lint         # oxlint
npm run preview      # serve the production build in dist/
```

There is **no test runner** installed (no Vitest/Jest). Verification means: `npm run build` +
`npm run lint` are clean, plus a manual pass in `npm run dev` / the preview.

## Stack and configuration

- **React 19** with the automatic JSX runtime (`"jsx": "react-jsx"`). Do **not** import the React
  default export unless you actually use the `React` namespace (`React.FC`, `React.ReactNode`, …);
  an unused import is a hard build error, not just a lint warning.
- **TypeScript 6**, project references: `tsconfig.json` → `tsconfig.app.json` (compiles `src/`) and
  `tsconfig.node.json` (build tooling). Notable flags in `tsconfig.app.json`:
  - `noUnusedLocals`, `noUnusedParameters` — dead locals/params fail the build.
  - `verbatimModuleSyntax` — use `import type { ... }` for type-only imports.
  - `erasableSyntaxOnly` — no enums / parameter properties / other non-erasable syntax.
  - `noFallthroughCasesInSwitch`, `moduleResolution: "bundler"`, `allowImportingTsExtensions`,
    `noEmit`, `allowArbitraryExtensions`.
  - Build info is written to `node_modules/.tmp/`.
- **Vite 8** with `@vitejs/plugin-react` (`vite.config.ts`).
- **Tailwind CSS 4** via the `@tailwindcss/vite` plugin. CSS-first config: there is **no**
  `tailwind.config.js`; the framework is pulled in with `@import "tailwindcss";` at the top of
  `src/index.css`. Tailwind scans source text, so utility class names only exist if they appear
  literally in a source file — including in string literals (see `Engine.ts`).
- **oxlint** (`.oxlintrc.json`, plugins `react`/`typescript`/`oxc`). Warnings are tolerated today;
  don't introduce new ones.

Runtime dependencies are deliberately minimal: `react`, `react-dom`, `tailwindcss`. Prefer solving
things with what's already here instead of adding packages.

## Architecture

```
index.html              # shell; loads /src/main.tsx, title "logographcipher"
src/main.tsx            # StrictMode bootstrap into #root
src/App.tsx             # ALL UI + state: tabs, sliders, tokenizer, grid, colors, SVG export
src/index.css           # Tailwind import + leftover Vite template styles
src/logograph/Engine.ts # pure glyph geometry (no React, no DOM)
src/logograph/Renderer.tsx # engine output -> <svg viewBox="0 0 100 100">
public/favicon.svg      # referenced by index.html
```

`App.tsx` is the only place that owns state; `Renderer.tsx` is a dumb presentation component and
`Engine.ts` is a pure function module. Keep those boundaries — put new geometry in `Engine.ts`, not
in components.

## Engine model (the part most likely to bite you)

### Input and style selection

`LogographInput` is a 4-tuple `[number, number, number, number]`, each value `0`–`31`. Each value
drives one *radical* of the glyph, interpreted as five bit flags: `1`, `2`, `4`, `8`, `16`.

The **style** is picked by *position of the largest value* (ties resolve to the lowest index):

| Dominant index | Style | Radicals |
| --- | --- | --- |
| 0 | `EMPEROR` | Frame, Crown, Heart, Roots (strict horizontal/vertical "bento" grid) |
| 1 | `CELESTIAL` | Spine, Left wing, Right wing, Aura (concentric orbital curves) |
| 2 | `PRISMATIC` | Matrix, Facet, Core, Refraction (isometric hex lattice) |
| 3 | `ABYSSAL` | Vent, Current, Polyp, Depth (asymmetric organic branching) |

`generateLogograph` (the master router in `Engine.ts`) and the slider labels in `App.tsx` both
implement this rule. If you change style selection, change it in **both** places.

### Output shape

Each style generator returns exactly four `RenderPath` objects, one per radical and in a fixed
order, so callers can rely on index stability. A path's `d` may be an empty string when all five
flags are `0`; that renders harmlessly. Optional per-path visuals: `strokeWidth`,
`strokeDasharray`, `fill` (`"currentColor"` for solid nodes), `opacity`.

### Geometry conventions

- Fixed `0 0 100 100` viewBox, y grows downward, glyph center at `(50, 50)`.
- Radicals occupy reserved zones documented in the comment header above each generator. Respect
  them: containment ("no zone bleeding") is what makes styles visually consistent. Radicals that
  need layered depth express it with `opacity`, not by overlapping coordinates.
- Path data is absolute-command SVG (`M`, `L`, `A`, `C`, `Q`, `Z`) with explicit coordinates and a
  trailing space per subpath; a radical accumulates several subpaths into one string. To extend a
  radical, append another subpath string to its builder.
- `className` carries the per-style Tailwind color utilities (`text-emerald-500`, `text-indigo-400`,
  …). Stroke inherits through `currentColor`. When `LogographRenderer` receives `overrideColor`, it
  drops the per-path class names and forces `stroke`/`color` — that's how monochrome sequence
  rendering and export stay consistent.

### Sequence encoding (the cipher contract)

`App.tsx` tokenizes with `/\d+|[a-zA-Z,\.!\?:\-]/g`, uppercases letters, then maps:

- digits → `parseInt(token, 10) % 32`
- `A`–`Z` → `0`–`25`
- punctuation → `,` 26, `.` 27, `!` 28, `?` 29, `:` 30, `-` 31

Tokens are grouped into runs of four (zero-padded) so each glyph consumes four tokens. This mapping
is the cipher's public contract: changing it invalidates previously exported SVGs and decoded
sequences, so treat it as a breaking change and update this document if you touch it.

## Conventions and gotchas

- **Engine↔export duplication.** `handleExport` in `App.tsx` re-implements the renderer's
  path→SVG-string mapping by hand (engine call → `<g transform>` per grid cell, `cellSize = 120`,
  `padding = 20`, output clipped to `gridCols * gridRows` glyphs). It exists to avoid DOM
  serialization, but it does **not** share code with `Renderer.tsx`. Any new `RenderPath` property
  must be handled in both spots or exports will silently diverge from the canvas.
- **Dominant-value UX.** Because style comes from the largest value, moving a single slider can
  switch the entire glyph's morphology; the Builder's "Active Morphology" label and slider names
  change accordingly. That's intended, not a bug.
- **Unused template leftovers.** `src/App.css`, `src/assets/hero.png`, `src/assets/react.svg`,
  `src/assets/vite.svg`, and `public/icons.svg` are not referenced anywhere. `src/index.css` still
  carries Vite template rules (`#root { width: 1126px; text-align: center }`, `body { margin: 0 }`,
  heading/code styles) that coexist with the app's own Tailwind layout. Delete deliberately rather
  than assuming they're load-bearing.
- **Line endings.** `src/logograph/Engine.ts` and `src/logograph/Renderer.tsx` are CRLF; other
  `src/` files are LF. Preserve each file's existing endings so diffs stay readable.
- **State locality.** No global store, no context, no URL state. Adding persistence (localStorage,
  shareable links) means introducing that concept deliberately.
