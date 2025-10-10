import React from 'react'
import type { GameState } from '@game/state'

export default function MapGrid({ state }:{ state: GameState }){
  const size = 9
  const coords = []
  for (let y = Math.floor(size/2); y >= -Math.floor(size/2); y--) {
    const row = []
    for (let x = -Math.floor(size/2); x <= Math.floor(size/2); x++) {
      const b = state.buildings.find(bb=> bb.x===x && bb.y===y)
      row.push(<td key={x} style={{ border:'1px solid #ddd', width:24, height:24, textAlign:'center' }} title={`${x},${y}`}>
        {b ? '■' : ''}
      </td>)
    }
    coords.push(<tr key={y}>{row}</tr>)
  }
  return (
    <div>
      <h2>Map Grid (0,0 center)</h2>
      <table style={{ borderCollapse:'collapse' }}><tbody>{coords}</tbody></table>
    </div>
  )
}
