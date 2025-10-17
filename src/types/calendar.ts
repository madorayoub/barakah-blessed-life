import type { Task } from '@/contexts/TasksContext'

export interface CalendarEvent {
  id: string
  type: 'prayer' | 'task'
  title: string
  time?: Date
  completed?: boolean
  isNext?: boolean
  taskData?: Task
}

export interface CalendarTimeBlock {
  id: string
  startTime: string
  endTime: string
  period: string
  events: CalendarEvent[]
  styleClass: string
}

export type CalendarAddTaskHandler = (parameter?: number | string) => void
