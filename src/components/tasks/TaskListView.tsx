import { Plus, ChevronRight, ChevronDown, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { NewTaskDialog } from '@/components/NewTaskDialog'
import { MagicTaskCard } from './MagicTaskCard'
import { QuickAddTask } from './QuickAddTask'
import { Task } from '@/hooks/useTasks'

interface TaskListViewProps {
  tasks: Task[]
  onTaskComplete: (taskId: string) => void
  onTaskDelete: (taskId: string) => void
  onTaskEdit: (task: Task) => void
  onTaskCreate: (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  loading: boolean
}

export function TaskListView({ tasks, onTaskComplete, onTaskDelete, onTaskEdit, onTaskCreate, loading }: TaskListViewProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['overdue', 'today', 'tomorrow']))

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  // Auto-sort tasks (Asana's winning formula)
  const organizedTasks = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    const groups = {
      overdue: [] as Task[],
      today: [] as Task[],
      tomorrow: [] as Task[],
      thisWeek: [] as Task[],
      later: [] as Task[],
      completed: [] as Task[]
    }

    tasks.forEach(task => {
      if (task.status === 'completed') {
        groups.completed.push(task)
        return
      }

      if (!task.due_date) {
        groups.later.push(task)
        return
      }

      const dueDate = new Date(task.due_date)
      
      if (dueDate < today) {
        groups.overdue.push(task)
      } else if (dueDate >= today && dueDate < tomorrow) {
        groups.today.push(task)
      } else if (dueDate >= tomorrow && dueDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)) {
        groups.tomorrow.push(task)
      } else if (dueDate < nextWeek) {
        groups.thisWeek.push(task)
      } else {
        groups.later.push(task)
      }
    })

    return groups
  }

  const taskGroups = organizedTasks()

  const renderTaskGroup = (groupId: string, title: string, tasks: Task[], color: string = 'text-foreground') => {
    if (tasks.length === 0) return null

    const isExpanded = expandedGroups.has(groupId)

    return (
      <div className="mb-6">
        <button
          onClick={() => toggleGroup(groupId)}
          className={`flex items-center gap-2 py-2 px-1 font-medium text-sm ${color} hover:text-primary transition-colors`}
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          {title}
          <span className="text-muted-foreground">({tasks.length})</span>
        </button>
        
        {isExpanded && (
          <div className="space-y-2 ml-2">
            {tasks.map((task) => (
              <MagicTaskCard
                key={task.id}
                task={task}
                onComplete={onTaskComplete}
                onDelete={onTaskDelete}
                onEdit={onTaskEdit}
              />
            ))}
            
            {/* Quick Add for each section */}
            <QuickAddTask groupId={groupId} />
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="h-16 bg-muted rounded-lg animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <Plus className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Start your productive journey</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Create your first task and begin organizing your Islamic lifestyle with purpose and barakah.
        </p>
        <NewTaskDialog>
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Task
          </Button>
        </NewTaskDialog>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {/* Quick Add at the top */}
      <div className="mb-6">
        <QuickAddTask />
      </div>

      {/* Auto-organized task groups */}
      {renderTaskGroup('overdue', 'Overdue', taskGroups.overdue, 'text-destructive')}
      {renderTaskGroup('today', 'Today', taskGroups.today, 'text-primary')}
      {renderTaskGroup('tomorrow', 'Tomorrow', taskGroups.tomorrow)}
      {renderTaskGroup('thisWeek', 'This Week', taskGroups.thisWeek)}
      {renderTaskGroup('later', 'Later', taskGroups.later)}
      {renderTaskGroup('completed', 'Completed', taskGroups.completed, 'text-muted-foreground')}
    </div>
  )
}