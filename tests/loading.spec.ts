import { describe, expect, it } from 'vitest';
import { createDefaultState } from '../src/game/state';

describe('default state loading', () => {
  it('creates fresh copies of mutable collections for each load', () => {
    const first = createDefaultState();
    const second = createDefaultState();

    first.villagers[0].name = 'Altered';
    first.buildings[0].status = 'under_construction';

    expect(second.villagers[0].name).toBe('Aela');
    expect(second.buildings[0].status).toBe('active');
  });
});
