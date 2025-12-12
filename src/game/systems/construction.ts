import { DEFAULT_BED_CAPACITY, type ResourceId } from '../constants';
import { clampResource, type BuildQueueItem, type Building, type GameState, type ResourceMap } from '../state';
import { getLogisticsSpeed } from './logistics';

export type ConstructionKind = BuildQueueItem['type'];

type ResourceCost = Partial<ResourceMap>;

const BUILDING_COSTS: Record<string, ResourceCost> = {
  makeshift_shelter: { logs: 6, cloth: 1 },
  log_cabin: { logs: 8, firewood: 6 },
  stone_hall: { logs: 6, stone: 6, tools: 1 },
  town_hall: { logs: 4, stone: 6, cloth: 1, tools: 1 },
  hall_ruins: {}
};

function cloneState(state: GameState): GameState {
  return {
    ...state,
    resources: { ...state.resources },
    deltas: { ...state.deltas },
    villagers: state.villagers.map((v) => ({ ...v })),
    buildings: state.buildings.map((b) => ({ ...b })),
    buildQueue: state.buildQueue.map((b) => ({ ...b })),
    crafting: state.crafting.map((c) => ({ ...c })),
    notifications: [...state.notifications]
  };
}

export interface EnqueueOptions {
  type: ConstructionKind;
  targetSlug: string;
  location: [number, number];
  baseDays: number;
  replacementOf?: string | null;
  capacityDelta: number;
}

export function getConstructionCost(slug: string): ResourceCost {
  return BUILDING_COSTS[slug] ?? {};
}

function getMissingResources(resources: ResourceMap, cost: ResourceCost): Array<{ id: ResourceId; deficit: number }> {
  const missing: Array<{ id: ResourceId; deficit: number }> = [];
  for (const [id, amount] of Object.entries(cost)) {
    const resourceId = id as ResourceId;
    const needed = amount ?? 0;
    if (needed <= 0) continue;
    const have = resources[resourceId] ?? 0;
    if (have < needed) {
      missing.push({ id: resourceId, deficit: needed - have });
    }
  }
  return missing;
}

function deductResources(resources: ResourceMap, cost: ResourceCost): void {
  for (const [id, amount] of Object.entries(cost)) {
    const resourceId = id as ResourceId;
    const delta = amount ?? 0;
    if (delta <= 0) continue;
    resources[resourceId] = (resources[resourceId] ?? 0) - delta;
    clampResource(resources, resourceId);
  }
}

function ensureBuilding(next: GameState, id: string): Building | undefined {
  return next.buildings.find((b) => b.id === id);
}

export function canAffordConstruction(resources: ResourceMap, targetSlug: string): boolean {
  const cost = getConstructionCost(targetSlug);
  return getMissingResources(resources, cost).length === 0;
}

export function getConstructionShortages(
  resources: ResourceMap,
  targetSlug: string
): Array<{ id: ResourceId; deficit: number }> {
  const cost = getConstructionCost(targetSlug);
  return getMissingResources(resources, cost);
}

export function enqueueConstruction(state: GameState, options: EnqueueOptions): GameState {
  const cost = getConstructionCost(options.targetSlug);
  const missing = getMissingResources(state.resources, cost);
  if (missing.length > 0) {
    const message = `Not enough resources to build ${options.targetSlug}: ${missing
      .map((item) => `${item.deficit} ${item.id}`)
      .join(', ')}`;
    if (state.notifications.includes(message)) {
      return state;
    }
    return { ...state, notifications: [...state.notifications, message] };
  }

  const next = cloneState(state);
  deductResources(next.resources, cost);
  const id = `build-${state.day}-${state.buildQueue.length + 1}`;
  const queueItem: BuildQueueItem = {
    id,
    type: options.type,
    targetSlug: options.targetSlug,
    location: options.location,
    daysRemaining: Math.max(0, Math.round(options.baseDays)),
    replacementOf: options.replacementOf ?? null,
    capacityDelta: options.capacityDelta
  };

  if (options.type === 'new') {
    next.buildings.push({
      id,
      slug: options.targetSlug,
      x: options.location[0],
      y: options.location[1],
      tier: 1,
      status: 'under_construction',
      capacity: 0
    });
  }

  if (options.type === 'replacement' && options.replacementOf) {
    const building = ensureBuilding(next, options.replacementOf);
    if (!building) {
      throw new Error('Replacement target missing');
    }
    building.status = 'under_construction';
    building.capacity = 0;
    building.slug = `${building.slug}-replaced`;
  }

  if (options.type === 'renovation' && options.replacementOf) {
    const building = ensureBuilding(next, options.replacementOf);
    if (!building) {
      throw new Error('Renovation target missing');
    }
    building.status = 'under_construction';
  }

  if (options.type === 'deconstruction' && options.replacementOf) {
    const building = ensureBuilding(next, options.replacementOf);
    if (!building) {
      throw new Error('Deconstruction target missing');
    }
    building.status = 'under_construction';
    building.capacity = 0;
  }

  next.buildQueue.push(queueItem);
  return next;
}

export function applyConstruction(state: GameState): GameState {
  const next = cloneState(state);
  const speed = getLogisticsSpeed(state.logistics);

  for (const item of next.buildQueue) {
    item.daysRemaining = Math.max(0, item.daysRemaining - speed);
    if (item.daysRemaining > 0) continue;

    if (item.type === 'new') {
      const building = next.buildings.find((b) => b.id === item.id);
      if (building) {
        building.status = 'active';
        building.capacity = item.capacityDelta;
      } else {
        next.buildings.push({
          id: item.id,
          slug: item.targetSlug,
          x: item.location[0],
          y: item.location[1],
          tier: 1,
          status: 'active',
          capacity: item.capacityDelta || DEFAULT_BED_CAPACITY
        });
      }
    }

    if (item.type === 'replacement' && item.replacementOf) {
      const building = ensureBuilding(next, item.replacementOf);
      if (building) {
        building.slug = item.targetSlug;
        building.status = 'active';
        building.capacity = item.capacityDelta;
      }
    }

    if (item.type === 'renovation' && item.replacementOf) {
      const building = ensureBuilding(next, item.replacementOf);
      if (building) {
        building.status = 'active';
        building.capacity = Math.max(0, building.capacity + item.capacityDelta);
      }
    }

    if (item.type === 'deconstruction' && item.replacementOf) {
      const index = next.buildings.findIndex((b) => b.id === item.replacementOf);
      if (index >= 0) {
        next.buildings.splice(index, 1);
      }
    }

    next.notifications.push(`Construction completed: ${item.targetSlug}`);
  }

  next.buildQueue = next.buildQueue.filter((item) => item.daysRemaining > 0);
  return next;
}

export function computeReplacementDelta(oldCap: number, newCap: number): number {
  return newCap;
}

export function computeRenovationDelta(oldCap: number, newCap: number): number {
  return newCap - oldCap;
}

export function computeDeconstructionDelta(oldCap: number): number {
  return -oldCap;
}
