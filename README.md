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

## Development

Install dependencies once and use Vite for local development:

```bash
npm install
npm run dev
```

## GitHub Pages Deployment

1. `vite.config.ts` sets `base: '/Age-of-Survival/'` to serve correctly from GitHub Pages.
2. `.github/workflows/pages.yml` builds the project with Node 20 and deploys the `dist` folder using the Pages workflow.
3. Enable GitHub Pages from the **Pages** settings, targeting the workflow-generated deployment.

## Testing & Contributing

Run linting, tests, and builds before submitting changes:

```bash
npm run lint
npm run test
npm run build
```

Vitest tests cover deterministic ticks, crafting targets, replacement accounting, and schema guards. Contributions should maintain determinism, update documentation, and respect the single-writer architecture.

