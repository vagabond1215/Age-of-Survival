import React from 'react'
import type { GameState } from '@game/state'

export default function BuildQueue({ state }:{ state: GameState }){
  return (
    <div>
      <h2>Build Queue</h2>
      <p>List projects with costs/effects/ETA. Enforce replacement vs renovation accounting. (UI stub)</p>
    </div>
  )
}
