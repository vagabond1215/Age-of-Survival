import React from 'react'
import type { GameState } from '@game/state'

export default function Notifications({ state }:{ state: GameState }){
  if (!state.notifications.length) return null
  return (
    <div style={{ marginTop:12, padding:8, border:'1px solid #ddd', borderRadius:8, background:'#fffef5' }}>
      <b>Notifications</b>
      <ul>
        {state.notifications.map((n,i)=> <li key={i}>{n}</li>)}
      </ul>
    </div>
  )
}
