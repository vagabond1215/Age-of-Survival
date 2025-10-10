import { MAP_SIZE, type BiomeId, type FeatureId } from './constants';
import { createRng } from '../lib/rng';

export interface MapTile {
  x: number;
  y: number;
  biome: BiomeId;
  features: FeatureId[];
  label?: string;
}

export function createEmptyMap(biome: BiomeId): MapTile[] {
  const tiles: MapTile[] = [];
  const half = Math.floor(MAP_SIZE / 2);
  for (let y = half; y >= -half; y -= 1) {
    for (let x = -half; x <= half; x += 1) {
      tiles.push({ x, y, biome, features: [] });
    }
  }
  return tiles;
}

function addFeature(tiles: MapTile[], x: number, y: number, feature: FeatureId, label?: string) {
  const tile = tiles.find((cell) => cell.x === x && cell.y === y);
  if (!tile) return;
  if (!tile.features.includes(feature)) {
    tile.features.push(feature);
  }
  if (label) {
    tile.label = label;
  }
}

export function generateMap(biome: BiomeId, features: FeatureId[], seed: number): MapTile[] {
  const tiles = createEmptyMap(biome);
  const rng = createRng(seed ^ 0x9e3779b9);
  const half = Math.floor(MAP_SIZE / 2);

  if (features.includes('river')) {
    const vertical = rng.next() > 0.5;
    const offset = Math.floor(rng.next() * MAP_SIZE) - half;
    for (let i = -half; i <= half; i += 1) {
      if (vertical) {
        addFeature(tiles, offset, i, 'river');
      } else {
        addFeature(tiles, i, offset, 'river');
      }
    }
  }

  if (features.includes('lake')) {
    const lakeSize = 1 + Math.floor(rng.next() * 2);
    const max = half - lakeSize;
    const originX = Math.floor(rng.next() * (max - -max + 1)) + -max;
    const originY = Math.floor(rng.next() * (max - -max + 1)) + -max;
    for (let dx = 0; dx <= lakeSize; dx += 1) {
      for (let dy = 0; dy <= lakeSize; dy += 1) {
        addFeature(tiles, originX + dx, originY + dy, 'lake');
      }
    }
  }

  if (features.includes('dense_forest')) {
    const forestCells = 5;
    for (let i = 0; i < forestCells; i += 1) {
      const x = Math.floor(rng.next() * MAP_SIZE) - half;
      const y = Math.floor(rng.next() * MAP_SIZE) - half;
      if (x === 0 && y === 0) continue;
      addFeature(tiles, x, y, 'dense_forest');
    }
  }

  if (features.includes('mine')) {
    const edge = rng.next() > 0.5 ? half : -half;
    const axis = Math.floor(rng.next() * MAP_SIZE) - half;
    if (rng.next() > 0.5) {
      addFeature(tiles, edge, axis, 'mine', 'Mine');
    } else {
      addFeature(tiles, axis, edge, 'mine', 'Mine');
    }
  }

  for (const tile of tiles) {
    tile.features.sort();
  }

  return tiles;
}
