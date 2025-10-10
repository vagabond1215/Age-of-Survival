import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDefaultState } from '../src/game/state';
import { loadFromLocalStorage } from '../src/lib/persist';

describe('default state loading', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates fresh copies of mutable collections for each load', () => {
    const first = createDefaultState();
    const second = createDefaultState();

    first.villagers[0].name = 'Altered';
    first.buildings[0].status = 'under_construction';

    expect(second.villagers[0].name).toBe('Aela');
    expect(second.buildings[0].status).toBe('active');
  });

  it('recovers from saves with outdated biome identifiers', () => {
    const legacySave = {
      day: 5,
      biome: 'temperate',
      villagers: [],
      features: [],
      resources: {},
      deltas: {},
      buildings: [],
      buildQueue: [],
      crafting: [],
      logistics: { carts: 0, packAnimals: 0, roadBonus: 0 },
      morale: 0,
      stability: 0,
      readiness: 0,
      notifications: [],
      summonPaused: false,
      pauseOnSummon: false,
      rngSeed: 123,
      lastEventId: null,
      map: [],
      awakening: { seen: false, narrative: '' }
    } satisfies Record<string, unknown>;

    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => JSON.stringify(legacySave)),
      setItem: vi.fn(),
      removeItem: vi.fn()
    });

    const migrated = loadFromLocalStorage();

    expect(migrated).not.toBeNull();
    expect(migrated?.biome).toBe('temperate_forest');
    expect(migrated?.creation.stage).toBe('complete');
    expect(migrated?.creation.selectedBiome).toBe('temperate_forest');
  });
});
