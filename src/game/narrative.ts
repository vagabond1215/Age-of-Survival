import { type BiomeId, type FeatureId } from './constants';

const BIOME_INTROS: Record<BiomeId, string> = {
  temperate: 'You wake amidst gentle hills where dew-soaked grasses bend beneath the breeze.',
  boreal: 'You awaken among shadowed firs, the scent of resin and cold loam heavy in the air.',
  desert: 'You awaken beneath a merciless sun, sand clinging to your skin as heat shimmers on the horizon.',
  coastal: 'You wake to the crash of waves and salty spray, gulls wheeling overhead.',
  alpine: 'You wake to thin, crystalline air as jagged peaks tear through the morning cloud.'
};

const FEATURE_DETAILS: Partial<Record<FeatureId, string>> = {
  river: 'A nearby river murmurs over stone, promising fish and clay alike.',
  lake: 'A sheltered lake mirrors the sky, its calm waters hiding fresh stores of life.',
  mine: 'A scar of exposed rock reveals an old mine mouth, whispering of ore and hidden danger.',
  dense_forest: 'An ancient wood crowds close, trunks thick with moss and stories untold.'
};

export function composeAwakeningNarrative(biome: BiomeId, features: FeatureId[]): string {
  const base = BIOME_INTROS[biome] ?? BIOME_INTROS.temperate;
  const extras = features
    .map((feature) => FEATURE_DETAILS[feature])
    .filter((detail): detail is string => Boolean(detail));
  return [base, ...extras].join(' ');
}
