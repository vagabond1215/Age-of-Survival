import { BIOMES, FEATURES, type FeatureId } from '../game/constants';
import { composeAwakeningNarrative } from '../game/narrative';
import { generateMap } from '../game/map';
import { MapTileSchema, createDefaultState, isGameState, type GameState } from '../game/state';

const STORAGE_KEY = 'haven-savegame';

export function saveToLocalStorage(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadFromLocalStorage(): GameState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const migrated = migrateState(parsed);
    if (migrated) {
      return migrated;
    }
    console.warn('Save did not match schema, ignoring');
    return null;
  } catch (error) {
    console.warn('Failed to parse save', error);
    return null;
  }
}

export function exportToFile(state: GameState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'savegame.json';
  link.click();
  URL.revokeObjectURL(url);
}

export async function importFromFile(file: File): Promise<GameState> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const migrated = migrateState(parsed);
  if (!migrated) {
    throw new Error('Imported save failed validation');
  }
  return migrated;
}

export function resetSave(): void {
  localStorage.removeItem(STORAGE_KEY);
}

function isBiome(value: unknown): value is GameState['biome'] {
  return typeof value === 'string' && BIOMES.includes(value as GameState['biome']);
}

function sanitizeFeatures(value: unknown, fallback: GameState['features']): GameState['features'] {
  if (!Array.isArray(value)) {
    return fallback;
  }
  const filtered = value.filter((feature): feature is FeatureId => {
    return typeof feature === 'string' && FEATURES.includes(feature as FeatureId);
  });
  return filtered.length > 0 ? filtered : fallback;
}

function migrateState(value: unknown): GameState | null {
  const defaults = createDefaultState();
  if (!value || typeof value !== 'object') {
    return isGameState(value) ? (value as GameState) : null;
  }

  const candidate = value as Partial<GameState> & Record<string, unknown>;
  const biome = isBiome(candidate.biome) ? candidate.biome : defaults.biome;
  const features = sanitizeFeatures(candidate.features, defaults.features);
  const rngSeed = typeof candidate.rngSeed === 'number' ? candidate.rngSeed : defaults.rngSeed;
  const map = Array.isArray((candidate as { map?: unknown }).map)
    ? (candidate.map as unknown[]).every((tile) => MapTileSchema.safeParse(tile).success)
      ? (candidate.map as GameState['map'])
      : generateMap(biome, features, rngSeed)
    : generateMap(biome, features, rngSeed);

  const hasProgress = typeof candidate.day === 'number' && candidate.day > 1;
  const awakening = candidate.awakening && typeof candidate.awakening === 'object'
    ? {
        seen: Boolean((candidate.awakening as { seen?: unknown }).seen),
        narrative:
          typeof (candidate.awakening as { narrative?: unknown }).narrative === 'string'
            ? ((candidate.awakening as { narrative: string }).narrative)
            : composeAwakeningNarrative(biome, features)
      }
    : {
        seen: hasProgress,
        narrative: composeAwakeningNarrative(biome, features)
      };

  const creationStages = new Set([
    'biome_selection',
    'awaiting_focus',
    'event',
    'arrival',
    'task_assignment',
    'complete'
  ]);
  const creation = candidate.creation && typeof candidate.creation === 'object'
    ? {
        stage: creationStages.has(String((candidate.creation as { stage?: unknown }).stage))
          ? ((candidate.creation as { stage: GameState['creation']['stage'] }).stage)
          : (hasProgress ? 'complete' : defaults.creation.stage),
        selectedBiome: isBiome((candidate.creation as { selectedBiome?: unknown }).selectedBiome)
          ? ((candidate.creation as { selectedBiome: GameState['biome'] }).selectedBiome)
          : null,
        eventId:
          typeof (candidate.creation as { eventId?: unknown }).eventId === 'string'
            ? ((candidate.creation as { eventId: string }).eventId)
            : null,
        chosenThought:
          typeof (candidate.creation as { chosenThought?: unknown }).chosenThought === 'string'
            ? ((candidate.creation as { chosenThought: string }).chosenThought)
            : null,
        helperId:
          typeof (candidate.creation as { helperId?: unknown }).helperId === 'string'
            ? ((candidate.creation as { helperId: string }).helperId)
            : null,
        startingTask:
          (candidate.creation as { startingTask?: unknown }).startingTask === 'gather_materials' ||
          (candidate.creation as { startingTask?: unknown }).startingTask === 'gather_food'
            ? ((candidate.creation as { startingTask: GameState['creation']['startingTask'] }).startingTask)
            : null
      }
    : hasProgress
      ? { ...defaults.creation, stage: 'complete', selectedBiome: biome }
      : defaults.creation;

  const merged: unknown = {
    ...defaults,
    ...candidate,
    biome,
    features,
    rngSeed,
    map,
    awakening,
    creation,
    notifications: Array.isArray(candidate.notifications) ? candidate.notifications : defaults.notifications
  };

  if (isGameState(merged)) {
    return merged;
  }

  return null;
}
