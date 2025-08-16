import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, isToday, subDays, eachDayOfInterval } from 'date-fns'

interface PrayerStats {
  totalPrayers: number
  completedPrayers: number
  completionRate: number
  currentStreak: number
  longestStreak: number
  missedByPrayer: Record<string, number>
  weeklyData: { date: string; completed: number; total: number }[]
  monthlyHeatmap: { date: string; count: number }[]
}

interface TaskStats {
  totalTasks: number
  completedTasks: number
  completionRate: number
  byCategory: { category: string; completed: number; total: number }[]
  weeklyTrend: { week: string; completed: number }[]
}

interface Achievement {
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
    
    // Use user registration date as the starting point, not calendar periods
    const trackingStartDate = userCreatedAt > startOfMonth(now) ? userCreatedAt : startOfMonth(now)
    const weekTrackingStart = userCreatedAt > startOfWeek(now, { weekStartsOn: 1 }) ? userCreatedAt : startOfWeek(now, { weekStartsOn: 1 })
    
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
    const monthEnd = endOfMonth(now)

    // Get prayer completions from user registration date forward
    const { data: completions, error } = await supabase
      .from('prayer_completions')
      .select('*')
      .eq('user_id', user.id)
      .gte('prayer_date', format(trackingStartDate, 'yyyy-MM-dd'))
      .lte('prayer_date', format(monthEnd, 'yyyy-MM-dd'))

    if (error) {
      console.error('Error fetching prayer completions:', error)
      return
    }

    // Calculate fair stats based on days since registration
    const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']
    const daysTracked = eachDayOfInterval({ start: trackingStartDate, end: now })
    const totalPossiblePrayers = daysTracked.length * prayers.length
    const completedPrayers = completions?.length || 0
    const completionRate = totalPossiblePrayers > 0 ? (completedPrayers / totalPossiblePrayers) * 100 : 0

    // Calculate missed prayers by type (fair calculation from registration date)
    const missedByPrayer: Record<string, number> = {}
    prayers.forEach(prayer => {
      const prayerCompletions = completions?.filter(c => c.prayer_name === prayer).length || 0
      missedByPrayer[prayer] = daysTracked.length - prayerCompletions
    })

    // Calculate current streak
    let currentStreak = 0
    for (let i = 0; i < 30; i++) {
      const date = subDays(now, i)
      const dateStr = format(date, 'yyyy-MM-dd')
      const dayCompletions = completions?.filter(c => c.prayer_date === dateStr).length || 0
      
      if (dayCompletions === 5) {
        currentStreak++
      } else {
        break
      }
    }

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
      completionRate,
      currentStreak,
      longestStreak: currentStreak, // Simplified for now
      missedByPrayer,
      weeklyData,
      monthlyHeatmap
    })
  }

  const calculateTaskStats = async () => {
    if (!user) return

    const now = new Date()
    const monthStart = startOfMonth(now)

    // Get tasks for the current month
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select(`
        *,
        task_categories(name, color)
      `)
      .eq('user_id', user.id)
      .gte('created_at', monthStart.toISOString())

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError)
      return
    }

    const totalTasks = tasks?.length || 0
    const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

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

    setTaskStats({
      totalTasks,
      completedTasks,
      completionRate,
      byCategory,
      weeklyTrend: [] // Simplified for now
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
    if (!prayerStats || !user) return "Keep up your spiritual journey!"

    const userCreatedAt = new Date(user.created_at)
    const daysSinceJoining = Math.floor((Date.now() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24))
    
    // Special messaging for new users
    if (daysSinceJoining === 0) {
      return "Welcome to Barakah Tasks! Start your spiritual journey today - every prayer is a step closer to Allah."
    } else if (daysSinceJoining <= 3) {
      return `Day ${daysSinceJoining + 1} of your journey! You're building a beautiful foundation of worship.`
    }

    if (prayerStats.currentStreak >= 7) {
      return "Masha'Allah! Your dedication to prayer is inspiring. May Allah accept your efforts."
    } else if (prayerStats.currentStreak >= 3) {
      return "Excellent consistency! You're building a beautiful habit of worship."
    } else if (prayerStats.completionRate >= 80) {
      return "Great progress on your prayers! Keep striving for consistency."
    } else {
      return "Every prayer counts. Start fresh today and build your connection with Allah."
    }
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