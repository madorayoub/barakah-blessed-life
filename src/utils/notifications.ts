export const PRAYER_NOTIFICATION_PREFIX = 'prayer-'

export function isPrayerNotificationTag(tag: string | undefined | null): boolean {
  if (!tag) return false
  return tag === 'prayer' || tag.startsWith(PRAYER_NOTIFICATION_PREFIX)
}
