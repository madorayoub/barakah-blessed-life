import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, isToday, subDays, eachDayOfInterval } from 'date-fns'
import { FairTrackingSystem, calculateIslamicMetrics, calculateBarakahScore, getIslamicMotivationalMessage } from '@/utils/fairTrackingSystem'

export interface PrayerStats {
  totalPrayers: number
  completedPrayers: number
  completionRate: number
  currentStreak: number
  longestStreak: number
  missedByPrayer: Record<string, number>
  weeklyData: { date: string; completed: number; total: number }[]
  monthlyHeatmap: { date: string; count: number }[]
  fairProgress: number
  barakahScore: number
  islamicMetrics: {
    prayerConsistency: number
    prayersOnTime: number
    dhikrFrequency: number
    quranEngagement: number
    overallSpirituality: number
  }
}

export interface TaskStats {
  totalTasks: number
  completedTasks: number
  completionRate: number
  byCategory: { category: string; completed: number; total: number }[]
  weeklyTrend: { week: string; completed: number }[]
  fairProgress: number
  productivityScore: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: Date
  progress?: number
  target?: number
}

export function useAnalytics() {
  const { user } = useAuth()
  const [prayerStats, setPrayerStats] = useState<PrayerStats | null>(null)
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  const calculatePrayerStats = async () => {
    if (!user) return

    const now = new Date()
    const userCreatedAt = new Date(user.created_at)
    
    // Use user registration date as the starting point (FAIR TRACKING)
    const trackingStartDate = userCreatedAt
    const weekTrackingStart = userCreatedAt > startOfWeek(now, { weekStartsOn: 1 }) ? userCreatedAt : startOfWeek(now, { weekStartsOn: 1 })
    
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

    // Get prayer completions from user registration date forward
    const { data: completions, error } = await supabase
      .from('prayer_completions')
      .select('*')
      .eq('user_id', user.id)
      .gte('prayer_date', format(trackingStartDate, 'yyyy-MM-dd'))

    if (error) {
      console.error('Error fetching prayer completions:', error)
      return
    }

    // Calculate fair stats using centralized system
    const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']
    const daysTracked = eachDayOfInterval({ start: trackingStartDate, end: now })
    const totalPossiblePrayers = daysTracked.length * prayers.length
    const completedPrayers = completions?.length || 0

    // Use Fair Tracking System for progress calculation
    const activities = completions?.map(completion => ({
      date: completion.prayer_date,
      completed: true,
      activityType: 'prayer' as const
    })) || []

    const fairProgress = FairTrackingSystem.calculateFairProgress({
      userRegistrationDate: userCreatedAt,
      currentDate: now,
      activities
    })

    // Calculate Islamic metrics (simplified for now - will enhance when DB supports timing)
    const islamicMetrics = {
      prayerConsistency: totalPossiblePrayers > 0 ? (completedPrayers / totalPossiblePrayers) * 100 : 0,
      prayersOnTime: 85, // Default assumption - can be enhanced later
      dhikrFrequency: 0, // To be implemented
      quranEngagement: 0, // To be implemented
      overallSpirituality: totalPossiblePrayers > 0 ? (completedPrayers / totalPossiblePrayers) * 85 : 0
    }

    // Calculate Barakah score
    const prayerData = completions?.map(c => ({ 
      completed: true, 
      onTime: true // Default assumption for now
    })) || []
    
    const barakahScore = calculateBarakahScore(
      prayerData,
      [], // task data (calculated in task stats)
      [], // dhikr data
      [], // quran data
      fairProgress.streakCount
    )

    // Calculate missed prayers by type (fair calculation from registration date)
    const missedByPrayer: Record<string, number> = {}
    prayers.forEach(prayer => {
      const prayerCompletions = completions?.filter(c => c.prayer_name === prayer).length || 0
      missedByPrayer[prayer] = daysTracked.length - prayerCompletions
    })

    // Calculate weekly data for chart (fair calculation from user join date)
    const weeklyData = eachDayOfInterval({ start: weekTrackingStart, end: weekEnd }).map(date => {
      const dateStr = format(date, 'yyyy-MM-dd')
      const dayCompletions = completions?.filter(c => c.prayer_date === dateStr).length || 0
      return {
        date: format(date, 'EEE'),
        completed: dayCompletions,
        total: 5
      }
    })

    // Calculate monthly heatmap (from user tracking date)
    const monthlyHeatmap = daysTracked.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd')
      const count = completions?.filter(c => c.prayer_date === dateStr).length || 0
      return {
        date: dateStr,
        count
      }
    })

    setPrayerStats({
      totalPrayers: totalPossiblePrayers,
      completedPrayers,
      completionRate: fairProgress.fairPercentage,
      currentStreak: fairProgress.streakCount,
      longestStreak: fairProgress.streakCount, // Can be enhanced later
      missedByPrayer,
      weeklyData,
      monthlyHeatmap,
      fairProgress: fairProgress.fairPercentage,
      barakahScore: barakahScore.totalBarakah,
      islamicMetrics: {
        prayerConsistency: islamicMetrics.prayerConsistency,
        prayersOnTime: islamicMetrics.prayersOnTime,
        dhikrFrequency: islamicMetrics.dhikrFrequency,
        quranEngagement: islamicMetrics.quranEngagement,
        overallSpirituality: islamicMetrics.overallSpirituality
      }
    })
  }

  const calculateTaskStats = async () => {
    if (!user) return

    const now = new Date()
    const userCreatedAt = new Date(user.created_at)

    // Use fair tracking - get tasks from registration date forward
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select(`
        *,
        task_categories(name, color)
      `)
      .eq('user_id', user.id)
      .gte('created_at', userCreatedAt.toISOString())

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError)
      return
    }

    const totalTasks = tasks?.length || 0
    const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0
    
    // Use fair tracking for completion rate
    const activities = tasks?.map(task => ({
      date: format(new Date(task.created_at), 'yyyy-MM-dd'),
      completed: task.status === 'completed',
      activityType: 'task' as const
    })) || []

    const fairProgress = FairTrackingSystem.calculateFairProgress({
      userRegistrationDate: userCreatedAt,
      currentDate: now,
      activities
    })

    // Group by category
    const categoryMap = new Map()
    tasks?.forEach(task => {
      const categoryName = task.task_categories?.name || 'Uncategorized'
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, { completed: 0, total: 0 })
      }
      const stats = categoryMap.get(categoryName)
      stats.total++
      if (task.status === 'completed') {
        stats.completed++
      }
    })

    const byCategory = Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      completed: stats.completed,
      total: stats.total
    }))

    // Calculate productivity score
    const daysSinceJoining = Math.floor((Date.now() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const tasksPerDay = totalTasks / daysSinceJoining
    const productivityScore = Math.min((tasksPerDay * completedTasks * fairProgress.consistency) * 10, 100)

    setTaskStats({
      totalTasks,
      completedTasks,
      completionRate: fairProgress.fairPercentage,
      byCategory,
      weeklyTrend: [], // Can be enhanced later
      fairProgress: fairProgress.fairPercentage,
      productivityScore
    })
  }

  const calculateAchievements = () => {
    const achievementsList: Achievement[] = [
      {
        id: 'prayer-streak-3',
        title: 'Consistent Worshipper',
        description: 'Complete all 5 prayers for 3 days in a row',
        icon: '🕌',
        earned: (prayerStats?.currentStreak || 0) >= 3,
        progress: prayerStats?.currentStreak || 0,
        target: 3
      },
      {
        id: 'prayer-streak-7',
        title: 'Week of Worship',
        description: 'Complete all 5 prayers for 7 days in a row',
        icon: '⭐',
        earned: (prayerStats?.currentStreak || 0) >= 7,
        progress: prayerStats?.currentStreak || 0,
        target: 7
      },
      {
        id: 'prayer-completion-90',
        title: 'Devotion Master',
        description: 'Achieve 90% prayer completion rate this month',
        icon: '🏆',
        earned: (prayerStats?.completionRate || 0) >= 90,
        progress: prayerStats?.completionRate || 0,
        target: 90
      },
      {
        id: 'task-completion-80',
        title: 'Productive Muslim',
        description: 'Complete 80% of your tasks this month',
        icon: '✅',
        earned: (taskStats?.completionRate || 0) >= 80,
        progress: taskStats?.completionRate || 0,
        target: 80
      }
    ]

    setAchievements(achievementsList)
  }

  useEffect(() => {
    if (user) {
      Promise.all([
        calculatePrayerStats(),
        calculateTaskStats()
      ]).finally(() => {
        setLoading(false)
      })
    }
  }, [user])

  useEffect(() => {
    if (prayerStats && taskStats) {
      calculateAchievements()
    }
  }, [prayerStats, taskStats])

  const getMotivationalMessage = () => {
    if (!prayerStats || !taskStats || !user) return "Keep up your spiritual journey!"

    const userCreatedAt = new Date(user.created_at)
    const daysSinceJoining = Math.floor((Date.now() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24)) + 1
    
    // Use the research-backed Islamic motivational system
    const fairProgress = {
      daysSinceRegistration: daysSinceJoining,
      streakCount: prayerStats.currentStreak,
      fairPercentage: prayerStats.fairProgress,
      isFairTrackingActive: daysSinceJoining <= 7,
      consistency: prayerStats.completionRate / 100,
      totalPossibleDays: daysSinceJoining,
      totalCompletedDays: Math.floor((prayerStats.completionRate / 100) * daysSinceJoining),
      completedActivities: prayerStats.completedPrayers
    }
    
    const barakahScore = {
      level: 'Committed' as const, // Simplified for now
      totalBarakah: prayerStats.barakahScore,
      spiritualActivities: prayerStats.completedPrayers,
      productiveActivities: taskStats.completedTasks,
      consistencyBonus: prayerStats.currentStreak * 2,
      timelyPrayers: prayerStats.islamicMetrics.prayersOnTime / 100
    }

    return getIslamicMotivationalMessage(fairProgress, barakahScore, prayerStats.islamicMetrics)
  }

  const getQuranVerse = () => {
    const verses = [
      "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ - And establish prayer and give zakah (Quran 2:43)",
      "إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ - Indeed, prayer prohibits immorality and wrongdoing (Quran 29:45)",
      "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ - And seek help through patience and prayer (Quran 2:45)"
    ]
    return verses[Math.floor(Math.random() * verses.length)]
  }

  const getDaysSinceJoining = () => {
    if (!user) return 0
    const userCreatedAt = new Date(user.created_at)
    return Math.floor((Date.now() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24)) + 1
  }

  return {
    prayerStats,
    taskStats,
    achievements,
    loading,
    getMotivationalMessage,
    getQuranVerse,
    getDaysSinceJoining,
    refreshStats: () => {
      calculatePrayerStats()
      calculateTaskStats()
    }
  }
}