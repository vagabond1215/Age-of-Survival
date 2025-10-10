import { describe, expect, it } from 'vitest';
import { GameStateSchema, createDefaultState, isGameState } from '../src/game/state';

describe('state guards', () => {
  it('accepts default state', () => {
    const state = createDefaultState();
    expect(isGameState(state)).toBe(true);
    expect(() => GameStateSchema.parse(state)).not.toThrow();
  });

  it('rejects invalid states', () => {
    const invalid = { ...createDefaultState(), day: -5 };
    expect(isGameState(invalid)).toBe(false);
    expect(() => GameStateSchema.parse(invalid)).toThrow();
  });
});
