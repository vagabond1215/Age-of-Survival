import React, { useMemo, useState } from 'react'
import { defaultState, type GameState } from '@game/state'
import { advanceDay, advanceDays } from '@game/engine'
import ResourceBar from '@ui/ResourceBar'
import DayControls from '@ui/DayControls'
import JobManager from '@ui/JobManager'
import CraftPlanner from '@ui/CraftPlanner'
import BuildQueue from '@ui/BuildQueue'
import MapGrid from '@ui/MapGrid'
import Notifications from '@ui/Notifications'
import { saveToLocal, loadFromLocal, exportToFile, importFromFile } from '@lib/persist'

export default function App() {
  const [state, setState] = useState<GameState>(() => loadFromLocal() ?? defaultState())
  const [pauseOnSummon, setPauseOnSummon] = useState(true)

  const onNextDay = () => {
    const next = advanceDay(state)
    setState(next)
    saveToLocal(next)
  }

  const onAdvance3 = () => {
    const next = advanceDays(state, 3, pauseOnSummon)
    setState(next)
    saveToLocal(next)
  }

  const onReset = () => {
    const fresh = defaultState()
    setState(fresh)
    saveToLocal(fresh)
  }

  return (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui', padding: 16, gap: 12 }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>Haven — Web Text RPG</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => exportToFile(state)}>Export Save</button>
          <button onClick={() => importFromFile().then(s => s && setState(s))}>Import Save</button>
          <button onClick={onReset}>Reset</button>
        </div>
      </header>

      <ResourceBar state={state} />

      <DayControls
        onNextDay={onNextDay}
        onAdvance3={onAdvance3}
        pauseOnSummon={pauseOnSummon}
        setPauseOnSummon={setPauseOnSummon}
      />

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <BuildQueue state={state} setState={setState} />
        <MapGrid state={state} />
        <JobManager state={state} setState={setState} />
        <CraftPlanner state={state} setState={setState} />
      </section>

      <Notifications state={state} />
    </div>
  )
}
