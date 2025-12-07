import { describe, expect, it } from 'vitest';
import { tickDay } from '../src/game/engine';
import { createDefaultState, type GameState } from '../src/game/state';

function baseState(): GameState {
  const state = createDefaultState();
  return {
    ...state,
    villagers: [],
    features: [],
    buildQueue: [],
    crafting: [],
    deltas: { ...state.deltas },
    resources: { ...state.resources },
    rngSeed: 294
  };
}

describe('morale adjustments', () => {
  it('increases morale with positive food deltas and clamps at 100', () => {
    const state = baseState();
    state.biome = 'tundra';
    state.morale = 99;
    state.resources.food = 10;
    state.villagers = [
      { id: 'v-boost', name: 'Positive Pete', jobId: 'forager', efficiency: 1, bed: 'hall' }
    ];

    const snapshot = structuredClone(state);
    const result = tickDay(state);

    expect(state).toEqual(snapshot);
    expect(result.deltas.food).toBeGreaterThan(0);
    expect(result.morale).toBe(100);
  });

  it('drops morale by two when food is depleted and the delta is negative', () => {
    const state = baseState();
    state.biome = 'desert';
    state.morale = 1;
    state.resources.food = 0;

    const result = tickDay(state);

    expect(result.deltas.food).toBeLessThan(0);
    expect(result.resources.food).toBe(0);
    expect(result.morale).toBe(0);
  });

  it('updates stability and readiness based on morale and logistics', () => {
    const state = baseState();
    state.biome = 'tundra';
    state.morale = 60;
    state.stability = 40;
    state.readiness = 99;
    state.logistics = { ...state.logistics, carts: 2 };

    const result = tickDay(state);

    const expectedStability = Math.min(100, Math.max(0, state.stability + (state.morale - 50) / 50));

    expect(result.morale).toBe(state.morale);
    expect(result.stability).toBeCloseTo(expectedStability);
    expect(result.readiness).toBe(100);
  });

  it('leaves saved snapshots immutable after ticking', () => {
    const state = baseState();
    state.biome = 'desert';
    state.morale = 20;
    state.resources.food = 0;

    const snapshot = structuredClone(state);
    tickDay(state);

    expect(state).toEqual(snapshot);
  });
});
