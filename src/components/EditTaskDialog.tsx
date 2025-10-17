import { useState, useEffect } from 'react'
import { Calendar, Clock, Flag, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ModernDatePicker } from '@/components/ui/modern-date-picker'
import { useTasks, Task } from '@/contexts/TasksContext'

interface EditTaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTaskDialog({ task, open, onOpenChange }: EditTaskDialogProps) {
  const { updateTask, deleteTask, completeTask, categories, createCategory } = useTasks()
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category_id: '',
    due_date: '',
    due_time: '',
    status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'cancelled'
  })

  // Update form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        category_id: task.category_id || '',
        due_date: task.due_date || '',
        due_time: task.due_time || '',
        status: task.status
      })
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!task || !formData.title.trim()) return

    await updateTask(task.id, {
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority,
      category_id: formData.category_id || undefined,
      due_date: formData.due_date || undefined,
      due_time: formData.due_time || undefined,
      status: formData.status as 'pending' | 'in_progress' | 'completed'
    })

    onOpenChange(false)
  }

  const handleComplete = async () => {
    if (!task) return
    await completeTask(task.id)
    onOpenChange(false)
  }

  const handleDelete = async () => {
    if (!task) return
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id)
      onOpenChange(false)
    }
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
      case 'urgent':
        return 'text-destructive bg-destructive/10'
      case 'high':
        return 'text-accent-foreground bg-accent/10'
      case 'medium':
        return 'text-primary bg-primary/10'
      case 'low':
        return 'text-muted-foreground bg-muted'
      default:
        return 'text-muted-foreground bg-muted'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-primary bg-primary/10'
      case 'in_progress':
        return 'text-accent-foreground bg-accent/10'
      case 'cancelled':
        return 'text-destructive bg-destructive/10'
      default:
        return 'text-muted-foreground bg-muted'
    }
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update task details or mark as complete
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional task description"
              rows={3}
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
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'pending' | 'in_progress' | 'completed' | 'cancelled') => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <Badge className={getStatusColor('pending')}>Pending</Badge>
                  </SelectItem>
                  <SelectItem value="in_progress">
                    <Badge className={getStatusColor('in_progress')}>In Progress</Badge>
                  </SelectItem>
                  <SelectItem value="completed">
                    <Badge className={getStatusColor('completed')}>Completed</Badge>
                  </SelectItem>
                  <SelectItem value="cancelled">
                    <Badge className={getStatusColor('cancelled')}>Cancelled</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <div className="space-y-2">
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
            </div>
          </div>

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

          <div className="flex justify-between gap-2 pt-4">
            <div className="flex gap-2">
              {task.status !== 'completed' && (
                <Button 
                  type="button" 
                  variant="default"
                  onClick={handleComplete}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Mark Complete
                </Button>
              )}
              <Button 
                type="button" 
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}