import jobs from '../../data/jobs.json';
import { type GameState } from '../state';

const capMap = new Map(jobs.map((job) => [job.id, job.cap]));

function cloneState(state: GameState): GameState {
  return {
    ...state,
    villagers: state.villagers.map((v) => ({ ...v })),
    notifications: [...state.notifications]
  };
}

export function countAssignments(state: GameState, jobId: string): number {
  return state.villagers.filter((villager) => villager.jobId === jobId).length;
}

export function canAssign(state: GameState, jobId: string): boolean {
  const cap = capMap.get(jobId) ?? Infinity;
  return countAssignments(state, jobId) < cap;
}

export function assignJob(state: GameState, villagerId: string, jobId: string): GameState {
  if (!capMap.has(jobId)) {
    throw new Error(`Unknown job ${jobId}`);
  }
  if (!canAssign(state, jobId)) {
    throw new Error(`Job ${jobId} is at capacity`);
  }
  const next = cloneState(state);
  const villager = next.villagers.find((v) => v.id === villagerId);
  if (!villager) {
    throw new Error('Villager not found');
  }
  villager.jobId = jobId;
  next.notifications.push(`${villager.name} assigned to ${jobId}`);
  return next;
}

export function enforceBedAssignments(state: GameState): GameState {
  const beds = new Set(state.buildings.filter((b) => b.capacity > 0).map((b) => b.id));
  const next = cloneState(state);
  for (const villager of next.villagers) {
    if (!villager.bed || !beds.has(villager.bed)) {
      villager.bed = null;
    }
  }
  return next;
}
