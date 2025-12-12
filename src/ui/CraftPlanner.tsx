import recipes from '../data/recipes.json';
import { type GameState, type CraftTarget } from '../game/state';
import { isRecipeUnlocked, type JobPlanSummary } from '../game/systems/jobRequirements';

interface CraftPlannerProps {
  crafting: CraftTarget[];
  jobSummaries: Record<string, JobPlanSummary>;
  state: GameState;
  onUpdate: (recipeId: string, target: number) => void;
}

export function CraftPlanner({ crafting, onUpdate, jobSummaries, state }: CraftPlannerProps) {
  return (
    <div className="panel">
      <h2>Craft Planner</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', alignItems: 'center' }}>
        <strong>Recipe</strong>
        <strong>Target</strong>
        <strong>On Hand</strong>
        <strong>Inputs</strong>
        {recipes.map((recipe) => {
          const target = crafting.find((entry) => entry.recipeId === recipe.id);
          const unlocked = isRecipeUnlocked(state, recipe.id, jobSummaries);
          return (
            <div key={recipe.id} style={{ display: 'contents', opacity: unlocked ? 1 : 0.65 }}>
              <span>
                {recipe.name}
                {!unlocked && <span style={{ marginLeft: '0.25rem', color: '#cc6b6b' }}>(locked)</span>}
              </span>
              <input
                type="number"
                min={0}
                value={target?.targetCount ?? 0}
                onChange={(event) => onUpdate(recipe.id, Number(event.target.value))}
                disabled={!unlocked}
              />
              <span>{target?.onHand ?? 0}</span>
              <span>
                {Object.entries(recipe.inputs)
                  .map(([resource, amount]) => `${amount} ${resource}`)
                  .join(', ')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CraftPlanner;
