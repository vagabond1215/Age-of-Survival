export const RESOURCES = [
  'food',
  'firewood',
  'logs',
  'stone',
  'clay',
  'ore',
  'leather',
  'cloth',
  'tools',
  'armor'
] as const;

export type ResourceId = (typeof RESOURCES)[number];

export const RESOURCE_ICONS: Record<ResourceId, string> = {
  food: '🍞',
  firewood: '🔥',
  logs: '🪵',
  stone: '🪨',
  clay: '🧱',
  ore: '⛏️',
  leather: '🐑',
  cloth: '🧵',
  tools: '🛠️',
  armor: '🛡️'
};

export const BIOMES = [
  'temperate_forest',
  'taiga',
  'rainforest',
  'desert',
  'tundra',
  'alpine',
  'coast',
  'savanna',
  'wetlands',
  'steppe',
  'volcanic'
] as const;
export type BiomeId = (typeof BIOMES)[number];

export const FEATURES = ['river', 'lake', 'mine', 'dense_forest'] as const;
export type FeatureId = (typeof FEATURES)[number];

export const MAP_SIZE = 5;

export const SUMMON_FOOD_THRESHOLD = 20;

export const JOB_SYNERGIES: Record<string, string[]> = {
  builder: ['carpenter', 'mason'],
  carpenter: ['builder'],
  mason: ['builder']
};

export const DEFAULT_BED_CAPACITY = 4;
