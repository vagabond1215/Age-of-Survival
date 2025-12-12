import recipes from '../../data/recipes.json';
import jobs from '../../data/jobs.json';
import { type GameState } from '../state';
import { getRequirementForRecipe, isRecipeUnlocked } from './jobRequirements';

const recipeMap = new Map(recipes.map((r) => [r.id, r]));
const jobNameMap = new Map(jobs.map((job) => [job.id, job.name] as const));

function cloneState(state: GameState): GameState {
  return {
    ...state,
    resources: { ...state.resources },
    crafting: state.crafting.map((c) => ({ ...c })),
    notifications: [...state.notifications]
  };
}

export function applyCraftingTargets(state: GameState): GameState {
  const next = cloneState(state);

  for (const target of next.crafting) {
    const recipe = recipeMap.get(target.recipeId);
    if (!recipe) continue;
    if (!isRecipeUnlocked(next, recipe.id)) {
      const requirement = getRequirementForRecipe(recipe.id);
      const jobName = jobNameMap.get(requirement?.jobId ?? '') ?? requirement?.jobId ?? 'assigned worker';
      const message = `${recipe.name} is locked: assign and equip a ${jobName} with the right workspace.`;
      if (!next.notifications.includes(message)) {
        next.notifications.push(message);
      }
      continue;
    }
    const needed = Math.max(0, target.targetCount - target.onHand);
    if (needed <= 0) continue;

    const canProduce = Object.entries(recipe.inputs).every(([resource, amount]) => {
      return next.resources[resource as keyof typeof next.resources] >= amount;
    });
    if (!canProduce) {
      next.notifications.push(`Crafting paused: lacking inputs for ${recipe.name}`);
      continue;
    }

    for (const [resource, amount] of Object.entries(recipe.inputs)) {
      next.resources[resource as keyof typeof next.resources] -= amount;
    }
    for (const [resource, amount] of Object.entries(recipe.outputs)) {
      next.resources[resource as keyof typeof next.resources] += amount;
    }
    target.onHand += 1;
  }

  return next;
}

export function ensureCraftTarget(state: GameState, recipeId: string, targetCount: number): GameState {
  const next = cloneState(state);
  const existing = next.crafting.find((c) => c.recipeId === recipeId);
  if (existing) {
    existing.targetCount = targetCount;
    existing.onHand = Math.min(existing.onHand, targetCount);
    return next;
  }
  next.crafting.push({ recipeId, targetCount, onHand: 0 });
  return next;
}
