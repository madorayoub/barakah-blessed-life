import { Plus, Check, X, Circle, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Task } from '@/contexts/TasksContext'
import { cn } from '@/lib/utils'

interface SubtaskManagerProps {
  parentTask: Task
  onCreateSubtask: (title: string) => void
  onUpdateSubtask: (subtaskId: string, updates: Partial<Task>) => void
  onDeleteSubtask: (subtaskId: string) => void
}

export function SubtaskManager({ parentTask, onCreateSubtask, onUpdateSubtask, onDeleteSubtask }: SubtaskManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')

  const subtasks = parentTask.subtasks || []
  const completedCount = subtasks.filter(sub => sub.status === 'completed').length

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      onCreateSubtask(newSubtaskTitle.trim())
      setNewSubtaskTitle('')
      setIsAdding(false)
    }
  }

  const handleToggleSubtask = (subtask: Task) => {
    const newStatus = subtask.status === 'completed' ? 'pending' : 'completed'
    const updates: Partial<Task> = {
      status: newStatus,
      completed_at: newStatus === 'completed' ? new Date().toISOString() : null
    }
    onUpdateSubtask(subtask.id, updates)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSubtask()
    }
    if (e.key === 'Escape') {
      setIsAdding(false)
      setNewSubtaskTitle('')
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-foreground">Subtasks</h3>
          {subtasks.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {completedCount} of {subtasks.length} completed
            </Badge>
          )}
        </div>
        <Button
          onClick={() => setIsAdding(true)}
          size="sm"
          variant="outline"
          className="text-primary hover:bg-primary/10 hover:text-primary"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Subtask
        </Button>
      </div>

      {/* Progress Bar */}
      {subtasks.length > 0 && (
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / subtasks.length) * 100}%` }}
          />
        </div>
      )}

      {/* Add Subtask Input */}
      {isAdding && (
        <Card className="p-3 border-2 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2">
            <Input
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Enter subtask title..."
              onKeyDown={handleKeyDown}
              className="flex-1 border-2 border-border focus:border-primary"
              autoFocus
            />
            <Button
              onClick={handleAddSubtask}
              size="sm"
              disabled={!newSubtaskTitle.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => {
                setIsAdding(false)
                setNewSubtaskTitle('')
              }}
              size="sm"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Press Enter to add, Escape to cancel</p>
        </Card>
      )}

      {/* Subtasks List */}
      <div className="space-y-2">
        {subtasks.map(subtask => (
          <Card key={subtask.id} className={cn(
            "p-3 transition-all duration-200 hover:shadow-md",
            subtask.status === 'completed' ? "bg-primary/10 border border-primary/20" : "bg-card border border-border"
          )}>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => handleToggleSubtask(subtask)}
                size="icon"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-transparent"
              >
                {subtask.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                )}
              </Button>

              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium truncate",
                  subtask.status === 'completed'
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                )}>
                  {subtask.title}
                </p>
                {subtask.description && (
                  <p className={cn(
                    "text-xs mt-1 truncate",
                    subtask.status === 'completed' ? "text-muted-foreground/80" : "text-muted-foreground"
                  )}>
                    {subtask.description}
                  </p>
                )}
              </div>

              <Button
                onClick={() => onDeleteSubtask(subtask.id)}
                size="icon"
                variant="ghost"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {subtasks.length === 0 && !isAdding && (
        <Card className="p-6 text-center border-2 border-dashed border-border">
          <div className="text-muted-foreground">
            <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground/70" />
            <p className="text-sm font-medium">No subtasks yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Break this task into smaller steps</p>
          </div>
        </Card>
      )}
    </div>
  )
}