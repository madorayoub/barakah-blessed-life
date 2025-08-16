import { X, Calendar, Clock, Flag, Tag, Trash2, Save } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Task } from '@/hooks/useTasks'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

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
  const [isAutoSaving, setIsAutoSaving] = useState(false)

  // Auto-save functionality
  const autoSave = useCallback(async (taskToSave: Task) => {
    if (!hasChanges || isAutoSaving) return
    
    setIsAutoSaving(true)
    try {
      await onUpdate(taskToSave)
      setHasChanges(false)
      toast({
        title: "Auto-saved",
        duration: 1000,
      })
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setIsAutoSaving(false)
    }
  }, [hasChanges, isAutoSaving, onUpdate])

  // Auto-save timer
  useEffect(() => {
    if (editedTask && hasChanges && !isAutoSaving) {
      const timeoutId = setTimeout(() => {
        autoSave(editedTask)
      }, 2000) // Auto-save after 2 seconds

      return () => clearTimeout(timeoutId)
    }
  }, [editedTask, hasChanges, isAutoSaving, autoSave])

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

  const handleSave = async () => {
    if (editedTask && hasChanges && !isAutoSaving) {
      setIsAutoSaving(true)
      try {
        await onUpdate(editedTask)
        setHasChanges(false)
        toast({
          title: "Changes saved",
          duration: 1000,
        })
      } catch (error) {
        console.error('Save failed:', error)
        toast({
          variant: "destructive",
          title: "Failed to save",
          description: "Please try again"
        })
      } finally {
        setIsAutoSaving(false)
      }
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
        className={cn(
          "fixed inset-0 bg-black/30 z-40 transition-all duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className={cn(
          "fixed right-0 top-0 h-full w-full md:w-[420px] bg-background border-l shadow-xl z-50 transform transition-transform duration-300 cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative p-6 border-b bg-muted/20">
            <h2 className="text-lg font-semibold text-foreground">Task Details</h2>
            <div className="flex items-center gap-2 mt-2">
              {hasChanges && !isAutoSaving && (
                <Button onClick={handleSave} size="sm" variant="default" disabled={isAutoSaving}>
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
              )}
              {isAutoSaving && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full"></div>
                  Auto-saving...
                </div>
              )}
            </div>
            <Button 
              onClick={onClose} 
              size="icon" 
              variant="ghost"
              className="absolute top-4 right-4 h-8 w-8 rounded-md hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Title</label>
              <Input
                value={editedTask.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="text-xl font-semibold border-2 focus:border-primary py-3"
                placeholder="Task title..."
              />
            </div>
            
            {/* Status */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Status</label>
              <Select 
                value={editedTask.status} 
                onValueChange={(value) => handleFieldChange('status', value)}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg">
                  <SelectItem value="pending">📋 To Do</SelectItem>
                  <SelectItem value="in_progress">⚡ In Progress</SelectItem>
                  <SelectItem value="completed">✅ Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Priority */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Priority</label>
              <Select 
                value={editedTask.priority} 
                onValueChange={(value) => handleFieldChange('priority', value)}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg">
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-destructive" />
                      🔴 High Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-primary" />
                      🟡 Medium Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-muted-foreground" />
                      🟢 Low Priority
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Due Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Due Date</label>
                <Input
                  type="date"
                  value={formatDate(editedTask.due_date)}
                  onChange={(e) => handleFieldChange('due_date', e.target.value || null)}
                  className="h-12 text-base"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Due Time</label>
                <Input
                  type="time"
                  value={editedTask.due_time || ''}
                  onChange={(e) => handleFieldChange('due_time', e.target.value || null)}
                  className="h-12 text-base"
                />
              </div>
            </div>
            
            {/* Description */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Description</label>
              <Textarea
                value={editedTask.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value || null)}
                placeholder="Add task description..."
                rows={5}
                className="text-base leading-relaxed resize-none"
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