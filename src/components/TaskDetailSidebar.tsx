import { useState } from 'react'
import { X, Calendar, Clock, Flag, Tag, FileText, Trash2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { TaskNotes } from './TaskNotes'
import { format } from 'date-fns'

interface Task {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'completed' | 'cancelled'
  due_date?: string
  due_time?: string
  category_id?: string
  created_at: string
  updated_at: string
  task_categories?: {
    name: string
    color: string
    icon?: string
  }
}

interface TaskDetailSidebarProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onComplete: (taskId: string) => void
  onDelete: (taskId: string) => void
}

export function TaskDetailSidebar({ task, isOpen, onClose, onComplete, onDelete }: TaskDetailSidebarProps) {
  const [notes, setNotes] = useState(task?.description || '')

  if (!task) return null

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-muted'
    }
  }

  const formatDueDate = () => {
    if (!task.due_date) return 'No due date'
    const date = new Date(task.due_date)
    let formatted = format(date, 'MMM d, yyyy')
    if (task.due_time) {
      formatted += ` at ${task.due_time}`
    }
    return formatted
  }

  const isCompleted = task.status === 'completed'

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[500px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <SheetTitle className="text-lg leading-tight pr-2">
              {task.title}
            </SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Status and Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button
                  onClick={() => onComplete(task.id)}
                  className={`flex-1 ${isCompleted 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-primary hover:bg-primary/90'
                  }`}
                  size="sm"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {isCompleted ? 'Completed' : 'Mark Complete'}
                </Button>
                <Button
                  onClick={() => onDelete(task.id)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Task Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Priority */}
              <div className="flex items-center gap-3">
                <Flag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Priority:</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                  <Badge variant="outline" className="capitalize">
                    {task.priority}
                  </Badge>
                </div>
              </div>

              {/* Category */}
              {task.task_categories && (
                <div className="flex items-center gap-3">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <Badge 
                    variant="outline" 
                    style={{ 
                      borderColor: task.task_categories.color,
                      color: task.task_categories.color 
                    }}
                  >
                    {task.task_categories.name}
                  </Badge>
                </div>
              )}

              {/* Due Date */}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Due:</span>
                <span className="text-sm">{formatDueDate()}</span>
              </div>

              {/* Created Date */}
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="text-sm">
                  {format(new Date(task.created_at), 'MMM d, yyyy')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Task Notes */}
          <TaskNotes 
            taskId={task.id}
            initialNotes={notes}
            onNotesUpdate={setNotes}
          />

          {/* Activity History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Task created on {format(new Date(task.created_at), 'MMM d, yyyy')}</span>
                </div>
                {task.updated_at !== task.created_at && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Last updated on {format(new Date(task.updated_at), 'MMM d, yyyy')}</span>
                  </div>
                )}
                {isCompleted && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Task completed</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}