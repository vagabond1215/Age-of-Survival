import { SUMMON_FOOD_THRESHOLD, type FeatureId, type ResourceId } from '../constants';
import { clampResource, type GameState } from '../state';
import { createRng, type RNG } from '../../lib/rng';

interface EventDefinition {
  id: string;
  weight: number;
  requirement?: (state: GameState) => boolean;
  resolve: (state: GameState, rng: RNG) => string | null;
}

function cloneState(state: GameState): GameState {
  return {
    ...state,
    resources: { ...state.resources },
    notifications: [...state.notifications],
    buildQueue: state.buildQueue.map((item) => ({ ...item }))
  };
}

const featureSet = (state: GameState): Set<FeatureId> => new Set(state.features);

function adjustResource(state: GameState, resource: ResourceId, delta: number) {
  state.resources[resource] = Math.max(0, Math.round(state.resources[resource] + delta));
  clampResource(state.resources, resource);
}

const EVENT_DEFINITIONS: EventDefinition[] = [
  {
    id: 'calm_morning',
    weight: 2,
    resolve: (state) => {
      state.morale = Math.min(100, state.morale + 2);
      return 'A calm morning settles over Haven. Villagers share quiet stories and morale rises.';
    }
  },
  {
    id: 'forest_cache',
    weight: 1.2,
    requirement: (state) => featureSet(state).has('dense_forest'),
    resolve: (state, rng) => {
      const bonus = 2 + Math.floor(rng.next() * 3);
      adjustResource(state, 'logs', bonus);
      return `Foragers uncover a hidden grove within the forest, hauling back ${bonus} bundles of seasoned logs.`;
    }
  },
  {
    id: 'river_bounty',
    weight: 1.1,
    requirement: (state) => featureSet(state).has('river') || featureSet(state).has('lake') || state.biome === 'coastal',
    resolve: (state, rng) => {
      const fish = 3 + Math.floor(rng.next() * 2);
      adjustResource(state, 'food', fish);
      if (featureSet(state).has('river')) {
        adjustResource(state, 'clay', 1);
      }
      return `A sudden bounty in the water nets ${fish} extra food and fresh clay for the kilns.`;
    }
  },
  {
    id: 'mine_shift',
    weight: 0.8,
    requirement: (state) => featureSet(state).has('mine'),
    resolve: (state, rng) => {
      const find = rng.next();
      if (find > 0.4) {
        adjustResource(state, 'ore', 1);
        adjustResource(state, 'stone', 2);
        state.readiness = Math.min(100, state.readiness + 1);
        return 'A miner strikes a rich vein, bringing up glittering ore and sturdy stone. Readiness improves.';
      }
      const queueItem = state.buildQueue.find((item) => item.daysRemaining > 0);
      if (queueItem) {
        queueItem.daysRemaining += 1;
      }
      state.morale = Math.max(0, state.morale - 3);
      return 'Loose shale collapses in the mine. Work slows as crews shore the tunnels, dampening morale.';
    }
  },
  {
    id: 'wandering_trader',
    weight: 0.9,
    requirement: (state) => state.resources.food >= 10,
    resolve: (state, rng) => {
      const offerTools = rng.next() > 0.5;
      const tradeFood = 3;
      adjustResource(state, 'food', -tradeFood);
      if (offerTools) {
        adjustResource(state, 'tools', 1);
        return 'A wandering trader swaps a gleaming tool for surplus provisions.';
      }
      adjustResource(state, 'cloth', 1);
      return 'A wanderer trades woven cloth for your shared rations, promising to spread word of Haven.';
    }
  },
  {
    id: 'desert_storm',
    weight: 0.7,
    requirement: (state) => state.biome === 'desert',
    resolve: (state) => {
      adjustResource(state, 'food', -2);
      state.morale = Math.max(0, state.morale - 2);
      return 'A scouring sandstorm batters the camp. Supplies dwindle and tempers fray.';
    }
  },
  {
    id: 'boreal_aurora',
    weight: 0.6,
    requirement: (state) => state.biome === 'boreal',
    resolve: (state) => {
      state.morale = Math.min(100, state.morale + 4);
      state.stability = Math.min(100, state.stability + 1);
      return 'Auroras dance above the pines, stirring awe among the villagers. Stability grows from shared wonder.';
    }
  },
  {
    id: 'alpine_rockfall',
    weight: 0.6,
    requirement: (state) => state.biome === 'alpine',
    resolve: (state) => {
      adjustResource(state, 'stone', -2);
      state.readiness = Math.max(0, state.readiness - 2);
      return 'A rockfall thunders down from the high slopes, scattering your watch and consuming stored stone.';
    }
  }
];

function pickEvent(events: EventDefinition[], rng: RNG): EventDefinition | null {
  if (events.length === 0) return null;
  const totalWeight = events.reduce((sum, event) => sum + event.weight, 0);
  const threshold = rng.next() * totalWeight;
  let running = 0;
  for (const event of events) {
    running += event.weight;
    if (threshold <= running) {
      return event;
    }
  }
  return events[events.length - 1];
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

  const eventRoll = rng.next();
  if (eventRoll < 0.35) {
    const eligible = EVENT_DEFINITIONS.filter((event) => {
      if (event.id === state.lastEventId) return false;
      return event.requirement ? event.requirement(next) : true;
    });
    const chosen = pickEvent(eligible, rng);
    if (chosen) {
      const summary = chosen.resolve(next, rng);
      if (summary) {
        next.notifications.push(summary);
      }
      next.lastEventId = chosen.id;
    }
  }

  next.rngSeed = rng.seed;
  return next;
}
