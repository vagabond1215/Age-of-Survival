import jobs from '../data/jobs.json';
import { type Villager } from '../game/state';
import { canAssign } from '../game/systems/jobs';

interface JobManagerProps {
  villagers: Villager[];
  stateForCaps: Parameters<typeof canAssign>[0];
  onAssign: (villagerId: string, jobId: string) => void;
}

export function JobManager({ villagers, stateForCaps, onAssign }: JobManagerProps) {
  return (
    <div className="panel">
      <h2>Job Manager</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', alignItems: 'center' }}>
        <strong>Villager</strong>
        <strong>Job</strong>
        <strong>Efficiency</strong>
        <strong>Bed</strong>
        {villagers.map((villager) => (
          <div key={villager.id} style={{ display: 'contents' }}>
            <span>{villager.name}</span>
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
