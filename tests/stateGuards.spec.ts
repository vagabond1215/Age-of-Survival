import { describe, expect, it } from 'vitest';
import { MAP_SIZE } from '../src/game/constants';
import { GameStateSchema, createDefaultState, isGameState } from '../src/game/state';

describe('state guards', () => {
  it('accepts default state', () => {
    const state = createDefaultState();
    expect(isGameState(state)).toBe(true);
    expect(() => GameStateSchema.parse(state)).not.toThrow();
    expect(state.map).toHaveLength(MAP_SIZE * MAP_SIZE);
    expect(state.awakening.seen).toBe(false);
  });

  it('rejects invalid states', () => {
    const invalid = { ...createDefaultState(), day: -5 };
    expect(isGameState(invalid)).toBe(false);
    expect(() => GameStateSchema.parse(invalid)).toThrow();
  });
});
