import { applyProduction } from './systems/production';
import { applyConstruction } from './systems/construction';
import { applyCraftingTargets } from './systems/crafting';
import { applyEvents } from './systems/events';
import { applyLogistics } from './systems/logistics';
import { enforceBedAssignments } from './systems/jobs';
import { createDefaultState, type GameState } from './state';

function cloneState(state: GameState): GameState {
  return structuredClone(state);
}

function applyMorale(state: GameState): GameState {
  const next = cloneState(state);
  const foodTrend = next.deltas.food ?? 0;
  if (foodTrend > 0) {
    next.morale = Math.min(100, next.morale + 1);
  } else if (foodTrend < 0 && next.resources.food <= 0) {
    next.morale = Math.max(0, next.morale - 2);
  }
  next.stability = Math.min(100, Math.max(0, next.stability + (next.morale - 50) / 50));
  next.readiness = Math.min(100, Math.max(0, next.readiness + (next.logistics.carts > 0 ? 1 : 0)));
  return next;
}

export function tickDay(state: GameState, days = 1): GameState {
  let current = cloneState(state);
  for (let i = 0; i < days; i += 1) {
    current = { ...current, notifications: current.notifications.slice(-10) };
    current = applyProduction(current);
    current = applyConstruction(current);
    current = applyCraftingTargets(current);
    current = applyLogistics(current);
    current = applyMorale(current);
    current = applyEvents(current);
    current = enforceBedAssignments(current);
    current.day += 1;
  }
  return current;
}

export { createDefaultState };
