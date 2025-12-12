import { type ResourceId } from '../game/constants';

export interface ToolRequirement {
  resource: ResourceId;
  perWorker: number;
  description?: string;
}

export interface JobRequirement {
  jobId: string;
  requiredTools?: ToolRequirement;
  toolLessProduction?: Partial<Record<ResourceId, number>>;
  requiredBuildings?: string[];
  unlocksRecipes?: string[];
  notes?: string;
}

const requirements: JobRequirement[] = [
  {
    jobId: 'forager',
    notes: 'Scavenges edible plants without dedicated equipment.'
  },
  {
    jobId: 'hunter',
    requiredTools: { resource: 'tools', perWorker: 1, description: 'Hunting bows or spears' },
    toolLessProduction: { food: 1 },
    notes: 'Improvised hunting yields less without proper gear.'
  },
  {
    jobId: 'woodcutter',
    requiredTools: { resource: 'tools', perWorker: 1, description: 'Axes and saws' },
    toolLessProduction: { logs: 1 },
    notes: 'Manual gathering without axes is slower.'
  },
  {
    jobId: 'mason',
    requiredTools: { resource: 'tools', perWorker: 1, description: 'Chisels and hammers' },
    requiredBuildings: ['stone_hall', 'town_hall'],
    toolLessProduction: { stone: 0.5 },
    notes: 'Needs a stoneworking space; hand tools only allow minimal output.'
  },
  {
    jobId: 'smith',
    requiredTools: { resource: 'tools', perWorker: 1, description: 'Forges and anvils' },
    requiredBuildings: ['stone_hall', 'town_hall'],
    unlocksRecipes: ['iron_axe'],
    notes: 'Requires a dedicated forge to work metal.'
  },
  {
    jobId: 'tailor',
    requiredTools: { resource: 'tools', perWorker: 1, description: 'Needles and looms' },
    requiredBuildings: ['log_cabin', 'stone_hall', 'town_hall'],
    toolLessProduction: { cloth: 0.25 },
    notes: 'A sheltered workshop improves output dramatically.'
  },
  {
    jobId: 'builder',
    requiredTools: { resource: 'tools', perWorker: 1, description: 'Hammers and saws' },
    notes: 'Building crews stall without shared toolkits.'
  },
  {
    jobId: 'quartermaster',
    requiredBuildings: ['town_hall'],
    notes: 'Needs a planning table in the hall to organise supplies.'
  }
];

export default requirements;

export const jobRequirementMap = new Map(requirements.map((entry) => [entry.jobId, entry] as const));

export function getRequirementForRecipe(recipeId: string): JobRequirement | undefined {
  return requirements.find((req) => req.unlocksRecipes?.includes(recipeId));
}
