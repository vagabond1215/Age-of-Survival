import { describe, expect, it } from 'vitest';
import { createDefaultState } from '../src/game/state';
import { ensureCraftTarget, applyCraftingTargets } from '../src/game/systems/crafting';

describe('craft planner targets', () => {
  it('crafts toward target without going negative', () => {
    let state = createDefaultState();
    state.resources.ore = 4;
    state.resources.logs = 4;
    state.villagers[0].jobId = 'smith';
    state.buildings.push({
      id: 'forge',
      slug: 'stone_hall',
      x: 0,
      y: 1,
      tier: 1,
      status: 'active',
      capacity: 0
    });
    state = ensureCraftTarget(state, 'iron_axe', 2);
    state = applyCraftingTargets(state);
    expect(state.resources.ore).toBe(2);
    expect(state.resources.logs).toBe(3);
    const target = state.crafting.find((entry) => entry.recipeId === 'iron_axe');
    expect(target?.onHand).toBe(1);
  });

  it('pauses crafting if inputs would go negative', () => {
    let state = createDefaultState();
    state.resources.ore = 1;
    state.resources.logs = 1;
    state.villagers[0].jobId = 'smith';
    state.buildings.push({
      id: 'forge',
      slug: 'stone_hall',
      x: 0,
      y: 1,
      tier: 1,
      status: 'active',
      capacity: 0
    });
    state = ensureCraftTarget(state, 'iron_axe', 2);
    state = applyCraftingTargets(state);
    expect(state.resources.ore).toBe(1);
    expect(state.resources.logs).toBe(1);
    const target = state.crafting.find((entry) => entry.recipeId === 'iron_axe');
    expect(target?.onHand).toBe(0);
  });
});
