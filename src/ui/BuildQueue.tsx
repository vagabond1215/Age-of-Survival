import { type BuildQueueItem, type Building } from '../game/state';

interface BuildQueueProps {
  queue: BuildQueueItem[];
  buildings: Building[];
  onCancel: (id: string) => void;
}

function formatType(item: BuildQueueItem): string {
  switch (item.type) {
    case 'replacement':
      return 'Replacement';
    case 'renovation':
      return 'Renovation';
    case 'deconstruction':
      return 'Deconstruction';
    default:
      return 'New Build';
  }
}

export function BuildQueue({ queue, buildings, onCancel }: BuildQueueProps) {
  return (
    <div className="panel">
      <h2>Build Queue</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', alignItems: 'center' }}>
        <strong>Project</strong>
        <strong>Type</strong>
        <strong>Location</strong>
        <strong>Days Remaining</strong>
        <strong>Action</strong>
        {queue.map((item) => (
          <div key={item.id} style={{ display: 'contents' }}>
            <span>{item.targetSlug}</span>
            <span>{formatType(item)}</span>
            <span>
              ({item.location[0]}, {item.location[1]})
            </span>
            <span>{item.daysRemaining.toFixed(1)}</span>
            <button onClick={() => onCancel(item.id)}>Cancel</button>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
        Replacement removes existing capacity immediately. Renovation applies only the net gain. Deconstruction clears the old
        structure before rebuilding.
      </p>
      <div style={{ marginTop: '0.75rem' }}>
        <strong>Active Buildings:</strong>
        <ul>
          {buildings.map((building) => (
            <li key={building.id}>
              {building.slug} at ({building.x}, {building.y}) – capacity {building.capacity} ({building.status})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BuildQueue;
