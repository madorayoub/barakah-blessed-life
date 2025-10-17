import { X, Calendar, Clock, Flag, Tag, Trash2, Save } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ModernDatePicker } from '@/components/ui/modern-date-picker'
import { Task } from '@/contexts/TasksContext'
import { useTaskStatuses } from '@/hooks/useTaskStatuses'
import { SubtaskManager } from './SubtaskManager'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { getLocalDateString } from '@/utils/date'
import { usePrayerTimes } from '@/hooks/usePrayerTimes'
import type { PrayerTime } from '@/lib/prayerTimes'

const parseLocalDateString = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

const createLocalDateTime = (dateString: string, timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  const date = parseLocalDateString(dateString)
  date.setHours(hours ?? 0, minutes ?? 0, 0, 0)
  return date
}

interface TaskDetailPanelProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (task: Task) => Promise<Task | void>
  onDelete: (taskId: string) => void
  onCreate: (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
}

export function TaskDetailPanel({ task, isOpen, onClose, onUpdate, onDelete, onCreate }: TaskDetailPanelProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const { statuses } = useTaskStatuses()
  const { prayerTimes } = usePrayerTimes()
  const [prayerConflict, setPrayerConflict] = useState<PrayerTime | null>(null)

  // Auto-save functionality
  const autoSave = useCallback(async (taskToSave: Task) => {
    if (!hasChanges || isAutoSaving) return
    
    setIsAutoSaving(true)
    try {
      const savedTask = await onUpdate(taskToSave)
      if (savedTask) {
        setEditedTask(savedTask)
      }
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

  useEffect(() => {
    if (!editedTask?.due_date || !editedTask?.due_time || !prayerTimes) {
      setPrayerConflict(null)
      return
    }

    const selectedDate = editedTask.due_date
    const todayPrayerDate = getLocalDateString(prayerTimes.date)

    if (selectedDate !== todayPrayerDate) {
      setPrayerConflict(null)
      return
    }

    const dueDateTime = createLocalDateTime(editedTask.due_date, editedTask.due_time)
    const conflict = prayerTimes.prayers.find((prayer) => {
      const diff = Math.abs(dueDateTime.getTime() - prayer.time.getTime())
      return diff <= 10 * 60 * 1000
    })

    setPrayerConflict(conflict ?? null)
  }, [editedTask?.due_date, editedTask?.due_time, prayerTimes])

  if (!isOpen || !task || !editedTask) return null

  const handleFieldChange = (field: keyof Task, value: Task[keyof Task]) => {
    setEditedTask(prev => prev ? { ...prev, [field]: value } : null)
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (editedTask && hasChanges && !isAutoSaving) {
      setIsAutoSaving(true)
      try {
        const savedTask = await onUpdate(editedTask)
        if (savedTask) {
          setEditedTask(savedTask)
        }
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
    return getLocalDateString(parseLocalDateString(date))
  }

  const handleCreateSubtask = async (title: string) => {
    if (!task) return

    const subtaskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
      title,
      description: '',
      priority: 'medium',
      status: 'pending',
      is_recurring: false,
      parent_task_id: task.id
    }
    
    // Create the subtask via the proper create function - explicitly mark as subtask
    await onCreate(subtaskData)
    
    // The real-time subscription should update the parent task automatically
    // No need to manually update the task state here
  }

  const handleUpdateSubtask = async (subtaskId: string, updates: Partial<Task>) => {
    try {
      // Update the subtask directly in the database using the same update function
      // This prevents the infinite loop and ensures proper state management
      await onUpdate({ id: subtaskId, ...updates } as Task)

      // The real-time subscription will handle updating the parent task's subtasks array
    } catch (error) {
      console.error('Error updating subtask:', error)
    }
  }

  const handleDeleteSubtask = (subtaskId: string) => {
    onDelete(subtaskId)
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 z-40 transition-all duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full md:w-[420px] bg-card border-l border-border shadow-2xl z-50 transform transition-transform duration-300 cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative p-6 border-b border-border bg-muted">
            <h2 className="text-xl font-bold text-foreground">Task Details</h2>
            <p className="text-sm text-muted-foreground mt-1">Edit your task information</p>
            <div className="flex items-center gap-3 mt-3">
              {hasChanges && !isAutoSaving && (
                <Button onClick={handleSave} size="sm" variant="default" disabled={isAutoSaving}>
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
              )}
              {isAutoSaving && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full"></div>
                  Auto-saving...
                </div>
              )}
            </div>
            <Button
              onClick={onClose}
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 h-8 w-8 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-card">
            {/* Title */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Task Title</label>
              <Input
                value={editedTask.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="text-xl font-bold border-2 border-border focus:border-primary py-3 text-foreground placeholder:text-muted-foreground"
                placeholder="Enter task title..."
              />
            </div>

            {/* Status */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Status</label>
              <Select
                value={editedTask.status}
                onValueChange={(value) => handleFieldChange('status', value)}
              >
                <SelectTrigger className="h-12 text-base border-2 border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-2 border-border shadow-lg">
                  {statuses.length > 0 ? (
                    statuses.map(status => {
                      const statusValue = status.name.toLowerCase().replace(/\s+/g, '_')
                      // Map to legacy status values
                      let mappedValue = statusValue
                      if (statusValue === 'to_do') mappedValue = 'pending'
                      if (statusValue === 'done') mappedValue = 'completed'
                      
                      return (
                        <SelectItem key={status.id} value={mappedValue} className="text-foreground">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: status.color }}
                            />
                            {status.name}
                          </div>
                        </SelectItem>
                      )
                    })
                  ) : (
                    <>
                      <SelectItem value="pending" className="text-foreground">📋 To Do</SelectItem>
                      <SelectItem value="in_progress" className="text-foreground">⚡ In Progress</SelectItem>
                      <SelectItem value="completed" className="text-foreground">✅ Done</SelectItem>
                    </>
                  )}
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
                <SelectTrigger className="h-12 text-base border-2 border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-2 border-border shadow-lg">
                  <SelectItem value="high" className="text-foreground">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-destructive" />
                      🔴 High Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="medium" className="text-foreground">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-accent" />
                      🟡 Medium Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="low" className="text-foreground">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-primary" />
                      🟢 Low Priority
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Due Date & Time */}
            <div className="space-y-3">
              <ModernDatePicker
                label="Due Date & Time"
                value={formatDate(editedTask.due_date)}
                onChange={(date) => handleFieldChange('due_date', date || null)}
                showTime={true}
                timeValue={editedTask.due_time || ''}
                onTimeChange={(time) => handleFieldChange('due_time', time || null)}
                placeholder="Set due date (optional)"
                className="w-full"
              />
              {prayerConflict && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <Clock className="h-4 w-4" />
                  <span>
                    Heads up: this due time overlaps with {prayerConflict.displayName} prayer around{' '}
                    {prayerConflict.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
                  </span>
                </div>
              )}
            </div>
            
            {/* Description */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Description</label>
              <Textarea
                value={editedTask.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value || null)}
                placeholder="Add task description..."
                rows={5}
                className="text-base leading-relaxed resize-none border-2 border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Subtasks */}
            <SubtaskManager
              parentTask={task}
              onCreateSubtask={handleCreateSubtask}
              onUpdateSubtask={handleUpdateSubtask}
              onDeleteSubtask={handleDeleteSubtask}
            />
            
            {/* Task Info */}
            <Card className="p-4 bg-muted border-2 border-border">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Created:</span>
                  <span className="text-foreground font-semibold">{new Date(task.created_at).toLocaleDateString()}</span>
                </div>
                {task.updated_at !== task.created_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Updated:</span>
                    <span className="text-foreground font-semibold">{new Date(task.updated_at).toLocaleDateString()}</span>
                  </div>
                )}
                {task.completed_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Completed:</span>
                    <span className="text-primary font-semibold">{new Date(task.completed_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-muted">
            <div className="flex justify-between items-center">
              <Button
                onClick={handleDelete}
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Task
              </Button>

              <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-md">
                Press Esc to close • Ctrl+S to save
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
