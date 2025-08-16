import { Check, Clock, Flag, Calendar, MoreHorizontal, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Task } from '@/contexts/TasksContext'
import { format } from 'date-fns'

interface MagicTaskCardProps {
  task: Task
  onComplete: (taskId: string) => void
  onDelete: (taskId: string) => void
  onEdit: (task: Task) => void
  level?: number
}

export function MagicTaskCard({ task, onComplete, onDelete, onEdit, level = 0 }: MagicTaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [showSubtasks, setShowSubtasks] = useState(false)

  const isCompleted = task.status === 'completed'
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !isCompleted

  const handleTitleEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onEdit({ ...task, title: editTitle.trim() })
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleEdit()
    }
    if (e.key === 'Escape') {
      setEditTitle(task.title)
      setIsEditing(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 hover:shadow-red-100'
      case 'high': return 'border-l-orange-500 hover:shadow-orange-100'
      case 'medium': return 'border-l-primary hover:shadow-primary/10'
      case 'low': return 'border-l-gray-400 hover:shadow-gray-100'
      default: return 'border-l-gray-400 hover:shadow-gray-100'
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-50 text-red-700 border-red-200'
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'medium': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'low': return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <Card 
      className={`
        group transition-all duration-200 border-l-4 
        ${getPriorityColor(task.priority)}
        ${isCompleted ? 'opacity-60 bg-muted/30' : 'hover:shadow-md bg-card'}
        ${level > 0 ? 'ml-6 border-l-2' : ''}
      `}
      style={{ marginLeft: level > 0 ? `${level * 24}px` : '0' }}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          {/* Completion Checkbox */}
          <button
            onClick={() => onComplete(task.id)}
            className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0
              transition-all duration-200
              ${isCompleted 
                ? 'bg-primary border-primary text-white' 
                : 'border-muted-foreground hover:border-primary hover:bg-primary/5'
              }
            `}
          >
            {isCompleted && <Check className="h-3 w-3" />}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            {/* Title (Inline Editable) */}
            <div className="flex items-center gap-2 mb-1">
              {isEditing ? (
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleTitleEdit}
                  onKeyDown={handleKeyDown}
                  className="font-medium text-sm h-6 py-0 px-1 border-none shadow-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              ) : (
                <h3 
                  className={`
                    font-medium text-sm cursor-pointer hover:text-primary transition-colors flex-1
                    ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}
                  `}
                  onClick={() => setIsEditing(true)}
                >
                  {task.title}
                </h3>
              )}
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                {task.description}
              </p>
            )}

            {/* Badges and Metadata */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Priority Badge (only show if not low) */}
              {task.priority !== 'low' && (
                <Badge 
                  variant="outline" 
                  className={`text-xs h-5 ${getPriorityBadgeColor(task.priority)}`}
                >
                  <Flag className="h-2.5 w-2.5 mr-1" />
                  {task.priority}
                </Badge>
              )}

              {/* Category Badge */}
              {task.category && (
                <Badge 
                  variant="secondary" 
                  className="text-xs h-5"
                  style={{ 
                    backgroundColor: `${task.category.color}15`, 
                    color: task.category.color,
                    border: `1px solid ${task.category.color}30`
                  }}
                >
                  {task.category.name}
                </Badge>
              )}

              {/* Due Date */}
              {task.due_date && (
                <div className={`
                  flex items-center gap-1 text-xs px-2 py-0.5 rounded
                  ${isOverdue 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-muted-foreground bg-muted/50'
                  }
                `}>
                  <Calendar className="h-2.5 w-2.5" />
                  <span>
                    {format(new Date(task.due_date), 'MMM d')}
                    {task.due_time && ` ${task.due_time}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowSubtasks(!showSubtasks)}>
                Add Subtask
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Subtasks */}
        {showSubtasks && (
          <div className="mt-3 pl-8">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Plus className="h-3 w-3" />
              <span>Add subtask functionality coming soon...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}