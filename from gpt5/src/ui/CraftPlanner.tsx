import React from 'react'
import type { GameState } from '@game/state'

export default function CraftPlanner({ state }:{ state: GameState }){
  return (
    <div>
      <h2>Craft Planner</h2>
      <p>Set targets like “craft until X on hand.” (UI stub)</p>
    </div>
  )
}
