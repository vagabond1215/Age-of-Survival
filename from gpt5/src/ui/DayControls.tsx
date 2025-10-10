import React from 'react'

export default function DayControls({
  onNextDay, onAdvance3, pauseOnSummon, setPauseOnSummon
}:{
  onNextDay: ()=>void
  onAdvance3: ()=>void
  pauseOnSummon: boolean
  setPauseOnSummon: (v:boolean)=>void
}){
  return (
    <div style={{ display:'flex', gap:8, alignItems:'center', margin:'8px 0' }}>
      <button onClick={onNextDay}>Next Day</button>
      <button onClick={onAdvance3}>Advance 3 Days</button>
      <label style={{ marginLeft:12 }}>
        <input type="checkbox" checked={pauseOnSummon} onChange={e=>setPauseOnSummon(e.target.checked)} /> Pause on Summon
      </label>
    </div>
  )
}
