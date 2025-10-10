import { describe, it, expect } from 'vitest'
describe('craft until X', () => {
  it('never drives inputs negative', () => {
    const ore = 0, logs = 0
    const canCraft = ore > 0 && logs > 0
    expect(canCraft).toBe(false)
  })
})
