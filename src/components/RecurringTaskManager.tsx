import { useEffect } from 'react'
import { useTasks } from '@/contexts/TasksContext'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'

export function RecurringTaskManager() {
  const { user } = useAuth()
  const { tasks, createTask } = useTasks()

  useEffect(() => {
    if (!user) return

    const checkAndCreateRecurringTasks = async () => {
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]
      
      // Get all recurring tasks directly from database to avoid infinite loops
      const { data: recurringTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_recurring', true)
        .is('parent_task_id', null)
      
      if (!recurringTasks) return
      
      for (const recurringTask of recurringTasks) {
        const pattern = recurringTask.recurring_pattern
        
        if (pattern === 'daily') {
          await checkDailyRecurrence(recurringTask, todayStr)
        } else if (pattern === 'weekly') {
          await checkWeeklyRecurrence(recurringTask, todayStr, today)
        }
      }
    }

    // Check immediately and then every hour
    checkAndCreateRecurringTasks()
    const interval = setInterval(checkAndCreateRecurringTasks, 60 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [user]) // Removed tasks dependency to prevent infinite loops

  const checkDailyRecurrence = async (parentTask: any, todayStr: string) => {
    // Check if task already exists for today using database query
    const { data: existingTasks } = await supabase
      .from('tasks')
      .select('id')
      .eq('parent_task_id', parentTask.id)
      .eq('due_date', todayStr)
      .limit(1)

    if (!existingTasks || existingTasks.length === 0) {
      await createTask({
        title: parentTask.title,
        description: parentTask.description,
        priority: parentTask.priority,
        status: 'pending',
        category_id: parentTask.category_id,
        due_date: todayStr,
        is_recurring: false,
        parent_task_id: parentTask.id
      })
    }
  }

  const checkWeeklyRecurrence = async (parentTask: any, todayStr: string, today: Date) => {
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    // For Islamic tasks like Jummah, check if it's Friday (5)
    if (parentTask.title.toLowerCase().includes('jummah') && dayOfWeek === 5) {
      // Check if task already exists for today using database query
      const { data: existingTasks } = await supabase
        .from('tasks')
        .select('id')
        .eq('parent_task_id', parentTask.id)
        .eq('due_date', todayStr)
        .limit(1)

      if (!existingTasks || existingTasks.length === 0) {
        await createTask({
          title: parentTask.title,
          description: parentTask.description,
          priority: parentTask.priority,
          status: 'pending',
          category_id: parentTask.category_id,
          due_date: todayStr,
          is_recurring: false,
          parent_task_id: parentTask.id
        })
      }
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
      { name: 'Jummah Prayer', description: 'Friday congregational prayer' },
      { name: 'Weekly Quran Review', description: 'Review memorized verses' }
    ]

    for (const task of weeklyTasks) {
      await createTask({
        title: task.name,
        description: task.description,
        priority: 'medium',
        status: 'pending',
        is_recurring: true,
        recurring_pattern: 'weekly'
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