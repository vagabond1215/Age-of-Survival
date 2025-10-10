import { describe, it, expect } from 'vitest'

describe('replacement accounting', () => {
  it('adds only net capacity when renovating and subtracts old first on replacement', () => {
    // Example only; real tests should import the construction system once implemented.
    const oldCapacity = 4
    const newCapacity = 6
    const replacementNet = newCapacity // after subtracting old first
    expect(replacementNet).toBe(6)
    const renovationNet = newCapacity - oldCapacity
    expect(renovationNet).toBe(2)
  })
})
