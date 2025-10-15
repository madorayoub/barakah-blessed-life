import { describe, expect, it } from 'vitest'
import { isPrayerNotificationTag, PRAYER_NOTIFICATION_PREFIX } from './notifications'

describe('isPrayerNotificationTag', () => {
  it('returns true for the shared prayer tag', () => {
    expect(isPrayerNotificationTag('prayer')).toBe(true)
  })

  it('returns true for prayer reminders with prefixes', () => {
    expect(isPrayerNotificationTag(`${PRAYER_NOTIFICATION_PREFIX}fajr`)).toBe(true)
  })

  it('returns false for unrelated tags', () => {
    expect(isPrayerNotificationTag('task-reminder')).toBe(false)
    expect(isPrayerNotificationTag(undefined)).toBe(false)
  })
})
