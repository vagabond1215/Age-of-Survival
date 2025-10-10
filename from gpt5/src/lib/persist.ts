import type { GameState } from '@game/state'

const KEY = 'haven-web-save'

export function saveToLocal(state: GameState){
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function loadFromLocal(): GameState | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as GameState } catch { return null }
}

export function exportToFile(state: GameState){
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'savegame.json'
  a.click()
  URL.revokeObjectURL(a.href)
}

export function importFromFile(): Promise<GameState | null>{
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return resolve(null)
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result)) as GameState
          resolve(parsed)
        } catch {
          resolve(null)
        }
      }
      reader.readAsText(file)
    }
    input.click()
  })
}
