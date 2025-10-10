import React from 'react'
import type { GameState } from '@game/state'
import { ICONS } from '@game/constants'

export default function ResourceBar({ state }: { state: GameState }) {
  const rows = [
    ['food','Food'], ['firewood','Firewood'], ['logs','Logs'], ['stone','Stone'],
    ['clay','Clay'], ['ore','Ore'], ['leather','Leather'], ['cloth','Cloth'],
    ['tools','Tools'], ['armor','Armor']
  ] as const

  return (
    <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', padding:'8px 0' }}>
      {rows.map(([k,label]) => {
        const icon = (ICONS as any)[k]
        const stock = (state.resources as any)[k]
        const delta = (state.deltas as any)[k] ?? 0
        const tip = `Stock: ${stock} · Δ/day: ${delta >=0 ? '+'+delta : delta}`
        return (
          <span key={k} title={tip} style={{ border:'1px solid #ddd', borderRadius:6, padding:'4px 8px' }}>
            <span style={{ marginRight:6 }}>{icon}</span>{label}: <b>{stock}</b>
            <span style={{ marginLeft:6, opacity:0.7 }}>{delta>=0?`+${delta}`:delta}</span>
          </span>
        )
      })}
    </div>
  )
}
