import { X, Calendar, Clock, Flag, Tag, Trash2, Save } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Task } from '@/hooks/useTasks'
import { cn } from '@/lib/utils'

interface TaskDetailPanelProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function TaskDetailPanel({ task, isOpen, onClose, onUpdate, onDelete }: TaskDetailPanelProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task })
      setHasChanges(false)
    }
  }, [task])

  if (!isOpen || !task || !editedTask) return null

  const handleFieldChange = (field: keyof Task, value: any) => {
    setEditedTask(prev => prev ? { ...prev, [field]: value } : null)
    setHasChanges(true)
  }

  const handleSave = () => {
    if (editedTask && hasChanges) {
      onUpdate(editedTask)
      setHasChanges(false)
    }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id)
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSave()
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[0]
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className={cn(
          "fixed right-0 top-0 h-full w-full md:w-[400px] bg-background border-l z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Task Details</h2>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Button onClick={handleSave} size="sm" variant="default">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              )}
              <Button onClick={onClose} size="icon" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editedTask.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="text-lg font-medium"
                placeholder="Task title..."
              />
            </div>
            
            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={editedTask.status} 
                onValueChange={(value) => handleFieldChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select 
                value={editedTask.priority} 
                onValueChange={(value) => handleFieldChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-red-500" />
                      High
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-primary" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-gray-400" />
                      Low
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Due Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <Input
                type="date"
                value={formatDate(editedTask.due_date)}
                onChange={(e) => handleFieldChange('due_date', e.target.value || null)}
              />
            </div>
            
            {/* Due Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Time</label>
              <Input
                type="time"
                value={editedTask.due_time || ''}
                onChange={(e) => handleFieldChange('due_time', e.target.value || null)}
              />
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editedTask.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value || null)}
                placeholder="Add task description..."
                rows={4}
              />
            </div>
            
            {/* Task Info */}
            <Card className="p-3 bg-muted/50">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(task.created_at).toLocaleDateString()}</span>
                </div>
                {task.updated_at !== task.created_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated:</span>
                    <span>{new Date(task.updated_at).toLocaleDateString()}</span>
                  </div>
                )}
                {task.completed_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed:</span>
                    <span>{new Date(task.completed_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t bg-muted/20">
            <div className="flex justify-between">
              <Button 
                onClick={handleDelete} 
                variant="destructive" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Task
              </Button>
              
              <div className="text-xs text-muted-foreground">
                Press Esc to close • Ctrl+S to save
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}