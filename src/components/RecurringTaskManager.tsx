import { useEffect } from 'react'
import { useTasks } from '@/contexts/TasksContext'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { yyyyMmDd } from '@/lib/dateLocal'
import { determineRecurringWeekday } from '@/lib/recurrence'

export function RecurringTaskManager() {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const checkAndCreateRecurringTasks = async () => {
      const today = new Date()

      const { data: recurringTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_recurring', true)
        .is('parent_task_id', null)

      if (!recurringTasks) return

      for (const recurringTask of recurringTasks) {
        await processRecurringParent(recurringTask, today)
      }
    }

    // Check immediately and then every hour
    checkAndCreateRecurringTasks()
    const interval = setInterval(checkAndCreateRecurringTasks, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [user])

  const getNextOccurrence = (parentTask: any, referenceDate: Date) => {
    const pattern = parentTask.recurring_pattern
    const dueDate = yyyyMmDd(referenceDate)

    if (pattern === 'daily') {
      return { dueDate }
    }

    if (pattern === 'weekly') {
      const storedWeekday = typeof parentTask.recurring_weekday === 'number'
        ? parentTask.recurring_weekday
        : determineRecurringWeekday(parentTask)

      if (storedWeekday !== null && storedWeekday === referenceDate.getDay()) {
        return { dueDate }
      }
    }

    return null
  }

  const processRecurringParent = async (parentTask: any, referenceDate: Date) => {
    const occurrence = getNextOccurrence(parentTask, referenceDate)
    if (!occurrence) return

    const { dueDate } = occurrence
    const { error } = await supabase.rpc('create_recurring_child', {
      p_parent: parentTask.id,
      p_due: dueDate
    })

    if (error) {
      console.error('Error creating recurring child task:', error)
    }
  }

  // This component doesn't render anything
  return null
}

// Hook for easy recurring task creation
export function useRecurringTasks() {
  const { createTask } = useTasks()

  const createDailyPrayerTasks = async () => {
    const prayers = [
      { name: 'Fajr Prayer', time: '05:30' },
      { name: 'Dhuhr Prayer', time: '12:30' },
      { name: 'Asr Prayer', time: '16:00' },
      { name: 'Maghrib Prayer', time: '18:30' },
      { name: 'Isha Prayer', time: '20:00' }
    ]

    for (const prayer of prayers) {
      await createTask({
        title: prayer.name,
        description: 'Daily Islamic prayer',
        priority: 'high',
        status: 'pending',
        due_time: prayer.time,
        is_recurring: true,
        recurring_pattern: 'daily'
      })
    }
  }

  const createWeeklyTasks = async () => {
    const weeklyTasks = [
      { name: 'Jummah Prayer', description: 'Friday congregational prayer', weekday: 5 },
      { name: 'Weekly Quran Review', description: 'Review memorized verses', weekday: 0 }
    ]

    for (const task of weeklyTasks) {
      await createTask({
        title: task.name,
        description: task.description,
        priority: 'medium',
        status: 'pending',
        is_recurring: true,
        recurring_pattern: 'weekly',
        recurring_weekday: task.weekday
      })
    }
  }

  const makeTaskRecurring = async (taskId: string, pattern: 'daily' | 'weekly') => {
    // This would update an existing task to be recurring
    // Implementation depends on your update task function
  }

  return {
    createDailyPrayerTasks,
    createWeeklyTasks,
    makeTaskRecurring
  }
}