import { type BiomeId, type FeatureId } from '../game/constants';

export interface BiomeDetail {
  id: BiomeId;
  name: string;
  color: string;
  weather: string;
  geography: string;
  resources: string;
  defaultFeatures: FeatureId[];
}

function uniqueFeatures(features: FeatureId[]): FeatureId[] {
  return Array.from(new Set(features));
}

export const BIOME_DETAILS: Record<BiomeId, BiomeDetail> = {
  temperate_forest: {
    id: 'temperate_forest',
    name: 'Temperate Forest',
    color: '#6b8e23',
    weather: 'Gentle rains and crisp breezes keep the air cool and fragrant.',
    geography: 'Rolling hills cradle streams and pockets of oak and birch.',
    resources: 'Balanced access to timber, fresh water, forage, and workable clay.',
    defaultFeatures: uniqueFeatures(['river', 'dense_forest', 'lake'])
  },
  taiga: {
    id: 'taiga',
    name: 'Taiga',
    color: '#2e5339',
    weather: 'Long winters and misty summers shroud the woods in cold vapor.',
    geography: 'Thick conifers crowd frozen bogs and hidden ravines rich in ore.',
    resources: 'Abundant lumber and pelts, with sparse berries and iron veins.',
    defaultFeatures: uniqueFeatures(['dense_forest', 'river', 'mine'])
  },
  rainforest: {
    id: 'rainforest',
    name: 'Rainforest',
    color: '#0f4d2d',
    weather: 'Warm rains fall daily, a humid haze steeped in vibrant life.',
    geography: 'Tiered canopies cloak lagoons and tangled root bridges.',
    resources: 'Exotic herbs, plentiful game, and towering hardwoods for timber.',
    defaultFeatures: uniqueFeatures(['dense_forest', 'lake', 'river'])
  },
  desert: {
    id: 'desert',
    name: 'Desert',
    color: '#d4a94d',
    weather: 'Relentless sun and chill nights test every breath and drop of water.',
    geography: 'Wind-carved dunes hide canyons and rare oases fed by underground streams.',
    resources: 'Sparse forage, hardy game, and exposed mineral seams in the badlands.',
    defaultFeatures: uniqueFeatures(['river', 'mine'])
  },
  tundra: {
    id: 'tundra',
    name: 'Tundra',
    color: '#8fa9c6',
    weather: 'Ice-laden winds scour the plains beneath wide auroras.',
    geography: 'Permafrost fields give way to frozen lakes and jagged ice caves.',
    resources: 'Limited forage with resilient moss, migratory herds, and pockets of ore.',
    defaultFeatures: uniqueFeatures(['lake', 'mine'])
  },
  alpine: {
    id: 'alpine',
    name: 'Alpine',
    color: '#657a8f',
    weather: 'Thin air and sudden storms sweep down from the peaks.',
    geography: 'Knife-edged ridges split glacial valleys and hidden hot springs.',
    resources: 'Stone and ore aplenty, sparse forage, and hardy mountain goats.',
    defaultFeatures: uniqueFeatures(['mine', 'river'])
  },
  coast: {
    id: 'coast',
    name: 'Coast',
    color: '#3f8eb3',
    weather: 'Salt-laced winds and shifting tides mark temperate days and stormy nights.',
    geography: 'Pebbled shores meet tidal marshes and sheltered coves.',
    resources: 'Rich fisheries, driftwood, salt, and clay washed in by the sea.',
    defaultFeatures: uniqueFeatures(['river', 'lake'])
  },
  savanna: {
    id: 'savanna',
    name: 'Savanna',
    color: '#c98e2b',
    weather: 'Searing afternoons yield to star-chilled nights beneath endless skies.',
    geography: 'Golden grasses ripple around acacia stands and watering holes.',
    resources: 'Migratory herds, hardy forage, and clay-rich riverbeds wait to be claimed.',
    defaultFeatures: uniqueFeatures(['river', 'lake'])
  },
  wetlands: {
    id: 'wetlands',
    name: 'Wetlands',
    color: '#2f6f5a',
    weather: 'Heavy mists and warm rains leave the air thick with the scent of peat.',
    geography: 'Reed-choked pools weave between mossy hummocks and cypress groves.',
    resources: 'Medicinal herbs, fish-laden shallows, and dense timber thrive in the mire.',
    defaultFeatures: uniqueFeatures(['lake', 'dense_forest'])
  },
  steppe: {
    id: 'steppe',
    name: 'Steppe',
    color: '#bfa25a',
    weather: 'Dry winds race over the plains, sweeping clouds that rarely break to rain.',
    geography: 'Vast horizons hide rolling swales, exposed ridges, and hidden ravines.',
    resources: 'Sturdy grasses, migratory game, and surface ore seam the open land.',
    defaultFeatures: uniqueFeatures(['river', 'mine'])
  },
  volcanic: {
    id: 'volcanic',
    name: 'Volcanic Expanse',
    color: '#8c3f32',
    weather: 'Sulfurous fumes mingle with ashfall as heat radiates from the ground.',
    geography: 'Blackened slopes crack with lava vents and obsidian-lined ravines.',
    resources: 'Rare minerals, geothermal springs, and resilient fungi survive the fire-scoured soil.',
    defaultFeatures: uniqueFeatures(['mine', 'river'])
  }
};

export const BIOME_LIST: BiomeDetail[] = Object.values(BIOME_DETAILS);

export function getBiomeDetail(id: BiomeId): BiomeDetail {
  return BIOME_DETAILS[id];
}
