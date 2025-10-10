import { RESOURCE_ICONS, RESOURCES, type ResourceId } from '../game/constants';

interface ResourceBarProps {
  resources: Record<ResourceId, number>;
  deltas: Record<ResourceId, number>;
}

function formatDelta(value: number): string {
  if (value === 0) return '0';
  return value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1);
}

export function ResourceBar({ resources, deltas }: ResourceBarProps) {
  return (
    <div className="panel resource-bar">
      {RESOURCES.map((resource) => {
        const stock = resources[resource] ?? 0;
        const delta = deltas[resource] ?? 0;
        const tip = `${formatDelta(Math.max(0, delta))} gain\n${formatDelta(Math.min(0, delta))} use\n= ${formatDelta(delta)}`;
        return (
          <div key={resource} className="tooltip" data-tip={tip}>
            <strong>{RESOURCE_ICONS[resource]}</strong> {stock.toFixed(1)}
          </div>
        );
      })}
    </div>
  );
}

export default ResourceBar;
