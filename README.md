# LogographCipher

This project encodes text data into logographs. You can export as SVG.

Four values, five bits each — set a plate, pull a print. Client-side React app that turns text and numbers into logograph glyphs rendered as inline SVG. No server, no storage, just local state.

Two modes: **Specimen** — craft a single glyph with four 0–31 sliders; **Sequence** — tokenize a string into a grid of glyphs and export a standalone SVG.

## Run

```bash
npm install
npm run dev      # Vite + HMR
npm run build    # tsc -b && vite build — must pass
npm run lint     # oxlint
```

## How it works

Text → tokens (`/\d+|[A-Za-z,.!?:-]/`) → values (A–Z → 0–25, `,.-!?:` → 26–31, digits % 32) → groups of four → one glyph per group. The largest value picks the style (Emperor / Celestial / Prismatic / Abyssal). Each style maps its five bit flags to distinct geometry in a fixed `0 0 100 100` viewBox. Changing the mapping is a breaking change — it invalidates exported SVGs.

## Stack

React 19 · TypeScript 6 · Vite 8 · Tailwind 4 (`@import "tailwindcss"` in `src/index.css`, no config file) · oxlint

```
src/App.tsx              # only state owner
src/cipher/encode.ts     # cipher contract
src/logograph/Engine.ts  # style registry + generateLogograph
src/logograph/styles/*   # one geometry module per style
src/components/*         # presentational controls
```
