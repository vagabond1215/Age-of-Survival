import { isGameState, type GameState } from '../game/state';

const STORAGE_KEY = 'haven-savegame';

export function saveToLocalStorage(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadFromLocalStorage(): GameState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (isGameState(parsed)) {
      return parsed;
    }
    console.warn('Save did not match schema, ignoring');
    return null;
  } catch (error) {
    console.warn('Failed to parse save', error);
    return null;
  }
}

export function exportToFile(state: GameState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'savegame.json';
  link.click();
  URL.revokeObjectURL(url);
}

export async function importFromFile(file: File): Promise<GameState> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!isGameState(parsed)) {
    throw new Error('Imported save failed validation');
  }
  return parsed;
}

export function resetSave(): void {
  localStorage.removeItem(STORAGE_KEY);
}
