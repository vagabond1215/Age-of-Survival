import { useMemo } from 'react';
import { MAP_SIZE, type BiomeId, type FeatureId } from '../game/constants';
import { type Building, type MapTile } from '../game/state';

interface MapGridProps {
  buildings: Building[];
  tiles: MapTile[];
}

const featureIcons: Partial<Record<FeatureId, string>> = {
  river: '〰️',
  lake: '💧',
  mine: '⛏️',
  dense_forest: '🌲'
};

const biomeIcons: Record<BiomeId, string> = {
  temperate_forest: '🌾',
  taiga: '🌲',
  rainforest: '🌳',
  desert: '🏜️',
  tundra: '❄️',
  alpine: '⛰️',
  coast: '🌊',
  savanna: '🦒',
  wetlands: '🪷',
  steppe: '🌾',
  volcanic: '🌋'
};

export function MapGrid({ buildings, tiles }: MapGridProps) {
  const fallbackBiome: BiomeId = tiles[0]?.biome ?? 'temperate_forest';

  const coords = useMemo(() => {
    const half = Math.floor(MAP_SIZE / 2);
    const result: Array<{ x: number; y: number; key: string }> = [];
    for (let y = half; y >= -half; y -= 1) {
      for (let x = -half; x <= half; x += 1) {
        result.push({ x, y, key: `${x},${y}` });
      }
    }
    return result;
  }, []);

  const tileMap = useMemo(() => {
    const map = new Map<string, MapTile>();
    for (const tile of tiles) {
      map.set(`${tile.x},${tile.y}`, tile);
    }
    return map;
  }, [tiles]);

  const buildingMap = useMemo(() => {
    const map = new Map<string, Building>();
    for (const building of buildings) {
      map.set(`${building.x},${building.y}`, building);
    }
    return map;
  }, [buildings]);

  return (
    <div className="panel">
      <h2>Settlement Map</h2>
      <div className="map-grid">
        {coords.map(({ x, y, key }) => {
          const building = buildingMap.get(key);
          const tile = tileMap.get(key) ?? { x, y, biome: fallbackBiome, features: [] };
          const icons = tile.features
            .map((feature) => featureIcons[feature])
            .filter(Boolean)
            .join('');
          const displayIcon = icons || biomeIcons[tile.biome] || biomeIcons[fallbackBiome];
          const isWater = tile.features.some((feature) => feature === 'river' || feature === 'lake');
          const cellClass = `map-cell${isWater ? ' map-cell--water' : ''}`;
          return (
            <div key={key} className={cellClass}>
              {building ? (
                <div>
                  <div>{building.slug}</div>
                  <div className="map-overlay">Tier {building.tier}</div>
                </div>
              ) : (
                <div>
                  <div className="map-icon">{displayIcon}</div>
                  {tile.label && <div className="map-overlay">{tile.label}</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MapGrid;
