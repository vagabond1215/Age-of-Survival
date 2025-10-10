import { describe, expect, it } from 'vitest';
import { createDefaultState } from '../src/game/state';
import {
  enqueueConstruction,
  applyConstruction,
  computeReplacementDelta,
  computeRenovationDelta,
  computeDeconstructionDelta
} from '../src/game/systems/construction';

function buildReplacementState() {
  const base = createDefaultState();
  return base;
}

describe('construction capacity rules', () => {
  it('applies replacement by removing old capacity until completion', () => {
    let state = buildReplacementState();
    const hall = state.buildings.find((b) => b.id === 'hall');
    expect(hall?.capacity).toBe(4);
    state = enqueueConstruction(state, {
      type: 'replacement',
      targetSlug: 'stone_hall',
      location: [0, 0],
      baseDays: 1,
      replacementOf: 'hall',
      capacityDelta: computeReplacementDelta(4, 6)
    });
    const queuedHall = state.buildings.find((b) => b.id === 'hall');
    expect(queuedHall?.capacity).toBe(0);
    state = applyConstruction(state);
    const upgraded = state.buildings.find((b) => b.id === 'hall');
    expect(upgraded?.capacity).toBe(6);
    expect(upgraded?.status).toBe('active');
  });

  it('applies renovation as net gain only', () => {
    let state = buildReplacementState();
    state = enqueueConstruction(state, {
      type: 'renovation',
      targetSlug: 'town_hall',
      location: [0, 0],
      baseDays: 1,
      replacementOf: 'hall',
      capacityDelta: computeRenovationDelta(4, 6)
    });
    state = applyConstruction(state);
    const hall = state.buildings.find((b) => b.id === 'hall');
    expect(hall?.capacity).toBe(6);
  });

  it('removes capacity during deconstruction', () => {
    let state = buildReplacementState();
    state = enqueueConstruction(state, {
      type: 'deconstruction',
      targetSlug: 'hall_ruins',
      location: [0, 0],
      baseDays: 1,
      replacementOf: 'hall',
      capacityDelta: computeDeconstructionDelta(4)
    });
    const hall = state.buildings.find((b) => b.id === 'hall');
    expect(hall?.capacity).toBe(0);
    state = applyConstruction(state);
    expect(state.buildings.find((b) => b.id === 'hall')).toBeUndefined();
  });
});
