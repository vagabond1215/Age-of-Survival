import biomes from '../../data/biomes.json';
import jobs from '../../data/jobs.json';
import { FEATURES, type FeatureId, type ResourceId } from '../constants';
import { clampResource, type GameState } from '../state';

const biomeMap = new Map(biomes.map((b) => [b.id, b.modifiers as Record<ResourceId, number>]));
const jobIndex = new Map(jobs.map((job) => [job.id, job]));

const featureProductionBonus: Record<FeatureId, Partial<Record<ResourceId, number>>> = {
  river: { food: 2, clay: 1 },
  lake: { food: 1 },
  mine: { stone: 1, ore: 1 },
  dense_forest: { logs: 2 }
};

export function applyProduction(state: GameState): GameState {
  const next: GameState = {
    ...state,
    resources: { ...state.resources },
    deltas: { ...state.deltas }
  };
  const gains: Partial<Record<ResourceId, number>> = {};
  const uses: Partial<Record<ResourceId, number>> = {};

  for (const villager of state.villagers) {
    const job = jobIndex.get(villager.jobId);
    if (!job) continue;
    for (const [resource, value] of Object.entries(job.production ?? {})) {
      const amount = value * villager.efficiency;
      gains[resource as ResourceId] = (gains[resource as ResourceId] ?? 0) + amount;
    }
  }

  for (const villager of state.villagers) {
    const job = jobIndex.get(villager.jobId);
    if (!job) continue;
    for (const [resource, value] of Object.entries(job.consumption ?? {})) {
      const amount = value * villager.efficiency;
      uses[resource as ResourceId] = (uses[resource as ResourceId] ?? 0) + amount;
    }
  }

  const biomeModifier = biomeMap.get(state.biome) ?? {};
  for (const [resource, amount] of Object.entries(biomeModifier)) {
    gains[resource as ResourceId] = (gains[resource as ResourceId] ?? 0) + amount;
  }

  for (const feature of state.features) {
    if (!FEATURES.includes(feature)) continue;
    const bonus = featureProductionBonus[feature];
    for (const [resource, amount] of Object.entries(bonus ?? {})) {
      gains[resource as ResourceId] = (gains[resource as ResourceId] ?? 0) + amount;
    }
  }

  for (const resource of Object.keys(state.resources) as ResourceId[]) {
    const gain = gains[resource] ?? 0;
    const use = uses[resource] ?? 0;
    const net = gain - use;
    next.deltas[resource] = net;
    next.resources[resource] = Math.max(0, next.resources[resource] + net);
    clampResource(next.resources, resource);
  }

  return next;
}

export function applyConsumption(state: GameState): GameState {
  // consumption already reflected in applyProduction via job consumption
  return state;
}
