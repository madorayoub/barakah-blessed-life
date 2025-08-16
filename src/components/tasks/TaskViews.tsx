import { useState } from 'react'
import { List, Columns, Calendar, Filter, Search, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TaskListView } from './TaskListView'
import { TaskBoardView } from './TaskBoardView'
import { TaskCalendarView } from './TaskCalendarView'
import { Task } from '@/hooks/useTasks'
import { useNavigate } from 'react-router-dom'

interface TaskViewsProps {
  tasks: Task[]
  onTaskComplete: (taskId: string) => void
  onTaskDelete: (taskId: string) => void
  onTaskEdit: (task: Task) => void
  loading: boolean
}

export type TaskViewType = 'list' | 'board' | 'calendar'

export function TaskViews({ tasks, onTaskComplete, onTaskDelete, onTaskEdit, loading }: TaskViewsProps) {
  const navigate = useNavigate()
  const [currentView, setCurrentView] = useState<TaskViewType>('board')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'my-tasks' | 'today' | 'this-week' | 'overdue'>('all')

  // Smart filtering logic (Asana-style)
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="h-4 w-px bg-border" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
              <p className="text-muted-foreground">Organize your daily productivity</p>
            </div>
          </div>

          {/* View Selector (Asana-style) */}
          <div className="flex items-center justify-between gap-4 mb-4">
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

          {/* Filters and Search (Asana-style smart filters) */}
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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {renderCurrentView()}
      </main>
    </div>
  )
}