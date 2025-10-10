# Haven — Web Text RPG (GitHub Pages)

A browser-only, day-by-day settlement builder with strict data integrity, inspired by our Haven campaign.
Deploys as a static SPA on GitHub Pages. No backend.

## Features
- Day tick: Next Day / Advance 3 Days (deterministic, seeded)
- Villagers only perform their assigned jobs (no silent cross-skilling)
- Build queue with **replacement vs renovation** accounting (no ghost capacity)
- Crafting planner: “craft until X on hand”
- Grid map (0,0 origin) with biome/geography modifiers (river/forest/mine/lake)
- Icon resource bar with tooltips showing stock and Δ/day
- Local save/load (JSON), reset, and pause-on-summon modal

## Run Locally
```bash
npm i
npm run dev
```

## Build & Deploy (GitHub Pages)
- Set the correct repo name in `vite.config.ts` (`base: '/<REPO_NAME>/'`).
- Enable GitHub Pages for the repo.
- Push to `main`; workflow `.github/workflows/pages.yml` will build & deploy.

## Data Integrity & Single Writer
All state mutations happen only in `src/game/engine.ts` inside `advanceDay()`.
Modules export pure functions; no circular imports. State validated via type guards (or Zod if you prefer).

## Replacement / Renovation Accounting (Critical)
- **Replacement:** subtract previous structure capacity/bonuses **first**, then add the new structure when complete.
- **Renovation:** add **only the net gain** (do not double count base capacity).
- **Deconstruction:** remove old capacity/bonuses entirely until rebuild finishes.

This prevents “ghost beds/resources.” See `tests/replacement.spec.ts`.

## Biomes & Geography
Choose biome (temperate, boreal, desert, coastal, alpine) and features (river/lake/mine/forest). These modify production baselines (e.g., river → fish +2/day; forest → logs +2/day; mine → stone/ore bonus).

## Scripts
- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview built site
- `npm run test` — vitest tests
- `npm run lint` — lint TS/TSX

## Testing
Run `npm run test`. See `tests/*.spec.ts` for determinism, “until X” crafting, replacement math, and negative stock prevention.

## Save/Load
Use the top-right menu to export `savegame.json` and import it later. State is also mirrored to `localStorage`.

---

© You. Made with discipline, patience, and a mildly judgmental forager.
