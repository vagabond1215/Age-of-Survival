import { describe, expect, it } from 'vitest';
import { createDefaultState } from '../src/game/state';
import { tickDay } from '../src/game/engine';

function clone<T>(value: T): T {
  return structuredClone(value);
}

describe('day tick determinism', () => {
  it('produces identical results for the same seed', () => {
    const initial = createDefaultState();
    const firstRun = tickDay(initial);
    const secondRun = tickDay(clone(initial));
    expect(secondRun).toEqual(firstRun);
  });

  it('advances resources predictably across multiple days', () => {
    const initial = createDefaultState();
    const dayOne = tickDay(initial);
    const dayTwo = tickDay(dayOne);
    expect(dayTwo.day).toBe(dayOne.day + 1);
    expect(dayTwo.resources.food).toBeGreaterThanOrEqual(0);
  });
});
