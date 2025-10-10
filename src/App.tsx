import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import ResourceBar from './ui/ResourceBar';
import DayControls from './ui/DayControls';
import JobManager from './ui/JobManager';
import CraftPlanner from './ui/CraftPlanner';
import BuildQueue from './ui/BuildQueue';
import MapGrid from './ui/MapGrid';
import Notifications from './ui/Notifications';
import AwakeningPrompt from './ui/AwakeningPrompt';
import { createDefaultState, type GameState } from './game/state';
import { composeAwakeningNarrative } from './game/narrative';
import { tickDay, tickThreeDays } from './game/engine';
import { assignJob } from './game/systems/jobs';
import { ensureCraftTarget } from './game/systems/crafting';
import { loadFromLocalStorage, saveToLocalStorage, exportToFile, importFromFile, resetSave } from './lib/persist';

function App() {
  const [state, setState] = useState<GameState>(() => {
    const loaded = typeof window !== 'undefined' ? loadFromLocalStorage() : null;
    return loaded ?? createDefaultState();
  });
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    saveToLocalStorage(state);
  }, [state]);

  const handleAdvanceDay = useCallback(() => {
    setState((current) => {
      if (current.pauseOnSummon && current.summonPaused) {
        return { ...current, summonPaused: false };
      }
      return tickDay({ ...current, summonPaused: false }, 1);
    });
  }, []);

  const handleAdvanceThree = useCallback(() => {
    setState((current) => {
      if (current.pauseOnSummon && current.summonPaused) {
        return { ...current, summonPaused: false };
      }
      return tickThreeDays({ ...current, summonPaused: false });
    });
  }, []);

  const handleTogglePauseOnSummon = useCallback((value: boolean) => {
    setState((current) => ({ ...current, pauseOnSummon: value }));
  }, []);

  const handleAssign = useCallback((villagerId: string, jobId: string) => {
    setState((current) => assignJob(current, villagerId, jobId));
  }, []);

  const handleCraftTarget = useCallback((recipeId: string, target: number) => {
    setState((current) => ensureCraftTarget(current, recipeId, Math.max(0, target)));
  }, []);

  const handleExport = useCallback(() => {
    exportToFile(state);
  }, [state]);

  const handleImport = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importFromFile(file);
      setState(imported);
      setImportError(null);
    } catch (error) {
      setImportError((error as Error).message);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm('Reset settlement to default state?')) {
      resetSave();
      setState(createDefaultState());
    }
  }, []);

  const cancelBuild = useCallback((id: string) => {
    setState((current) => ({ ...current, buildQueue: current.buildQueue.filter((item) => item.id !== id) }));
  }, []);

  const handleAwakeningBegin = useCallback(() => {
    setState((current) => {
      const narrative = current.awakening?.narrative ?? composeAwakeningNarrative(current.biome, current.features);
      return { ...current, awakening: { seen: true, narrative } };
    });
  }, []);

  return (
    <div className="App">
      {!state.awakening?.seen && (
        <AwakeningPrompt
          biome={state.biome}
          features={state.features}
          narrative={state.awakening?.narrative}
          onBegin={handleAwakeningBegin}
        />
      )}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Village of Haven</h1>
          <p>
            Day {state.day} · Biome {state.biome} · Features {state.features.join(', ')}
          </p>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, auto)', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={handleExport}>Export Save</button>
          <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.85rem' }}>
            Import Save
            <input type="file" accept="application/json" onChange={handleImport} />
          </label>
          <button onClick={handleReset}>Reset</button>
        </div>
      </header>
      {importError && <p style={{ color: '#ff8080' }}>{importError}</p>}
      {state.pauseOnSummon && state.summonPaused && (
        <div className="panel" style={{ borderColor: '#ffcc66' }}>
          <strong>Summoning paused.</strong> Assign beds and roles to welcome a new villager.
        </div>
      )}
      <ResourceBar resources={state.resources} deltas={state.deltas} />
      <DayControls
        onAdvanceDay={handleAdvanceDay}
        onAdvanceThree={handleAdvanceThree}
        onTogglePause={handleTogglePauseOnSummon}
        pauseOnSummon={state.pauseOnSummon}
      />
      <JobManager villagers={state.villagers} stateForCaps={state} onAssign={handleAssign} />
      <CraftPlanner crafting={state.crafting} onUpdate={handleCraftTarget} />
      <BuildQueue queue={state.buildQueue} buildings={state.buildings} onCancel={cancelBuild} />
      <MapGrid buildings={state.buildings} tiles={state.map} />
      <Notifications notifications={state.notifications} />
    </div>
  );
}

export default App;
