# Haven-style Browser RPG

## Overview & Goals

Haven is a deterministic, single-player settlement simulator that runs entirely in the browser. The project delivers a GitHub Pages-ready single page application (SPA) built with Vite, React, and TypeScript. Players guide the **Village of Haven** through day-by-day survival by assigning villagers to jobs, planning construction, and balancing logistics. All logic executes on the client with optional localStorage persistence and JSON import/export, making it suitable for static hosting.

The goals for the app are:

- Deterministic day simulation with a single mutation surface.
- Structured schemas and type guards to maintain data integrity.
- Clear UI for resource tracking, job assignment, crafting targets, construction queue, map layout, and notifications.
- Replacement/renovation rules for structures with rigorous accounting and tests.
- Easy deployment to GitHub Pages using Vite's static build output and an automated workflow.

## Game Loop (Day Tick Order)

Each day (or 3-day block) the engine applies systems in the following strict order:

1. **Production** – Villagers gather or produce resources according to their job assignments and location bonuses.
2. **Consumption** – Required food, fuel, and maintenance resources are deducted.
3. **Construction** – Build queue progresses; replacement/renovation accounting is validated.
4. **Crafting Targets** – Crafting plans are executed toward their "until X" targets.
5. **Logistics** – Carts, packs, and road bonuses adjust effective throughput and travel fatigue.
6. **Morale/Stability/Readiness** – Settlement-wide status updates.
7. **Interrupts** – Summon eligibility, deficit warnings, scripted events.

All state transitions flow through `engine.tickDay`, guaranteeing determinism and facilitating tests.

## Data Model & Integrity Rules

- `src/game/state.ts` defines Zod schemas, TypeScript types, and default seed data.
- A **single writer** pattern is enforced: only `engine.ts` mutates the authoritative state; other systems receive immutable snapshots and return patches.
- Validation guards (`isGameState`, etc.) protect external data such as JSON imports.
- ID uniqueness, job caps, and resource bounds are validated every tick. Attempts to duplicate villagers, recipes, or map entries are rejected.

## Replacement & Renovation Accounting

Structural changes follow these rules:

- **Replacement:** remove the outgoing building's capacity/bonuses before adding the new structure. Example: replacing a `wooden_hut` (capacity 2) with a `stone_house` (capacity 3) immediately drops capacity to 0 until the new build completes; on completion, capacity becomes 3.
- **Renovation:** only the **net gain** is applied. Renovating a `barn` from tier 1 (storage 50) to tier 2 (storage 80) adds +30 storage.
- **Deconstruction:** subtract the previous bonuses entirely. If the rebuild fails, bonuses are not restored automatically.

Vitest unit tests in `tests/replacement.spec.ts` validate these rules and ensure capacity never inflates through replacements.

## Biome & Geography Modifiers

New games prompt the player to select a biome (temperate, boreal, desert, coastal, alpine) and optional features (river, lake, mine, dense forest). The starting seed `Village of Haven` defaults to **temperate** with **river**, **forest**, and **mine** bonuses.

Bonuses include:

- **River:** +2 fish/food per day, +1 clay.
- **Dense Forest:** +2 logs per day, improved carpenter efficiency.
- **Mine:** +1 stone and +1 ore per day.
- **Lake:** +1 food, +1 morale.
- **Biome modifiers:** e.g., desert reduces firewood demand but increases water consumption.

## Jobs, Efficiencies & Synergies

Villagers are assigned explicit jobs such as Forager, Hunter, Carpenter, Mason, Builder, Tailor, Smith, or Quartermaster. Each job has:

- Base production/consumption rates.
- Synergy bonuses when complementary roles are staffed (e.g., Builder + Carpenter accelerates construction).
- Caps defined in `src/data/jobs.json` and enforced by `JobManager`.

Villagers **only** perform their assigned role. If prerequisites or inputs are missing, they idle visibly; no silent cross-role work occurs.

## Crafting Targets ("Until X")

Players define targets like `iron_axe → 6` in the Craft Planner. The crafting system calculates daily input demand without allowing resource totals to go negative. Targets pause automatically when the goal is met or when inputs are insufficient.

## Build Queue & Logistics

`BuildQueue` manages pending structures with clear indicators of replacement vs. new builds. Logistics calculations in `src/game/systems/logistics.ts` incorporate carts, pack animals, and road bonuses, affecting ETA and throughput. Deconstruction steps ensure capacities adjust immediately according to the rules above.

## Save/Load & Persistence

- Automatic saves use `localStorage` via helpers in `src/lib/persist.ts`.
- Players may export a `savegame.json` file (`savegame.example.json` provides a template) and import it later after schema validation.
- A **Reset** button clears localStorage and restores the default seed state after confirmation.

## Project Structure

The repository keeps a single authoritative implementation under `src/` and related configuration files:

- `src/` – React UI, game engine systems, and supporting utilities.
- `tests/` – Vitest suites covering the tick order, crafting targets, replacement rules, and schema guards.
- `savegame.example.json` – Sample export illustrating the persistence format.
- `vite.config.ts`, `tsconfig*.json` – Build and tooling configuration pre-set for GitHub Pages deployments.

Legacy alternates (such as the previous `from gpt5` directory) have been removed to avoid drift; the files in the repository root are the canonical versions to edit.

## Development & Preview

Install dependencies once and use Vite for local development:

```bash
npm install
npm run dev
```

To preview the production build locally, run:

```bash
npm run build
npm run preview
```

`npm run build` writes the static site to `docs/`, and `vite preview` serves that build with the same base path behavior you will get in production.

If you see a browser console error such as `main.tsx:1 Failed to load resource: the server responded with a status of 404`, the page is being served without the Vite dev server or the compiled `docs/` bundle. Use `npm run dev` during development or point your static host at the contents of `docs/` (after running `npm run build`). Opening `index.html` directly from the repository root will not work because `/src/main.tsx` is only available when Vite is running.

## Deployment

- The production build lives in `docs/` (see `vite.config.ts`), so any static host that can serve that folder will work. For a quick manual check, run `npx serve docs` or point your web server's document root at `docs/`.
- Vite uses `base: './'` for build commands and `base: '/'` during dev/preview, so assets resolve correctly whether GitHub Pages publishes at `https://<user>.github.io/<repo>/` or you serve the files from a subdirectory.
- The GitHub Pages workflow `.github/workflows/pages.yml` runs on `main`, builds with Node 20, uploads `docs/` as the artifact, and deploys via `actions/deploy-pages@v4`. Ensure the repository's Pages settings are set to **Source: GitHub Actions** to use this pipeline.

## Testing & Contributing

Run linting, tests, and builds before submitting changes:

```bash
npm run lint
npm run test
npm run build
npm run test:build
```

Vitest tests cover deterministic ticks, crafting targets, replacement accounting, and schema guards. Contributions should maintain determinism, update documentation, and respect the single-writer architecture.

`npm run test:build` validates the production bundle and fails if `index.html` ever points at missing assets (e.g., an entry file served from `/src/`). Keep it in CI to catch regressions that would otherwise surface as runtime 404s after deployment.

## Preferred Git Workflow

- **Branch naming:** use short, kebab-case branches with a ticket or topic prefix such as `feature/ui-polish`, `chore/deps-update`, or `fix/save-import`. Avoid working directly on `main`.
- **Commit scope:** keep commits narrowly focused (one feature or fix per commit) with imperative subject lines and meaningful body context when needed. Favor smaller, reviewable commits over broad snapshots.
- **Rebasing:** rebase feature branches onto the latest `main` before opening a PR to keep history linear and avoid merge commits. Resolve conflicts locally and rerun lint/tests after rebasing.

## Code Annotations & Comments

- Prefer self-documenting code through clear naming; add inline comments only where intent or invariants are non-obvious.
- Use block comments to describe algorithms, edge cases, and determinism requirements in engine systems.
- Mark temporary workarounds with `TODO:` plus an owner or ticket when known. Use `FIXME:` only for correctness issues that must be addressed soon.
- Keep comments in sync with code; remove outdated guidance rather than adding more clutter.

## Assets Policy

- Do not commit generated binaries, large media, or build artifacts. If the project needs manual assets, place placeholders under `assets/` with a `.gitkeep` file to keep the directory tracked.
- Checklist for manual assets (add items as needed):
  - [] UI icons (SVG/PNG) sized for light/dark modes
  - [] Background ambience loops (OGG/MP3) under 1 MB
  - [] Save/load example JSONs beyond `savegame.example.json`
  - [] Preview screenshots for README or marketing
- Suggested generation prompts: describe the desired mood, palette, and resolution (e.g., “minimalist line-art camp icon, 64×64, transparent background”) and note any licensing constraints. Save prompts alongside assets when possible (e.g., `assets/prompts.md`).

## Indexing & Search Tips

- Use `rg` for fast searches. Common filters:
  - `rg "tick" src/game` to search gameplay systems (tick order, logistics, crafting targets).
  - `rg --glob "*.ts" "TODO" src` to find TypeScript TODOs.
  - `rg "useState" src/ui` to scan UI interaction patterns.
  - `rg --type-add 'vitest:*.spec.ts' --type vitest "describe" tests` for test suites.
- Directory landmarks:
  - `src/` – Source of truth for the app: `game/` for engine logic, `ui/` for React components, `lib/` for persistence/helpers, `data/` for static JSON, and entry points in `main.tsx`/`App.tsx`.
  - `docs/` – The generated production build; inspect this if you need to verify the final asset layout or debug static hosting issues.
  - Configuration: `vite.config.ts` (build/base/output), `tsconfig*.json` (TypeScript), `.github/workflows/pages.yml` (Pages deploy), and `public/` (static assets copied verbatim).
- Keep new files aligned with these conventions to make navigation predictable.

