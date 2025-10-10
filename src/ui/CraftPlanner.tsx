import recipes from '../data/recipes.json';
import { type CraftTarget } from '../game/state';

interface CraftPlannerProps {
  crafting: CraftTarget[];
  onUpdate: (recipeId: string, target: number) => void;
}

export function CraftPlanner({ crafting, onUpdate }: CraftPlannerProps) {
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
          return (
            <div key={recipe.id} style={{ display: 'contents' }}>
              <span>{recipe.name}</span>
              <input
                type="number"
                min={0}
                value={target?.targetCount ?? 0}
                onChange={(event) => onUpdate(recipe.id, Number(event.target.value))}
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
