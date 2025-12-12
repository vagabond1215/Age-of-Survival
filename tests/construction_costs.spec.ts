import { describe, expect, it } from 'vitest';
import { createDefaultState } from '../src/game/state';
import { enqueueConstruction } from '../src/game/systems/construction';

describe('construction resource costs', () => {
  it('prevents enqueuing when stock is insufficient', () => {
    const state = createDefaultState();
    const depleted = { ...state, resources: { ...state.resources, logs: 0 } };
    const result = enqueueConstruction(depleted, {
      type: 'new',
      targetSlug: 'log_cabin',
      location: [2, 0],
      baseDays: 2,
      replacementOf: null,
      capacityDelta: 3
    });

    expect(result.buildQueue).toHaveLength(0);
    expect(result.notifications[result.notifications.length - 1]).toContain('Not enough resources');
  });

  it('deducts resources when a build is queued', () => {
    const state = createDefaultState();
    const result = enqueueConstruction(state, {
      type: 'new',
      targetSlug: 'log_cabin',
      location: [2, 1],
      baseDays: 2,
      replacementOf: null,
      capacityDelta: 3
    });

    expect(result.buildQueue).toHaveLength(1);
    expect(result.resources.logs).toBe(state.resources.logs - 8);
    expect(result.resources.firewood).toBe(state.resources.firewood - 6);
  });
});
