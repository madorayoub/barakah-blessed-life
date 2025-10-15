import { useCallback, useMemo, useState } from 'react'
import { List, Columns, Calendar, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TaskListView } from './TaskListView'
import { TaskBoardView } from './TaskBoardView'
import { TaskCalendarView } from './TaskCalendarView'
import { Task } from '@/contexts/TasksContext'
import { getLocalDateString } from '@/utils/date'

interface TaskViewsProps {
  tasks: Task[]
  onTaskComplete: (taskId: string) => void
  onTaskDelete: (taskId: string) => void
  onTaskEdit: (task: Task) => Promise<Task | void> | void
  onTaskCreate: (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  loading: boolean
  onTaskSelect?: (task: Task) => void
}

export type TaskViewType = 'list' | 'board' | 'calendar'

export function TaskViews({ tasks, onTaskComplete, onTaskDelete, onTaskEdit, onTaskCreate, loading, onTaskSelect }: TaskViewsProps) {
  const [currentView, setCurrentView] = useState<TaskViewType>('board')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'today' | 'this-week' | 'overdue'>('all')

  const parseLocalDateString = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, (month ?? 1) - 1, day ?? 1)
  }

  const addDaysToDateString = (dateString: string, days: number) => {
    const date = parseLocalDateString(dateString)
    date.setDate(date.getDate() + days)
    return getLocalDateString(date)
  }

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase()
    const todayStr = getLocalDateString(new Date())
    const weekEndStr = addDaysToDateString(todayStr, 7)

    const matchesSearch = (task: Task) => {
      const normalizedTitle = task.title.toLowerCase()
      const normalizedDescription = task.description?.toLowerCase() ?? ''
      return normalizedTitle.includes(normalizedSearch) || normalizedDescription.includes(normalizedSearch)
    }

    const baseFiltered = tasks.filter(matchesSearch)

    switch (filterStatus) {
      case 'today':
        return baseFiltered.filter(task => task.due_date === todayStr)
      case 'this-week':
        return baseFiltered.filter(task =>
          Boolean(task.due_date) &&
          (task.due_date as string) >= todayStr &&
          (task.due_date as string) < weekEndStr
        )
      case 'overdue':
        return baseFiltered.filter(task =>
          Boolean(task.due_date) &&
          task.status !== 'completed' &&
          (task.due_date as string) < todayStr
        )
      default:
        return baseFiltered
    }
  }, [tasks, searchTerm, filterStatus])

  const handleTaskEditProxy = useCallback(async (task: Task) => {
    const result = await Promise.resolve(onTaskEdit(task))

    if (onTaskSelect && currentView !== 'board') {
      const resolvedTask = (result as Task | undefined) ?? task
      onTaskSelect(resolvedTask)
    }

    return result
  }, [onTaskEdit, onTaskSelect, currentView])

  if (import.meta.env.DEV) {
    console.log('👁️ TASKVIEWS RENDER - Received tasks:', tasks.length)
    console.log('👁️ TASKVIEWS RENDER - Filtered tasks:', filteredTasks.length)
    console.log('👁️ TASKVIEWS RENDER - First few received task IDs:', tasks.slice(0, 3).map(t => t.id))
    console.log('👁️ TaskViews component re-rendered at:', new Date().toISOString())
  }

  const renderCurrentView = () => {
    const props = {
      tasks: filteredTasks,
      onTaskComplete,
      onTaskDelete,
      onTaskEdit: handleTaskEditProxy,
      onTaskCreate,
      loading
    }

    switch (currentView) {
      case 'list':
        return <TaskListView {...props} />
      case 'board':
        return <TaskBoardView {...props} />
      case 'calendar':
        return <TaskCalendarView {...props} />
      default:
        return <TaskListView {...props} />
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* View Selector and Filters */}
      <div className="space-y-4 mb-6">
        {/* View Selector */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <Button
              variant={currentView === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('list')}
              className="h-8"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button
              variant={currentView === 'board' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('board')}
              className="h-8"
            >
              <Columns className="h-4 w-4 mr-2" />
              Board
            </Button>
            <Button
              variant={currentView === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('calendar')}
              className="h-8"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('today')}
            >
              Today
            </Button>
            <Button
              variant={filterStatus === 'this-week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('this-week')}
            >
              This Week
            </Button>
            <Button
              variant={filterStatus === 'overdue' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('overdue')}
              className="text-destructive hover:text-destructive"
            >
              Overdue
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {renderCurrentView()}
      </div>
    </div>
  )
}