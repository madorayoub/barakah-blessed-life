import { useState, useEffect } from 'react'
import { Plus, Calendar, Clock, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ModernDatePicker } from '@/components/ui/modern-date-picker'
import { useTasks } from '@/contexts/TasksContext'

interface CalendarTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultDueDate?: string
  defaultDueTime?: string
}

export function CalendarTaskDialog({ 
  open, 
  onOpenChange, 
  defaultDueDate, 
  defaultDueTime 
}: CalendarTaskDialogProps) {
  const { createTask, createCategory, categories } = useTasks()
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category_id: '',
    due_date: defaultDueDate || '',
    due_time: defaultDueTime || ''
  })

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category_id: '',
        due_date: defaultDueDate || '',
        due_time: defaultDueTime || ''
      })
    }
  }, [open, defaultDueDate, defaultDueTime])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) return

    await createTask({
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority,
      status: 'pending',
      category_id: formData.category_id || undefined,
      due_date: formData.due_date || undefined,
      due_time: formData.due_time || undefined,
      is_recurring: false
    })

    onOpenChange(false)
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return

    // Generate a random color for the new category
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    await createCategory({
      name: newCategoryName,
      color: randomColor,
      icon: 'circle',
      is_default: false
    })

    // After creating category, the categories list will update via real-time subscription
    setNewCategoryName('')
    setShowNewCategory(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-blue-600 bg-blue-50'
      case 'low': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a task for your calendar
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What needs to be done?"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional task description"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <Badge className={getPriorityColor('low')}>Low</Badge>
                  </SelectItem>
                  <SelectItem value="medium">
                    <Badge className={getPriorityColor('medium')}>Medium</Badge>
                  </SelectItem>
                  <SelectItem value="high">
                    <Badge className={getPriorityColor('high')}>High</Badge>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <Badge className={getPriorityColor('urgent')}>Urgent</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Add New Category */}
          {!showNewCategory ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNewCategory(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Category
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleCreateCategory()
                  }
                  if (e.key === 'Escape') {
                    setShowNewCategory(false)
                    setNewCategoryName('')
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleCreateCategory}
                disabled={!newCategoryName.trim()}
              >
                Add
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowNewCategory(false)
                  setNewCategoryName('')
                }}
              >
                Cancel
              </Button>
            </div>
          )}

          <div className="space-y-4">
            <ModernDatePicker
              label="Due Date & Time"
              value={formData.due_date}
              onChange={(date) => setFormData(prev => ({ ...prev, due_date: date }))}
              showTime={true}
              timeValue={formData.due_time}
              onTimeChange={(time) => setFormData(prev => ({ ...prev, due_time: time }))}
              placeholder="Set due date (optional)"
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.title.trim()}>
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}