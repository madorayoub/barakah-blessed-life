import { CalculationMethod, PrayerTimes, Coordinates, CalculationParameters, Madhab, HighLatitudeRule } from 'adhan'

export interface PrayerTime {
  name: string
  time: Date
  displayName: string
}

export interface DailyPrayerTimes {
  date: Date
  prayers: PrayerTime[]
  coordinates: Coordinates
}

export interface PrayerSettings {
  calculation_method: string
  madhab: string
  high_latitude_rule: string
  fajr_adjustment: number
  dhuhr_adjustment: number
  asr_adjustment: number
  maghrib_adjustment: number
  isha_adjustment: number
}

const methodMap: Record<string, () => CalculationParameters> = {
  'ISNA': CalculationMethod.NorthAmerica,
  'MuslimWorldLeague': CalculationMethod.MuslimWorldLeague,
  'Karachi': CalculationMethod.Karachi,
  'UmmAlQura': CalculationMethod.UmmAlQura,
  'Egyptian': CalculationMethod.Egyptian,
  'Tehran': CalculationMethod.Tehran,
  'Kuwait': CalculationMethod.Kuwait,
  'Qatar': CalculationMethod.Qatar,
  'Singapore': CalculationMethod.Singapore
}

const madhabMap: Record<string, typeof Madhab.Shafi | typeof Madhab.Hanafi> = {
  'Shafi': Madhab.Shafi,
  'Hanafi': Madhab.Hanafi
}

const highLatitudeRuleMap: Record<string, typeof HighLatitudeRule.MiddleOfTheNight | typeof HighLatitudeRule.SeventhOfTheNight | typeof HighLatitudeRule.TwilightAngle> = {
  'MiddleOfTheNight': HighLatitudeRule.MiddleOfTheNight,
  'SeventhOfTheNight': HighLatitudeRule.SeventhOfTheNight,
  'TwilightAngle': HighLatitudeRule.TwilightAngle
}

export function calculatePrayerTimes(
  latitude: number,
  longitude: number,
  date: Date,
  settings?: Partial<PrayerSettings>
): DailyPrayerTimes {
  const coordinates = new Coordinates(latitude, longitude)
  
  // Get calculation parameters
  const method = methodMap[settings?.calculation_method || 'ISNA']
  let params = method()
  
  // Apply madhab
  if (settings?.madhab) {
    params.madhab = madhabMap[settings.madhab]
  }
  
  // Apply high latitude rule
  if (settings?.high_latitude_rule) {
    params.highLatitudeRule = highLatitudeRuleMap[settings.high_latitude_rule]
  }
  
  // Apply manual adjustments (in minutes)
  if (settings?.fajr_adjustment) {
    params.adjustments.fajr = settings.fajr_adjustment
  }
  if (settings?.dhuhr_adjustment) {
    params.adjustments.dhuhr = settings.dhuhr_adjustment
  }
  if (settings?.asr_adjustment) {
    params.adjustments.asr = settings.asr_adjustment
  }
  if (settings?.maghrib_adjustment) {
    params.adjustments.maghrib = settings.maghrib_adjustment
  }
  if (settings?.isha_adjustment) {
    params.adjustments.isha = settings.isha_adjustment
  }
  
  // Calculate prayer times
  const prayerTimes = new PrayerTimes(coordinates, date, params)
  
  return {
    date,
    coordinates,
    prayers: [
      {
        name: 'fajr',
        displayName: 'Fajr',
        time: prayerTimes.fajr
      },
      {
        name: 'dhuhr',
        displayName: 'Dhuhr', 
        time: prayerTimes.dhuhr
      },
      {
        name: 'asr',
        displayName: 'Asr',
        time: prayerTimes.asr
      },
      {
        name: 'maghrib',
        displayName: 'Maghrib',
        time: prayerTimes.maghrib
      },
      {
        name: 'isha',
        displayName: 'Isha',
        time: prayerTimes.isha
      }
    ]
  }
}

export function getNextPrayer(prayerTimes: DailyPrayerTimes): PrayerTime | null {
  const now = new Date()
  
  for (const prayer of prayerTimes.prayers) {
    if (prayer.time > now) {
      return prayer
    }
  }
  
  // If no prayers left today, return first prayer of tomorrow
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowPrayers = calculatePrayerTimes(
    prayerTimes.coordinates.latitude,
    prayerTimes.coordinates.longitude,
    tomorrow
  )
  
  return tomorrowPrayers.prayers[0] || null
}

export function getCurrentPrayer(prayerTimes: DailyPrayerTimes): PrayerTime | null {
  const now = new Date()
  let currentPrayer: PrayerTime | null = null
  
  for (const prayer of prayerTimes.prayers) {
    if (prayer.time <= now) {
      currentPrayer = prayer
    } else {
      break
    }
  }
  
  return currentPrayer
}

export function formatPrayerTime(time: Date): string {
  return time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export function getTimeUntilPrayer(prayerTime: Date): string {
  const now = new Date()
  const diff = prayerTime.getTime() - now.getTime()
  
  if (diff <= 0) {
    return 'Now'
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}