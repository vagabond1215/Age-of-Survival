import { describe, expect, it } from 'vitest';
import { tickDay } from '../src/game/engine';
import { createDefaultState } from '../src/game/state';

const clone = <T>(value: T): T => structuredClone(value);

describe('cloneState deep cloning', () => {
  it('prevents mutations from leaking across ticks or into the original state', () => {
    const initial = createDefaultState();
    const originalSnapshot = clone(initial);

    const ticked = tickDay(initial);

    ticked.resources.food = 999;
    ticked.deltas.food = -999;
    ticked.logistics.carts = 5;
    ticked.awakening.narrative = 'altered';
    ticked.creation.stage = 'complete';
    ticked.features.push(ticked.features[0]);
    ticked.jobs.splice(0, 1);
    ticked.map[0].label = 'changed terrain';
    ticked.villagers[0].name = 'Altered Villager';
    ticked.buildings[0].capacity = 999;
    ticked.notifications.push('mutated');
    ticked.crafting.push({ recipeId: 'test', targetCount: 1, onHand: 0 });

    expect(initial).toEqual(originalSnapshot);

    const secondTick = tickDay(initial);
    const expectedSecondTick = tickDay(originalSnapshot);

    expect(secondTick).toEqual(expectedSecondTick);
  });
});
