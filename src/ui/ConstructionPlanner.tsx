import { RESOURCE_ICONS, type ResourceId } from '../game/constants';
import { type ConstructionPlan } from '../game/constructionPlans';
import {
  canAffordConstruction,
  getConstructionCost,
  getConstructionShortages
} from '../game/systems/construction';
import { type ResourceMap } from '../game/state';

interface ConstructionPlannerProps {
  resources: ResourceMap;
  plans: ConstructionPlan[];
  onPlan: (plan: ConstructionPlan) => void;
}

function formatCost(cost: Partial<ResourceMap>): string {
  const entries = Object.entries(cost).filter(([, amount]) => (amount ?? 0) > 0) as [
    ResourceId,
    number
  ][];
  if (entries.length === 0) return 'No cost';
  return entries.map(([id, amount]) => `${RESOURCE_ICONS[id]} ${amount} ${id}`).join(', ');
}

export function ConstructionPlanner({ resources, plans, onPlan }: ConstructionPlannerProps) {
  return (
    <div className="panel">
      <h2>Plan Construction</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.75rem' }}>
        {plans.map((plan) => {
          const cost = getConstructionCost(plan.targetSlug);
          const shortages = getConstructionShortages(resources, plan.targetSlug);
          const canBuild = canAffordConstruction(resources, plan.targetSlug);
          return (
            <div key={plan.targetSlug} className="panel" style={{ padding: '0.75rem', margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong>{plan.label}</strong>
                <span style={{ fontSize: '0.85rem' }}>{plan.baseDays} days</span>
              </div>
              <p style={{ marginTop: '0.25rem', minHeight: '3rem' }}>{plan.description}</p>
              <p style={{ margin: '0.25rem 0' }}>
                <strong>Capacity:</strong> {plan.capacityDelta > 0 ? `+${plan.capacityDelta}` : plan.capacityDelta}
              </p>
              <p style={{ margin: '0.25rem 0' }}>
                <strong>Cost:</strong> {formatCost(cost)}
              </p>
              {!canBuild && shortages.length > 0 && (
                <p style={{ color: '#ff8080', margin: '0.25rem 0' }}>
                  Need {shortages.map((item) => `${item.deficit} ${item.id}`).join(', ')}
                </p>
              )}
              <button onClick={() => onPlan(plan)} disabled={!canBuild} style={{ width: '100%' }}>
                {canBuild ? 'Queue Build' : 'Insufficient resources'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ConstructionPlanner;
