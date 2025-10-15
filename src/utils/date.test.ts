import { describe, expect, it } from 'vitest'
import { getLocalDateString, isSameLocalDate } from './date'

describe('getLocalDateString', () => {
  it('formats local dates as YYYY-MM-DD', () => {
    const date = new Date(2024, 0, 1, 12, 34, 56)
    expect(getLocalDateString(date)).toBe('2024-01-01')
  })

  it('rolls over when the local day changes', () => {
    const lateNight = new Date(2024, 5, 1, 23, 30, 0)
    const afterMidnight = new Date(lateNight.getTime() + 60 * 60 * 1000)
    expect(getLocalDateString(lateNight)).not.toBe(getLocalDateString(afterMidnight))
  })
})

describe('isSameLocalDate', () => {
  it('returns true for the same calendar day', () => {
    const morning = new Date(2024, 4, 10, 8, 0, 0)
    const evening = new Date(2024, 4, 10, 22, 0, 0)
    expect(isSameLocalDate(morning, evening)).toBe(true)
  })

  it('returns false for different days', () => {
    const beforeMidnight = new Date(2024, 4, 10, 23, 59, 0)
    const afterMidnight = new Date(beforeMidnight.getTime() + 120000)
    expect(isSameLocalDate(beforeMidnight, afterMidnight)).toBe(false)
  })
})
