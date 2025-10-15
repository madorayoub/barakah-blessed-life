import { Calendar, Clock, CheckCircle2, Circle, MoreHorizontal } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Task, useTasks } from '@/contexts/TasksContext'
import { cn } from '@/lib/utils'
import { memo, useCallback, useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { getLocalDateString } from '@/utils/date'

interface EnhancedTaskCardProps {
  task: Task
  onComplete: (taskId: string) => void
  onDelete: (taskId: string) => void
  onEdit: (task: Task) => void
  onClick?: (task: Task) => void
}

const parseLocalDateString = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

const EnhancedTaskCard = memo(function EnhancedTaskCard({ task, onComplete, onDelete, onEdit, onClick }: EnhancedTaskCardProps) {
  const { updateTask } = useTasks()
  const [isSnoozing, setIsSnoozing] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500'
      case 'medium':
        return 'border-l-primary'
      case 'low':
        return 'border-l-gray-400'
      default:
        return 'border-l-gray-300'
    }
  }

  const formatDueDate = () => {
    if (!task.due_date) return null

    const dueDate = parseLocalDateString(task.due_date)
    const today = parseLocalDateString(getLocalDateString(new Date()))
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    if (diffDays <= 7) return `${diffDays} days`

    return getLocalDateString(dueDate)
  }

  const getDueDateColor = () => {
    if (!task.due_date) return 'text-muted-foreground'

    const dueDate = parseLocalDateString(task.due_date)
    const today = parseLocalDateString(getLocalDateString(new Date()))
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'text-red-600 bg-red-50'
    if (diffDays === 0) return 'text-orange-600 bg-orange-50'
    if (diffDays <= 3) return 'text-yellow-600 bg-yellow-50'
    return 'text-muted-foreground bg-muted'
  }

  const snoozeTask = useCallback(async (days: number) => {
    if (isSnoozing) return

    setIsSnoozing(true)
    try {
      const baseDateString = task.due_date ?? getLocalDateString(new Date())
      const baseDate = parseLocalDateString(baseDateString)
      baseDate.setDate(baseDate.getDate() + days)
      const newDueDate = getLocalDateString(baseDate)

      await updateTask(task.id, {
        due_date: newDueDate,
        due_time: task.due_time ?? null
      })

      toast({
        title: `Snoozed to ${days === 1 ? 'tomorrow' : 'next week'}`,
        description: `Due ${newDueDate}${task.due_time ? ` at ${task.due_time}` : ''}`
      })
    } catch (error) {
      console.error('Failed to snooze task:', error)
      toast({
        variant: 'destructive',
        title: 'Failed to snooze task',
        description: 'Please try again.'
      })
    } finally {
      setIsSnoozing(false)
    }
  }, [isSnoozing, task, updateTask])

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.(task)
  }, [onClick, task])

  const handleComplete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onComplete(task.id)
  }, [onComplete, task.id])

  const handleAction = useCallback((action: string, e: React.MouseEvent) => {
    e.stopPropagation()

    switch (action) {
      case 'edit':
        onEdit(task)
        break
      case 'delete':
        onDelete(task.id)
        break
    }
  }, [onEdit, onDelete, task])

  const isCompleted = task.status === 'completed'

  return (
    <Card
      className={cn(
        "w-full min-h-[88px] max-h-[120px] p-4 mb-3 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-l-4",
        getPriorityColor(task.priority),
        isCompleted && "opacity-75"
      )}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-2 flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 p-0 hover:bg-transparent"
            onClick={handleComplete}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground hover:text-primary" />
            )}
          </Button>

          <div className="flex-1 min-w-0">
            <h4
              className={cn(
                "font-medium text-sm line-clamp-2 mb-1",
                isCompleted && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </h4>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => handleAction('edit', e)}>
              Edit task
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                snoozeTask(1)
              }}
              disabled={isSnoozing}
            >
              Snooze → Tomorrow
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                snoozeTask(7)
              }}
              disabled={isSnoozing}
            >
              Snooze → Next Week
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => handleAction('delete', e)}
              className="text-red-600"
            >
              Delete task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {task.priority !== 'medium' && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs px-1.5 py-0.5",
                task.priority === 'high' ? 'text-red-600 border-red-200' : 'text-gray-500 border-gray-200'
              )}
            >
              {task.priority}
            </Badge>
          )}

          {task.category_id && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-muted-foreground truncate max-w-16">
                Category
              </span>
            </div>
          )}
        </div>

        {task.due_date && (
          <Badge
            variant="outline"
            className={cn(
              "text-xs px-2 py-0.5 flex items-center gap-1",
              getDueDateColor()
            )}
          >
            <Calendar className="h-3 w-3" />
            {formatDueDate()}
          </Badge>
        )}
      </div>

      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          <span className="text-primary font-medium">
            {task.subtasks.filter(sub => sub.status === 'completed').length} of {task.subtasks.length} subtasks completed
          </span>
        </div>
      )}

      {task.description && !task.subtasks?.length && (
        <div className="mt-2 text-xs text-muted-foreground">
          <span className="line-clamp-1">{task.description}</span>
        </div>
      )}
    </Card>
  )
}, (prevProps, nextProps) => {
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.status === nextProps.task.status &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.updated_at === nextProps.task.updated_at &&
    prevProps.task.priority === nextProps.task.priority
  )
})

export default EnhancedTaskCard
