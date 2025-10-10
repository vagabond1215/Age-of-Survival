import type { GameState } from './state'
import { SUMMON_THRESHOLD } from './constants'

function clamp(v:number, min=0){ return v < min ? min : v }

export function advanceDay(state: GameState): GameState {
  // Single writer: clone -> mutate -> return new
  const s: GameState = JSON.parse(JSON.stringify(state))
  s.day += 1
  s.notifications = []

  // --- Production (toy example; replace with real job math) ---
  // base
  let foodGain = 2, woodGain = 1, stoneGain = 1
  if (s.features.includes('river')) foodGain += 1
  if (s.features.includes('forest')) woodGain += 1
  if (s.features.includes('mine')) stoneGain += 1

  // villagers contribute by role (very simplified baseline)
  const byRole = (role:string) => s.villagers.filter(v=>v.role===role).length
  foodGain += byRole('farmer') * 2 + byRole('fisher') * 2 + byRole('hunter') * 1
  woodGain += byRole('lumberjack') * 2
  stoneGain += byRole('miner') * 2

  // --- Consumption ---
  const foodUse = Math.max(0, s.villagers.length) // 1 per villager
  const firewoodUse = Math.ceil(s.villagers.length/8)

  // Apply
  s.resources.food = clamp(s.resources.food + foodGain - foodUse)
  s.resources.firewood = clamp(s.resources.firewood - firewoodUse)
  s.resources.logs = clamp(s.resources.logs + woodGain)
  s.resources.stone = clamp(s.resources.stone + stoneGain)

  s.deltas.food = foodGain - foodUse
  s.deltas.firewood = -firewoodUse
  s.deltas.logs = woodGain
  s.deltas.stone = stoneGain

  // --- Construction / Crafting stubs handled in other modules ---

  // --- Capacity recount ---
  s.capacity = s.buildings
    .filter(b=>b.kind==='longhouse' && b.status==='complete')
    .reduce((acc,b)=> acc + (b.capacity ?? 0), 0)

  // --- Interrupts ---
  const spareBeds = s.capacity - s.villagers.length
  if (spareBeds >= 1 && s.resources.food >= SUMMON_THRESHOLD){
    s.pauseReason = 'summon'
    s.notifications.push('Summoning threshold reached: choose new roles.')
  } else {
    s.pauseReason = undefined
  }

  return s
}

export function advanceDays(state: GameState, days: number, pauseOnSummon=true): GameState {
  let s = state
  for (let i=0;i<days;i++){
    const next = advanceDay(s)
    s = next
    if (pauseOnSummon && s.pauseReason){ break }
  }
  return s
}
