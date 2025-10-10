interface DayControlsProps {
  onAdvanceDay: () => void;
  onAdvanceThree: () => void;
  onTogglePause: (value: boolean) => void;
  pauseOnSummon: boolean;
}

export function DayControls({ onAdvanceDay, onAdvanceThree, onTogglePause, pauseOnSummon }: DayControlsProps) {
  return (
    <div className="panel">
      <h2>Day Controls</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        <button onClick={onAdvanceDay}>
          Next Day
        </button>
        <button onClick={onAdvanceThree}>
          Advance 3 Days
        </button>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" checked={pauseOnSummon} onChange={(event) => onTogglePause(event.target.checked)} />
          Pause on Summon
        </label>
      </div>
    </div>
  );
}

export default DayControls;
