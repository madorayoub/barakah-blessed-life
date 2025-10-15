import { getLocalDateString } from '@/utils/date'

type RecurringTask = {
  recurring_weekday?: number | null
  due_date?: string | null
  created_at?: string
}

type ExistingTask = {
  due_date?: string | null
}

export function determineRecurringWeekday(task: RecurringTask): number | null {
  if (typeof task.recurring_weekday === 'number') {
    return task.recurring_weekday
  }

  if (task.due_date) {
    const dueDate = new Date(task.due_date)
    if (!Number.isNaN(dueDate.getTime())) {
      return dueDate.getDay()
    }
  }

  if (task.created_at) {
    const created = new Date(task.created_at)
    if (!Number.isNaN(created.getTime())) {
      return created.getDay()
    }
  }

  return null
}

export function shouldCreateRecurringTask(existingTasks: ExistingTask[] | null | undefined, targetDate: Date): boolean {
  if (!existingTasks || existingTasks.length === 0) {
    return true
  }

  const targetDateString = getLocalDateString(targetDate)
  return !existingTasks.some(task => {
    if (!task.due_date) return false
    return task.due_date === targetDateString
  })
}
