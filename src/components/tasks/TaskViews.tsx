import { useState } from 'react'
import { List, Columns, Calendar, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TaskListView } from './TaskListView'
import { TaskBoardView } from './TaskBoardView'
import { TaskCalendarView } from './TaskCalendarView'
import { Task } from '@/hooks/useTasks'

interface TaskViewsProps {
  tasks: Task[]
  onTaskComplete: (taskId: string) => void
  onTaskDelete: (taskId: string) => void
  onTaskEdit: (task: Task) => void
  onTaskCreate: (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  loading: boolean
}

export type TaskViewType = 'list' | 'board' | 'calendar'

export function TaskViews({ tasks, onTaskComplete, onTaskDelete, onTaskEdit, onTaskCreate, loading }: TaskViewsProps) {
  const [currentView, setCurrentView] = useState<TaskViewType>('board')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'my-tasks' | 'today' | 'this-week' | 'overdue'>('all')

  // Smart filtering logic
  const getFilteredTasks = () => {
    let filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    switch (filterStatus) {
      case 'my-tasks':
        return filtered.filter(task => task.status !== 'completed')
      case 'today':
        return filtered.filter(task => {
          if (!task.due_date) return false
          const dueDate = new Date(task.due_date)
          return dueDate >= today && dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
        })
      case 'this-week':
        return filtered.filter(task => {
          if (!task.due_date) return false
          const dueDate = new Date(task.due_date)
          return dueDate >= today && dueDate < thisWeek
        })
      case 'overdue':
        return filtered.filter(task => {
          if (!task.due_date || task.status === 'completed') return false
          return new Date(task.due_date) < today
        })
      default:
        return filtered
    }
  }

  const filteredTasks = getFilteredTasks()

  const renderCurrentView = () => {
    const props = {
      tasks: filteredTasks,
      onTaskComplete,
      onTaskDelete,
      onTaskEdit,
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
              variant={filterStatus === 'my-tasks' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('my-tasks')}
            >
              My Tasks
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