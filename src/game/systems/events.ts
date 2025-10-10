import { SUMMON_FOOD_THRESHOLD, type ResourceId } from '../constants';
import { type GameState } from '../state';
import { createRng } from '../../lib/rng';

function cloneState(state: GameState): GameState {
  return {
    ...state,
    notifications: [...state.notifications]
  };
}

export function applyEvents(state: GameState): GameState {
  const next = cloneState(state);
  const rng = createRng(state.rngSeed);
  const food = state.resources.food ?? 0;
  const beds = state.buildings.reduce((sum, building) => sum + building.capacity, 0);
  const assignedBeds = state.villagers.filter((v) => v.bed).length;

  if (state.pauseOnSummon && !state.summonPaused && food >= SUMMON_FOOD_THRESHOLD && beds - assignedBeds >= 1) {
    next.summonPaused = true;
    next.notifications.push('Summoning pause: Choose a new villager role.');
  }

  const deficit = Object.entries(state.deltas).find(([resource, value]) => {
    return value < 0 && state.resources[resource as ResourceId] <= 0;
  });
  if (deficit) {
    next.notifications.push(`Deficit warning: ${deficit[0]} trending negative`);
  }

  // Deterministic event example
  const roll = rng.next();
  if (roll < 0.05) {
    next.notifications.push('Calm day. The villagers find solace by the river.');
    next.morale += 1;
    next.lastEventId = `calm-${state.day}`;
  }

  next.rngSeed = rng.seed;
  return next;
}
