import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import ResourceBar from './ui/ResourceBar';
import DayControls from './ui/DayControls';
import JobManager from './ui/JobManager';
import CraftPlanner from './ui/CraftPlanner';
import BuildQueue from './ui/BuildQueue';
import MapGrid from './ui/MapGrid';
import Notifications from './ui/Notifications';
import CharacterCreation from './ui/CharacterCreation';
import { createDefaultState, type GameState, type StartingTask, type Villager } from './game/state';
import { composeAwakeningNarrative } from './game/narrative';
import { tickDay } from './game/engine';
import { assignJob } from './game/systems/jobs';
import { ensureCraftTarget } from './game/systems/crafting';
import { loadFromLocalStorage, saveToLocalStorage, exportToFile, importFromFile, resetSave } from './lib/persist';
import { getBiomeDetail } from './data/biomes';
import { generateMap } from './game/map';
import { createRng } from './lib/rng';
import { getCreationEventById, getCreationEventsForBiome, getThoughtById } from './data/creationEvents';
import { computeProductionDeltas } from './game/systems/production';

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

  const handleSelectBiome = useCallback((biomeId: GameState['biome']) => {
    setState((current) => {
      const detail = getBiomeDetail(biomeId);
      const features = detail.defaultFeatures;
      const narrative = composeAwakeningNarrative(biomeId, features);
      return {
        ...current,
        biome: biomeId,
        features,
        map: generateMap(biomeId, features, current.rngSeed),
        awakening: { seen: false, narrative },
        creation: {
          ...current.creation,
          stage: 'awaiting_focus',
          selectedBiome: biomeId,
          eventId: null,
          chosenThought: null,
          helperId: null,
          startingTask: null
        }
      };
    });
  }, []);

  const handleGather = useCallback(() => {
    setState((current) => {
      if (current.creation.stage !== 'awaiting_focus' || !current.creation.selectedBiome) {
        return current;
      }
      const rng = createRng(current.rngSeed);
      const events = getCreationEventsForBiome(current.creation.selectedBiome);
      const index = events.length > 0 ? Math.floor(rng.next() * events.length) % events.length : 0;
      const selectedEvent = events[index] ?? null;
      return {
        ...current,
        rngSeed: rng.seed,
        creation: {
          ...current.creation,
          stage: 'event',
          eventId: selectedEvent?.id ?? null
        }
      };
    });
  }, []);

  const handleResolveThought = useCallback((thoughtId: string) => {
    setState((current) => {
      if (current.creation.stage !== 'event') {
        return current;
      }
      const event = getCreationEventById(current.creation.eventId);
      const thought = getThoughtById(event, thoughtId);
      if (!thought) {
        return current;
      }
      return {
        ...current,
        notifications: current.notifications,
        awakening: current.awakening,
        creation: {
          ...current.creation,
          stage: 'arrival',
          chosenThought: thoughtId
        }
      };
    });
  }, []);

  const handleConfirmArrival = useCallback(() => {
    setState((current) => {
      if (current.creation.stage !== 'arrival') {
        return current;
      }
      const event = getCreationEventById(current.creation.eventId);
      const thought = getThoughtById(event, current.creation.chosenThought ?? '');
      if (!thought) {
        return current;
      }

      const helper: Villager = {
        id: `v-${Date.now()}`,
        name: thought.villager.name,
        jobId: thought.villager.jobId,
        efficiency: thought.villager.efficiency,
        bed: current.buildings[0]?.id ?? null,
        skills: thought.villager.skills,
        summary: thought.villager.summary
      };

      const awakening = {
        seen: true,
        narrative: thought.arrival
      };

      const notifications = current.notifications.includes(thought.result)
        ? current.notifications
        : [...current.notifications, thought.result];

      return {
        ...current,
        villagers: [...current.villagers, helper],
        notifications,
        awakening,
        creation: {
          ...current.creation,
          stage: 'task_assignment',
          helperId: helper.id,
          startingTask: null
        }
      };
    });
  }, []);

  const handleSelectStartingTask = useCallback((task: StartingTask) => {
    setState((current) => {
      if (current.creation.stage !== 'task_assignment' || !current.creation.helperId) {
        return current;
      }

      const helperIndex = current.villagers.findIndex((villager) => villager.id === current.creation.helperId);
      if (helperIndex === -1) {
        return current;
      }

      const updatedVillagers = current.villagers.map((villager) => ({ ...villager }));
      const helper = updatedVillagers[helperIndex];
      const companion = updatedVillagers.find((villager) => villager.id !== helper.id);

      const helperJobId = task === 'gather_materials' ? 'woodcutter' : 'forager';
      const companionJobId = task === 'gather_materials' ? 'forager' : 'woodcutter';

      helper.jobId = helperJobId;
      if (companion) {
        companion.jobId = companionJobId;
      }

      const deltas = computeProductionDeltas({ ...current, villagers: updatedVillagers });

      const notifications = [
        ...current.notifications,
        `${helper.name} will ${task === 'gather_materials' ? 'gather materials' : 'gather food'}.`,
        companion ? `${companion.name} will ${task === 'gather_materials' ? 'gather food' : 'gather materials'}.` : ''
      ].filter(Boolean);

      return {
        ...current,
        villagers: updatedVillagers,
        deltas,
        notifications,
        creation: {
          ...current.creation,
          stage: 'complete',
          startingTask: task
        }
      };
    });
  }, []);

  if (state.creation.stage !== 'complete') {
    return (
      <div className="App">
        <CharacterCreation
          creation={state.creation}
          currentBiome={state.biome}
          features={state.features}
          helper={state.villagers.find((villager) => villager.id === state.creation.helperId) ?? null}
          onSelectBiome={handleSelectBiome}
          onGather={handleGather}
          onResolveThought={handleResolveThought}
          onConfirmArrival={handleConfirmArrival}
          onSelectStartingTask={handleSelectStartingTask}
        />
      </div>
    );
  }

  return (
    <div className="App">
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
