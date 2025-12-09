import { useMemo, useRef, useState } from 'react';
import jobs from '../data/jobs.json';
import { type Villager } from '../game/state';
import { canAssign } from '../game/systems/jobs';

interface JobManagerProps {
  villagers: Villager[];
  stateForCaps: Parameters<typeof canAssign>[0];
  onAssign: (villagerId: string, jobId: string) => void;
}

export function JobManager({ villagers, stateForCaps, onAssign }: JobManagerProps) {
  const [activeVillagerId, setActiveVillagerId] = useState<string | null>(null);
  const longPressTimer = useRef<number | null>(null);

  const jobLookup = useMemo(() => {
    return new Map(jobs.map((job) => [job.id, job.name] as const));
  }, []);

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
    </div>
  );
}

export default JobManager;
