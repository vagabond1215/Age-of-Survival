import jobs from '../../data/jobs.json';
import requirements, { getRequirementForRecipe, jobRequirementMap, type JobRequirement } from '../../data/jobRequirements';
import { type ResourceId } from '../constants';
import { type GameState, type Villager } from '../state';

export type Job = (typeof jobs)[number];

export type WorkerPlanMode = 'full' | 'toolless' | 'blocked';

export interface WorkerPlan {
  villager: Villager;
  job: Job;
  requirement?: JobRequirement;
  mode: WorkerPlanMode;
}

export interface JobPlanSummary {
  jobId: string;
  requirement?: JobRequirement;
  assigned: number;
  active: number;
  toolless: number;
  blocked: number;
  workstations: number | null;
  toolSets: number | null;
  unlocksRecipes: string[];
}

export interface JobPlanningResult {
  plans: WorkerPlan[];
  summaries: Record<string, JobPlanSummary>;
}

interface ToolRequest {
  villager: Villager;
  job: Job;
  perWorker: number;
  resource: ResourceId;
  requirement?: JobRequirement;
}

function cloneVillagerList(input: Villager[]): Villager[] {
  return input.map((villager) => ({ ...villager }));
}

function countWorkstations(state: GameState, requirement?: JobRequirement): number | null {
  if (!requirement?.requiredBuildings || requirement.requiredBuildings.length === 0) {
    return null;
  }
  return state.buildings.filter(
    (building) => building.status === 'active' && requirement.requiredBuildings?.includes(building.slug)
  ).length;
}

function getWorkersForJob(state: GameState, jobId: string): Villager[] {
  return cloneVillagerList(state.villagers.filter((villager) => villager.jobId === jobId)).sort(
    (a, b) => b.efficiency - a.efficiency
  );
}

function allocateTools(requests: ToolRequest[], toolBudget: Partial<Record<ResourceId, number>>): Set<string> {
  const equipped = new Set<string>();
  const grouped = requests.reduce<Record<string, ToolRequest[]>>((acc, request) => {
    acc[request.resource] = acc[request.resource] ?? [];
    acc[request.resource].push(request);
    return acc;
  }, {});

  for (const [resource, list] of Object.entries(grouped)) {
    const available = toolBudget[resource as ResourceId] ?? 0;
    let remaining = available;
    const sorted = list.sort((a, b) => b.villager.efficiency - a.villager.efficiency);
    for (const entry of sorted) {
      if (remaining < entry.perWorker) continue;
      equipped.add(entry.villager.id);
      remaining -= entry.perWorker;
    }
    toolBudget[resource as ResourceId] = remaining;
  }

  return equipped;
}

function buildEmptySummary(jobId: string): JobPlanSummary {
  const requirement = jobRequirementMap.get(jobId);
  return {
    jobId,
    requirement,
    assigned: 0,
    active: 0,
    toolless: 0,
    blocked: 0,
    workstations: null,
    toolSets: null,
    unlocksRecipes: requirement?.unlocksRecipes ?? []
  };
}

export function evaluateJobPlans(state: GameState): JobPlanningResult {
  const toolBudget: Partial<Record<ResourceId, number>> = { ...state.resources };
  const plans: WorkerPlan[] = [];
  const summaries: Record<string, JobPlanSummary> = {};
  const toolRequests: ToolRequest[] = [];

  for (const job of jobs as Job[]) {
    const workers = getWorkersForJob(state, job.id);
    const requirement = jobRequirementMap.get(job.id);
    const summary: JobPlanSummary = {
      ...buildEmptySummary(job.id),
      requirement,
      assigned: workers.length,
      workstations: countWorkstations(state, requirement),
      toolSets: requirement?.requiredTools
        ? Math.floor((state.resources[requirement.requiredTools.resource] ?? 0) / requirement.requiredTools.perWorker)
        : null
    };

    const allowedByStations = summary.workstations === null ? workers.length : Math.min(workers.length, summary.workstations);
    const eligible = workers.slice(0, allowedByStations);
    const blocked = workers.slice(allowedByStations);

    summary.blocked += blocked.length;

    for (const villager of blocked) {
      plans.push({ villager, job, requirement, mode: 'blocked' });
    }

    for (const villager of eligible) {
      if (requirement?.requiredTools) {
        toolRequests.push({
          villager,
          job,
          requirement,
          perWorker: requirement.requiredTools.perWorker,
          resource: requirement.requiredTools.resource
        });
        continue;
      }
      plans.push({ villager, job, requirement, mode: 'full' });
      summary.active += 1;
    }

    summaries[job.id] = summary;
  }

  const equipped = allocateTools(toolRequests, toolBudget);

  for (const request of toolRequests) {
    const summary = summaries[request.job.id];
    if (!summary) continue;
    const requirement = summary.requirement;
    if (equipped.has(request.villager.id)) {
      plans.push({ villager: request.villager, job: request.job, requirement, mode: 'full' });
      summary.active += 1;
      continue;
    }
    if (requirement?.toolLessProduction) {
      plans.push({ villager: request.villager, job: request.job, requirement, mode: 'toolless' });
      summary.toolless += 1;
      continue;
    }
    plans.push({ villager: request.villager, job: request.job, requirement, mode: 'blocked' });
    summary.blocked += 1;
  }

  return { plans, summaries };
}

export function isRecipeUnlocked(
  state: GameState,
  recipeId: string,
  summaries?: Record<string, JobPlanSummary>
): boolean {
  const requirement = getRequirementForRecipe(recipeId);
  if (!requirement) return true;
  const summary = summaries?.[requirement.jobId] ?? evaluateJobPlans(state).summaries[requirement.jobId];
  if (!summary) return false;
  if (summary.assigned <= 0) return false;
  if (summary.workstations !== null && summary.workstations <= 0) return false;
  return summary.active + summary.toolless > 0;
}

export function getJobRequirement(jobId: string): JobRequirement | undefined {
  return jobRequirementMap.get(jobId);
}

export { requirements as jobRequirements };
export { getRequirementForRecipe };
