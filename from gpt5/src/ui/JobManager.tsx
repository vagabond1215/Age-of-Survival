import React from 'react'
import type { GameState } from '@game/state'

export default function JobManager({ state }:{ state: GameState }){
  return (
    <div>
      <h2>Job Manager</h2>
      <p>Villagers perform only their assigned job. (UI stub — implement reassignment & beds.)</p>
      <ul>
        {state.villagers.map(v => <li key={v.id}>{v.name} — {v.role} — bed:{v.bed}</li>)}
      </ul>
    </div>
  )
}
