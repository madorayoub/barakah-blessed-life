import { describe, expect, it } from 'vitest'
import { calculatePrayerTimes } from './prayerTimes'

describe('calculatePrayerTimes', () => {
  it('falls back to North America parameters when method key is unknown', () => {
    const coordinates = { latitude: 40.7128, longitude: -74.006 }
    const date = new Date('2024-01-15T00:00:00Z')

    const fallback = calculatePrayerTimes(
      coordinates.latitude,
      coordinates.longitude,
      date,
      { calculation_method: 'UnknownMethod' }
    )

    const northAmerica = calculatePrayerTimes(
      coordinates.latitude,
      coordinates.longitude,
      date,
      { calculation_method: 'ISNA' }
    )

    const fallbackTimes = fallback.prayers.map((prayer) => prayer.time.getTime())
    const expectedTimes = northAmerica.prayers.map((prayer) => prayer.time.getTime())

    expect(fallbackTimes).toEqual(expectedTimes)
  })
})
