import { describe, it, expect } from 'vitest'
import { defaultState } from '../src/game/state'
import { advanceDays } from '../src/game/engine'

describe('day tick determinism', () => {
  it('advances 3 days consistently', () => {
    const a = advanceDays(defaultState(), 3, false)
    const b = advanceDays(defaultState(), 3, false)
    expect(a).toEqual(b)
  })
})
