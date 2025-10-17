import { Check, Clock, Flag, Trash2, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Task } from '@/contexts/TasksContext'
import { format } from 'date-fns'

interface TaskCardProps {
  task: Task
  onComplete: (taskId: string) => void
  onDelete: (taskId: string) => void
  onEdit?: (task: Task) => void
  onClick?: (task: Task) => void
}

export function TaskCard({ task, onComplete, onDelete, onEdit, onClick }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-destructive bg-destructive/10'
      case 'high':
        return 'border-accent/40 bg-accent/10'
      case 'medium':
        return 'border-primary/30 bg-primary/10'
      case 'low':
        return 'border-border bg-muted'
      default:
        return 'border-border bg-muted'
    }
  }

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-destructive'
      case 'high':
        return 'text-accent-foreground'
      case 'medium':
        return 'text-primary'
      case 'low':
        return 'text-muted-foreground'
      default:
        return 'text-muted-foreground'
    }
  }

  const isCompleted = task.status === 'completed'
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !isCompleted

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md ${
        isCompleted ? 'opacity-75' : ''
      } ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick ? () => onClick(task) : undefined}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Completion Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onComplete(task.id)
            }}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
              isCompleted 
                ? 'bg-primary border-primary text-white' 
                : 'border-muted-foreground hover:border-primary transition-colors'
            }`}
          >
            {isCompleted && <Check className="h-3 w-3" />}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
              
          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={(e) => e.stopPropagation()}
              >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      Edit Task
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => onDelete(task.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Badges and Info */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {/* Priority Badge */}
              <Badge 
                variant="outline" 
                className={`text-xs border ${getPriorityColor(task.priority)} ${getPriorityTextColor(task.priority)}`}
              >
                <Flag className="h-3 w-3 mr-1" />
                {task.priority}
              </Badge>

              {/* Category Badge */}
              {task.category && (
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                  style={{ backgroundColor: `${task.category.color}20`, color: task.category.color }}
                >
                  {task.category.name}
                </Badge>
              )}

              {/* Due Date */}
              {task.due_date && (
                <div className={`flex items-center gap-1 text-xs ${
                  isOverdue ? 'text-red-600' : 'text-muted-foreground'
                }`}>
                  <Clock className="h-3 w-3" />
                  <span>
                    {format(new Date(task.due_date), 'MMM d')}
                    {task.due_time && ` at ${task.due_time}`}
                    {isOverdue && ' (Overdue)'}
                  </span>
                </div>
              )}

              {/* Recurring Badge */}
              {task.is_recurring && (
                <Badge variant="outline" className="text-xs">
                  Recurring
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}