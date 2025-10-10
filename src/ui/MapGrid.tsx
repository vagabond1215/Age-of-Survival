import { MAP_SIZE, type FeatureId } from '../game/constants';
import { type Building } from '../game/state';

interface MapGridProps {
  buildings: Building[];
  features: FeatureId[];
}

const featureIcons: Partial<Record<FeatureId, string>> = {
  river: '〰️',
  lake: '💧',
  mine: '⛏️',
  dense_forest: '🌲'
};

export function MapGrid({ buildings, features }: MapGridProps) {
  const half = Math.floor(MAP_SIZE / 2);
  const coords: Array<{ x: number; y: number; key: string }> = [];
  for (let y = half; y >= -half; y -= 1) {
    for (let x = -half; x <= half; x += 1) {
      coords.push({ x, y, key: `${x},${y}` });
    }
  }
  return (
    <div className="panel">
      <h2>Settlement Map</h2>
      <div className="map-grid">
        {coords.map(({ x, y, key }) => {
          const building = buildings.find((b) => b.x === x && b.y === y);
          return (
            <div key={key} className="map-cell">
              {building ? (
                <div>
                  <div>{building.slug}</div>
                  <div className="map-overlay">Tier {building.tier}</div>
                </div>
              ) : (
                <span>
                  {features
                    .map((feature) => featureIcons[feature])
                    .filter(Boolean)
                    .join('') || '.'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MapGrid;
