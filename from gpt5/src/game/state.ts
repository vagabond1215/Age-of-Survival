export type Biome = 'temperate' | 'boreal' | 'desert' | 'coastal' | 'alpine'
export type Feature = 'river' | 'lake' | 'mine' | 'forest'
export type Role =
  | 'leader' | 'forager' | 'builder' | 'guard' | 'lumberjack' | 'fisher'
  | 'farmer' | 'miner' | 'cook' | 'craftsman' | 'herbalist' | 'hunter'
  | 'tailor' | 'leatherworker' | 'carpenter' | 'mason' | 'armorer'
  | 'apprentice_smith' | 'apprentice_mason' | 'apprentice_cook'
  | 'scout'

export interface Villager {
  id: string
  name: string
  role: Role
  bed: string // longhouse id + slot
  efficiency: number // 0..1+
}

export interface Resources {
  food: number; firewood: number; logs: number; stone: number; clay: number; ore: number;
  leather: number; cloth: number; tools: number; armor: number;
}

export interface Deltas {
  food: number; firewood: number; logs: number; stone: number; clay: number; ore: number;
  leather: number; cloth: number; tools: number; armor: number;
}

export interface Building {
  slug: string // building_slug(x,y,tier,status,capacity)
  x: number; y: number; tier: number; status: 'complete' | 'building' | 'queued'
  capacity?: number
  kind: 'longhouse' | 'workshop' | 'kiln' | 'granary' | 'palisade' | 'watchtower' | 'dock' | 'roads' | 'hearth'
}

export interface GameState {
  day: number
  biome: Biome
  features: Feature[]
  villagers: Villager[]
  buildings: Building[]
  resources: Resources
  deltas: Deltas
  capacity: number
  notifications: string[]
  pauseReason?: 'summon' | 'event' | 'deficit' | undefined
}

export const defaultState = (): GameState => ({
  day: 1,
  biome: 'temperate',
  features: ['river','forest','mine'],
  villagers: [],
  buildings: [
    { slug: 'hearth(0,0,1,complete,0)', x:0, y:0, tier:1, status:'complete', kind:'hearth' },
    { slug: 'longhouse(0,1,1,complete,6)', x:0, y:1, tier:1, status:'complete', capacity:6, kind:'longhouse' },
    { slug: 'workshop(1,1,2,complete,0)', x:1, y:1, tier:2, status:'complete', kind:'workshop' },
    { slug: 'granary(-1,1,1,complete,0)', x:-1, y:1, tier:1, status:'complete', kind:'granary' },
    { slug: 'dock(0,-1,1,complete,0)', x:0, y:-1, tier:1, status:'complete', kind:'dock' }
  ],
  resources: { food: 20, firewood: 15, logs: 10, stone: 8, clay: 3, ore: 2, leather: 1, cloth: 1, tools: 2, armor: 0 },
  deltas:   { food: 0,  firewood: 0,  logs: 0,  stone: 0,  clay: 0,  ore: 0,  leather: 0,  cloth: 0,  tools: 0,  armor: 0 },
  capacity: 6,
  notifications: []
})
