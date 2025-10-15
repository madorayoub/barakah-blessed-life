import { describe, expect, it } from 'vitest'
import { determineRecurringWeekday, shouldCreateRecurringTask } from './recurrence'

describe('determineRecurringWeekday', () => {
  it('returns the explicit weekday when provided', () => {
    expect(determineRecurringWeekday({ recurring_weekday: 2 })).toBe(2)
  })

  it('falls back to due_date when weekday is missing', () => {
    expect(determineRecurringWeekday({ due_date: '2024-06-07' })).toBe(5)
  })

  it('falls back to created_at when other fields are missing', () => {
    expect(determineRecurringWeekday({ created_at: '2024-06-08T10:00:00Z' })).toBe(6)
  })
})

describe('shouldCreateRecurringTask', () => {
  it('returns true when no tasks exist for the target day', () => {
    expect(shouldCreateRecurringTask([], new Date(2024, 0, 1))).toBe(true)
  })

  it('returns false when a task already exists for that day', () => {
    const existing = [{ due_date: '2024-01-01' }]
    expect(shouldCreateRecurringTask(existing, new Date(2024, 0, 1))).toBe(false)
  })
})
