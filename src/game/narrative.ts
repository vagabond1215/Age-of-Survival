import { type BiomeId, type FeatureId } from './constants';

const BIOME_INTROS: Record<BiomeId, string> = {
  temperate_forest: 'You wake amidst gentle hills where dew-soaked grasses bend beneath the breeze.',
  taiga: 'You awaken among shadowed firs, the scent of resin and cold loam heavy in the air.',
  rainforest: 'You wake beneath a vaulted canopy, humid air rich with the chorus of unseen life.',
  desert: 'You awaken beneath a merciless sun, sand clinging to your skin as heat shimmers on the horizon.',
  tundra: 'You wake in a world of frost-bent grasses, the horizon a silver ribbon beneath low clouds.',
  alpine: 'You wake to thin, crystalline air as jagged peaks tear through the morning cloud.',
  coast: 'You wake to the crash of waves and salty spray, gulls wheeling overhead.',
  savanna: 'You wake amid tawny grasslands where warm winds carry the scent of distant rain.',
  wetlands: 'You wake with boots sunk in mossy earth, bullfrogs and insects raising a humid chorus.',
  steppe: 'You wake beneath a boundless sky, the plains stretching like a sea of muted gold.',
  volcanic: 'You wake to trembling ground and ember-lit clouds, the air sharp with brimstone.'
};

const FEATURE_DETAILS: Partial<Record<FeatureId, string>> = {
  river: 'A nearby river murmurs over stone, promising fish and clay alike.',
  lake: 'A sheltered lake mirrors the sky, its calm waters hiding fresh stores of life.',
  mine: 'A scar of exposed rock reveals an old mine mouth, whispering of ore and hidden danger.',
  dense_forest: 'An ancient wood crowds close, trunks thick with moss and stories untold.'
};

export function composeAwakeningNarrative(biome: BiomeId, features: FeatureId[]): string {
  const base = BIOME_INTROS[biome] ?? BIOME_INTROS.temperate_forest;
  const extras = features
    .map((feature) => FEATURE_DETAILS[feature])
    .filter((detail): detail is string => Boolean(detail));
  return [base, ...extras].join(' ');
}
