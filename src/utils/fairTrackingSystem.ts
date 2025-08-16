/**
 * Comprehensive Fair Tracking System for Islamic Productivity
 * Research-backed approach to fair progress calculation and Islamic metrics
 */

import { differenceInDays, format, startOfDay, eachDayOfInterval } from 'date-fns'

export interface FairProgressData {
  userRegistrationDate: Date
  currentDate: Date
  activities: Array<{
    date: string
    completed: boolean
    activityType: 'prayer' | 'task' | 'dhikr' | 'quran'
    value?: number // for dhikr counts, etc.
  }>
}

export interface FairProgressResult {
  fairPercentage: number
  streakCount: number
  consistency: number
  totalPossibleDays: number
  totalCompletedDays: number
  completedActivities: number
  isFairTrackingActive: boolean
  daysSinceRegistration: number
}

export interface BarakahScore {
  spiritualActivities: number
  productiveActivities: number
  consistencyBonus: number
  timelyPrayers: number
  totalBarakah: number
  level: 'Novice' | 'Committed' | 'Devoted' | 'Exemplary' | 'Exceptional'
}

export interface IslamicMetrics {
  prayerConsistency: number
  prayersOnTime: number
  dhikrFrequency: number
  quranEngagement: number
  overallSpirituality: number
}

/**
 * Calculate fair progress from user's registration date (not calendar periods)
 */
export const calculateFairProgress = (data: FairProgressData): FairProgressResult => {
  const { userRegistrationDate, currentDate, activities } = data
  
  // Calculate days since registration (fair baseline)
  const daysSinceRegistration = Math.max(1, differenceInDays(currentDate, userRegistrationDate) + 1)
  const possibleDays = daysSinceRegistration
  
  // Count completed activities
  const completedActivities = activities.filter(activity => activity.completed).length
  
  // Calculate unique days with completed activities
  const completedDays = new Set(
    activities
      .filter(activity => activity.completed)
      .map(activity => activity.date)
  ).size
  
  // Calculate consecutive streak
  const streakCount = calculateConsecutiveStreak(activities, currentDate)
  
  // Fair percentage calculation
  const fairPercentage = Math.min((completedDays / possibleDays) * 100, 100)
  const consistency = completedDays / possibleDays
  
  // Fair tracking is active for first 7 days
  const isFairTrackingActive = daysSinceRegistration <= 7
  
  return {
    fairPercentage,
    streakCount,
    consistency,
    totalPossibleDays: possibleDays,
    totalCompletedDays: completedDays,
    completedActivities,
    isFairTrackingActive,
    daysSinceRegistration
  }
}

/**
 * Calculate consecutive streak of completed days
 */
const calculateConsecutiveStreak = (activities: FairProgressData['activities'], currentDate: Date): number => {
  let streak = 0
  let checkDate = startOfDay(currentDate)
  
  // Go backwards from today to find consecutive completed days
  for (let i = 0; i < 30; i++) {
    const dateStr = format(checkDate, 'yyyy-MM-dd')
    const dayActivities = activities.filter(a => a.date === dateStr && a.completed)
    
    // For prayers, require all 5 prayers; for tasks, require at least 1
    const isPrayerDay = dayActivities.some(a => a.activityType === 'prayer')
    const hasAllPrayers = isPrayerDay ? dayActivities.filter(a => a.activityType === 'prayer').length === 5 : false
    const hasOtherActivities = dayActivities.some(a => a.activityType !== 'prayer')
    
    if (hasAllPrayers || (!isPrayerDay && hasOtherActivities)) {
      streak++
      checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000) // Previous day
    } else {
      break
    }
  }
  
  return streak
}

/**
 * Calculate Islamic-specific Barakah Score
 */
export const calculateBarakahScore = (
  prayerData: Array<{ completed: boolean; onTime: boolean }>,
  taskData: Array<{ completed: boolean; isIslamicTask: boolean }>,
  dhikrData: Array<{ count: number }>,
  quranData: Array<{ minutesRead: number }>,
  streakDays: number
): BarakahScore => {
  
  // Spiritual activities (higher weight)
  const completedPrayers = prayerData.filter(p => p.completed).length
  const onTimePrayers = prayerData.filter(p => p.completed && p.onTime).length
  const totalDhikr = dhikrData.reduce((sum, d) => sum + d.count, 0)
  const totalQuranMinutes = quranData.reduce((sum, q) => sum + q.minutesRead, 0)
  
  const spiritualActivities = (
    (completedPrayers * 3) + // Prayer completion (weight: 3)
    (onTimePrayers * 2) +     // On-time prayers (weight: 2)  
    (totalDhikr * 0.1) +      // Dhikr count (weight: 0.1)
    (totalQuranMinutes * 0.5) // Quran reading (weight: 0.5)
  )
  
  // Productive activities (medium weight)
  const completedTasks = taskData.filter(t => t.completed).length
  const islamicTasks = taskData.filter(t => t.completed && t.isIslamicTask).length
  
  const productiveActivities = (
    (completedTasks * 1) +    // Regular tasks (weight: 1)
    (islamicTasks * 1.5)      // Islamic tasks (weight: 1.5)
  )
  
  // Consistency bonus
  const consistencyBonus = streakDays * 2
  
  // Prayer timeliness ratio
  const timelyPrayers = prayerData.length > 0 ? onTimePrayers / prayerData.length : 0
  
  // Total Barakah score
  const totalBarakah = spiritualActivities + productiveActivities + consistencyBonus
  
  // Determine level based on score
  let level: BarakahScore['level'] = 'Novice'
  if (totalBarakah >= 500) level = 'Exceptional'
  else if (totalBarakah >= 300) level = 'Exemplary'
  else if (totalBarakah >= 150) level = 'Devoted'
  else if (totalBarakah >= 50) level = 'Committed'
  
  return {
    spiritualActivities,
    productiveActivities,
    consistencyBonus,
    timelyPrayers,
    totalBarakah,
    level
  }
}

/**
 * Calculate Islamic-specific metrics
 */
export const calculateIslamicMetrics = (
  prayerCompletions: Array<{ prayer_name: string; completed_on_time: boolean }>,
  dhikrSessions: Array<{ count: number }>,
  quranSessions: Array<{ minutes: number }>,
  daysSinceJoining: number
): IslamicMetrics => {
  
  const totalDays = Math.max(1, daysSinceJoining)
  
  // Prayer consistency (0-100)
  const totalPossiblePrayers = totalDays * 5
  const prayerConsistency = totalPossiblePrayers > 0 
    ? (prayerCompletions.length / totalPossiblePrayers) * 100 
    : 0
  
  // Prayers on time percentage (0-100)
  const onTimePrayers = prayerCompletions.filter(p => p.completed_on_time).length
  const prayersOnTime = prayerCompletions.length > 0 
    ? (onTimePrayers / prayerCompletions.length) * 100 
    : 0
  
  // Dhikr frequency (sessions per day)
  const dhikrFrequency = dhikrSessions.length / totalDays
  
  // Quran engagement (minutes per day)
  const totalQuranMinutes = quranSessions.reduce((sum, session) => sum + session.minutes, 0)
  const quranEngagement = totalQuranMinutes / totalDays
  
  // Overall spirituality score (0-100)
  const overallSpirituality = (
    (prayerConsistency * 0.4) +
    (prayersOnTime * 0.3) +
    (Math.min(dhikrFrequency * 20, 100) * 0.2) +
    (Math.min(quranEngagement * 5, 100) * 0.1)
  )
  
  return {
    prayerConsistency,
    prayersOnTime,
    dhikrFrequency,
    quranEngagement,
    overallSpirituality
  }
}

/**
 * Get motivational message based on progress and Islamic values
 */
export const getIslamicMotivationalMessage = (
  fairProgress: FairProgressResult,
  barakahScore: BarakahScore,
  islamicMetrics: IslamicMetrics
): string => {
  
  const { daysSinceRegistration, streakCount, fairPercentage } = fairProgress
  const { level } = barakahScore
  const { prayerConsistency, overallSpirituality } = islamicMetrics
  
  // New user messages (first 3 days)
  if (daysSinceRegistration <= 3) {
    if (daysSinceRegistration === 1) {
      return "Bismillah! Begin your spiritual journey with intention. Every act of worship is a step closer to Allah ﷻ."
    }
    return `Day ${daysSinceRegistration} of your journey! You're building beautiful foundations in Islam. Keep going!`
  }
  
  // Based on streak
  if (streakCount >= 14) {
    return `Masha'Allah! ${streakCount} days of consistency - your dedication is inspiring! May Allah ﷻ accept your efforts.`
  } else if (streakCount >= 7) {
    return `Excellent progress! ${streakCount} days of worship consistency. You're developing strong Islamic habits!`
  }
  
  // Based on prayer consistency
  if (prayerConsistency >= 90) {
    return "Your prayer consistency is exceptional! May these acts of worship bring you closer to Allah ﷻ."
  } else if (prayerConsistency >= 70) {
    return "Great progress on your prayers! Consistency in worship brings immense barakah."
  }
  
  // Based on Barakah level
  if (level === 'Exceptional' || level === 'Exemplary') {
    return `Your ${level.toLowerCase()} dedication to Islam is beautiful! Keep seeking Allah's ﷻ pleasure in all you do.`
  }
  
  // Encouraging message for those starting or struggling
  return "Every prayer, every good deed counts. Start fresh today and build your connection with Allah ﷻ."
}

/**
 * Get progress insights with Islamic perspective
 */
export const getProgressInsights = (
  fairProgress: FairProgressResult,
  islamicMetrics: IslamicMetrics
): Array<{ title: string; description: string; type: 'success' | 'warning' | 'info' }> => {
  const insights = []
  
  // Fair tracking insight
  if (fairProgress.isFairTrackingActive) {
    insights.push({
      title: 'Fair Tracking Active',
      description: 'Your progress is calculated from your join date, not calendar periods - ensuring fair measurement!',
      type: 'info' as const
    })
  }
  
  // Prayer insights
  if (islamicMetrics.prayerConsistency >= 80) {
    insights.push({
      title: 'Excellent Prayer Discipline',
      description: 'Your prayer consistency shows strong commitment to Allah ﷻ.',
      type: 'success' as const
    })
  } else if (islamicMetrics.prayerConsistency < 50) {
    insights.push({
      title: 'Prayer Opportunity',
      description: 'Focus on establishing regular prayer times for spiritual growth.',
      type: 'warning' as const
    })
  }
  
  // Streak insights
  if (fairProgress.streakCount >= 7) {
    insights.push({
      title: 'Strong Consistency',
      description: `${fairProgress.streakCount} days of consistent practice! Keep building this beautiful habit.`,
      type: 'success' as const
    })
  }
  
  return insights
}

// Export all utilities as a centralized system
export const FairTrackingSystem = {
  calculateFairProgress,
  calculateBarakahScore,
  calculateIslamicMetrics,
  getIslamicMotivationalMessage,
  getProgressInsights
}