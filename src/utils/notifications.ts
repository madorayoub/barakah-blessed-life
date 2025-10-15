export const PRAYER_NOTIFICATION_TAG = 'prayer'

export function isPrayerNotificationTag(tag: string | undefined | null): boolean {
  return tag === PRAYER_NOTIFICATION_TAG
}
