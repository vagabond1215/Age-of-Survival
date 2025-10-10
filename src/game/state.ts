import { z } from 'zod';
import jobs from '../data/jobs.json';
import { BIOMES, DEFAULT_BED_CAPACITY, FEATURES, MAP_SIZE, RESOURCES, type BiomeId, type FeatureId, type ResourceId } from './constants';
import { generateMap } from './map';
import { composeAwakeningNarrative } from './narrative';

const resourceIdSchema = z.enum(RESOURCES);
const biomeIdSchema = z.enum(BIOMES);
const featureIdSchema = z.enum(FEATURES);

export const ResourceRecordSchema = z.record(resourceIdSchema, z.number());

export const VillagerSchema = z.object({
  id: z.string(),
  name: z.string(),
  jobId: z.string(),
  efficiency: z.number().min(0),
  bed: z.string().nullable()
});
export type Villager = z.infer<typeof VillagerSchema>;

export const BuildingSchema = z.object({
  id: z.string(),
  slug: z.string(),
  x: z.number().int(),
  y: z.number().int(),
  tier: z.number().int().min(1),
  status: z.enum(['active', 'under_construction']),
  capacity: z.number().min(0)
});
export type Building = z.infer<typeof BuildingSchema>;

export const BuildQueueItemSchema = z.object({
  id: z.string(),
  type: z.enum(['new', 'replacement', 'renovation', 'deconstruction']),
  targetSlug: z.string(),
  location: z.tuple([z.number().int(), z.number().int()]),
  daysRemaining: z.number().int().min(0),
  replacementOf: z.string().nullable(),
  capacityDelta: z.number()
});
export type BuildQueueItem = z.infer<typeof BuildQueueItemSchema>;

export const CraftTargetSchema = z.object({
  recipeId: z.string(),
  targetCount: z.number().min(0),
  onHand: z.number().min(0)
});
export type CraftTarget = z.infer<typeof CraftTargetSchema>;

export const LogisticsStateSchema = z.object({
  carts: z.number().min(0),
  packAnimals: z.number().min(0),
  roadBonus: z.number().min(0)
});
export type LogisticsState = z.infer<typeof LogisticsStateSchema>;

export const MapTileSchema = z.object({
  x: z.number().int(),
  y: z.number().int(),
  biome: biomeIdSchema,
  features: z.array(featureIdSchema),
  label: z.string().optional()
});
export type MapTile = z.infer<typeof MapTileSchema>;

export const AwakeningStateSchema = z.object({
  seen: z.boolean(),
  narrative: z.string()
});
export type AwakeningState = z.infer<typeof AwakeningStateSchema>;

export const GameStateSchema = z.object({
  day: z.number().int().min(1),
  biome: biomeIdSchema,
  features: z.array(featureIdSchema),
  villagers: z.array(VillagerSchema),
  jobs: z.array(z.string()),
  resources: ResourceRecordSchema,
  deltas: ResourceRecordSchema,
  buildings: z.array(BuildingSchema),
  buildQueue: z.array(BuildQueueItemSchema),
  crafting: z.array(CraftTargetSchema),
  logistics: LogisticsStateSchema,
  morale: z.number(),
  stability: z.number(),
  readiness: z.number(),
  notifications: z.array(z.string()),
  summonPaused: z.boolean(),
  pauseOnSummon: z.boolean(),
  rngSeed: z.number().int(),
  lastEventId: z.string().nullable(),
  map: z.array(MapTileSchema),
  awakening: AwakeningStateSchema
});
export type GameState = z.infer<typeof GameStateSchema>;

export const jobMap = Object.fromEntries(jobs.map((job) => [job.id, job] as const));

export const DEFAULT_RESOURCES: Record<ResourceId, number> = RESOURCES.reduce(
  (acc, id) => {
    acc[id] = 0;
    return acc;
  },
  {} as Record<ResourceId, number>
);

export const DEFAULT_DELTAS: Record<ResourceId, number> = RESOURCES.reduce(
  (acc, id) => {
    acc[id] = 0;
    return acc;
  },
  {} as Record<ResourceId, number>
);

export const DEFAULT_BUILDINGS: Building[] = [
  {
    id: 'hall',
    slug: 'town_hall',
    x: 0,
    y: 0,
    tier: 1,
    status: 'active',
    capacity: DEFAULT_BED_CAPACITY
  }
];

export const DEFAULT_VILLAGERS: Villager[] = [
  { id: 'v-1', name: 'Aela', jobId: 'forager', efficiency: 1, bed: 'hall' },
  { id: 'v-2', name: 'Bran', jobId: 'woodcutter', efficiency: 1, bed: 'hall' },
  { id: 'v-3', name: 'Caro', jobId: 'hunter', efficiency: 0.8, bed: 'hall' }
];

function cloneVillagers(): Villager[] {
  return DEFAULT_VILLAGERS.map((villager) => ({ ...villager }));
}

function cloneBuildings(): Building[] {
  return DEFAULT_BUILDINGS.map((building) => ({ ...building }));
}

export function createDefaultResources(): Record<ResourceId, number> {
  const stock: Record<ResourceId, number> = { ...DEFAULT_RESOURCES };
  stock.food = 30;
  stock.logs = 10;
  stock.stone = 8;
  stock.ore = 4;
  stock.leather = 2;
  stock.tools = 2;
  stock.firewood = 12;
  stock.cloth = 1;
  stock.armor = 0;
  stock.clay = 4;
  return stock;
}

export function createDefaultState(): GameState {
  const defaultFeatures: FeatureId[] = ['river', 'dense_forest', 'mine'];
  const rngSeed = 12345;
  return {
    day: 1,
    biome: 'temperate',
    features: defaultFeatures,
    villagers: cloneVillagers(),
    jobs: jobs.map((job) => job.id),
    resources: createDefaultResources(),
    deltas: { ...DEFAULT_DELTAS },
    buildings: cloneBuildings(),
    buildQueue: [],
    crafting: [],
    logistics: { carts: 1, packAnimals: 0, roadBonus: 1 },
    morale: 50,
    stability: 50,
    readiness: 10,
    notifications: ['Welcome to the Village of Haven.'],
    summonPaused: true,
    pauseOnSummon: true,
    rngSeed,
    lastEventId: null,
    map: generateMap('temperate', defaultFeatures, rngSeed),
    awakening: {
      seen: false,
      narrative: composeAwakeningNarrative('temperate', defaultFeatures)
    }
  };
}

export function isGameState(value: unknown): value is GameState {
  return GameStateSchema.safeParse(value).success;
}

export function clampResource(stock: Record<ResourceId, number>, id: ResourceId): void {
  if (!Number.isFinite(stock[id])) {
    stock[id] = 0;
  }
  if (stock[id] < 0) {
    stock[id] = 0;
  }
}

export function normaliseDeltas(deltas: Record<ResourceId, number>): Record<ResourceId, number> {
  const copy: Record<ResourceId, number> = { ...DEFAULT_DELTAS };
  for (const key of RESOURCES) {
    copy[key] = deltas[key] ?? 0;
  }
  return copy;
}

export type ResourceMap = Record<ResourceId, number>;
export type FeatureSet = FeatureId[];
export type BiomeSelection = BiomeId;

export function withinMap(x: number, y: number): boolean {
  return x >= -(MAP_SIZE - 1) / 2 && x <= (MAP_SIZE - 1) / 2 && y >= -(MAP_SIZE - 1) / 2 && y <= (MAP_SIZE - 1) / 2;
}
