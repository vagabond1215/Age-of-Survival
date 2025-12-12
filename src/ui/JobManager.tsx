import { useMemo, useRef, useState } from 'react';
import jobs from '../data/jobs.json';
import recipes from '../data/recipes.json';
import { type Villager } from '../game/state';
import { getJobRequirement, type JobPlanSummary } from '../game/systems/jobRequirements';
import { canAssign } from '../game/systems/jobs';

interface JobManagerProps {
  villagers: Villager[];
  stateForCaps: Parameters<typeof canAssign>[0];
  onAssign: (villagerId: string, jobId: string) => void;
  jobSummaries: Record<string, JobPlanSummary>;
}

export function JobManager({ villagers, stateForCaps, onAssign, jobSummaries }: JobManagerProps) {
  const [activeVillagerId, setActiveVillagerId] = useState<string | null>(null);
  const longPressTimer = useRef<number | null>(null);

  const jobLookup = useMemo(() => {
    return new Map(jobs.map((job) => [job.id, job.name] as const));
  }, []);
  const recipesByJob = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const job of jobs) {
      const requirement = getJobRequirement(job.id);
      if (requirement?.unlocksRecipes?.length) {
        map.set(job.id, requirement.unlocksRecipes);
      }
    }
    return map;
  }, []);
  const recipeNameMap = useMemo(() => new Map(recipes.map((recipe) => [recipe.id, recipe.name] as const)), []);

  const clearTimer = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const requestTooltip = (villagerId: string) => {
    clearTimer();
    longPressTimer.current = window.setTimeout(() => {
      setActiveVillagerId(villagerId);
    }, 300);
  };

  const toggleTooltip = (villagerId: string) => {
    setActiveVillagerId((current) => (current === villagerId ? null : villagerId));
  };

  return (
    <div className="panel">
      <h2>Job Manager</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', alignItems: 'center' }}>
        <strong>Villager</strong>
        <strong>Job</strong>
        <strong>Efficiency</strong>
        <strong>Bed</strong>
        {villagers.map((villager) => (
          <div key={villager.id} style={{ display: 'contents', position: 'relative' }}>
            <button
              className="villager-name-button"
              onPointerDown={() => requestTooltip(villager.id)}
              onPointerUp={() => clearTimer()}
              onClick={() => toggleTooltip(villager.id)}
              onBlur={() => setActiveVillagerId((current) => (current === villager.id ? null : current))}
            >
              {villager.name}
            </button>
            {activeVillagerId === villager.id && (
              <div className="villager-tooltip" role="dialog" aria-label={`Details for ${villager.name}`}>
                <div className="villager-tooltip__header">
                  <span className="villager-tooltip__name">{villager.name}</span>
                  <span className="villager-tooltip__role">{jobLookup.get(villager.jobId) ?? villager.jobId}</span>
                </div>
                <div className="villager-tooltip__line">Efficiency: {villager.efficiency.toFixed(2)}</div>
                <div className="villager-tooltip__line">Bed: {villager.bed ?? 'Unassigned'}</div>
                {villager.summary && <div className="villager-tooltip__line">{villager.summary}</div>}
                {villager.skills?.length ? (
                  <div className="villager-tooltip__skills">Skills: {villager.skills.join(', ')}</div>
                ) : (
                  <div className="villager-tooltip__skills">Skills: Not recorded</div>
                )}
              </div>
            )}
            <select value={villager.jobId} onChange={(event) => onAssign(villager.id, event.target.value)}>
              {jobs.map((job) => {
                const disabled = !canAssign(stateForCaps, job.id) && villager.jobId !== job.id;
                return (
                  <option key={job.id} value={job.id} disabled={disabled}>
                    {job.name}
                  </option>
                );
              })}
            </select>
            <span>{villager.efficiency.toFixed(2)}</span>
            <span>{villager.bed ?? 'Unassigned'}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <h3>Role Requirements & Unlocks</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', alignItems: 'start' }}>
          <strong>Job</strong>
          <strong>Status</strong>
          <strong>Requirements</strong>
          <strong>Crafts</strong>
          {jobs.map((job) => {
            const summary = jobSummaries[job.id];
            const requirement = getJobRequirement(job.id);
            const active = (summary?.active ?? 0) + (summary?.toolless ?? 0);
            const assigned = summary?.assigned ?? 0;
            const workstationText = requirement?.requiredBuildings?.length
              ? `${summary?.workstations ?? 0} / ${requirement.requiredBuildings.join(', ')}`
              : 'No workshop needed';
            const toolText = requirement?.requiredTools
              ? `${summary?.toolSets ?? 0} sets of ${requirement.requiredTools.resource} (needs ${requirement.requiredTools.perWorker}/worker)`
              : 'No tools required';
            const unlocks = recipesByJob.get(job.id) ?? [];
            return (
              <div key={job.id} style={{ display: 'contents' }}>
                <span>{job.name}</span>
                <span>
                  {assigned > 0 ? `${active}/${assigned} ready` : 'Unassigned'}
                  {summary?.toolless ? ` (${summary.toolless} improvised)` : ''}
                </span>
                <div>
                  <div>{toolText}</div>
                  <div>{workstationText}</div>
                  {requirement?.notes && <div style={{ fontSize: '0.85rem', color: '#999' }}>{requirement.notes}</div>}
                </div>
                <div>
                  {unlocks.length === 0
                    ? 'No crafts unlocked'
                    : unlocks.map((id) => recipeNameMap.get(id) ?? id).join(', ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default JobManager;
