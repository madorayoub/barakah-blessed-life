import { describe, expect, it } from 'vitest'
import { isPrayerNotificationTag, PRAYER_NOTIFICATION_TAG } from './notifications'

describe('isPrayerNotificationTag', () => {
  it('returns true for the shared prayer tag', () => {
    expect(isPrayerNotificationTag(PRAYER_NOTIFICATION_TAG)).toBe(true)
  })

  it('returns false for old per-prayer tags', () => {
    expect(isPrayerNotificationTag('prayer-fajr')).toBe(false)
  })

  it('returns false for unrelated tags', () => {
    expect(isPrayerNotificationTag('task-reminder')).toBe(false)
    expect(isPrayerNotificationTag(undefined)).toBe(false)
  })
})
