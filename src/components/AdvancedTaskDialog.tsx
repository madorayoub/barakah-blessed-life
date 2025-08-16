import { useState } from 'react'
import { Calendar, Flag, User, Tag, FileText, Clock, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useTasks, Task } from '@/hooks/useTasks'
import { toast } from '@/hooks/use-toast'

interface AdvancedTaskDialogProps {
  children: React.ReactNode
}

export function AdvancedTaskDialog({ children }: AdvancedTaskDialogProps) {
  const { createTask, categories, createCategory } = useTasks()
  const [open, setOpen] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    status: 'pending' as Task['status'],
    category_id: '',
    due_date: '',
    due_time: '',
    tags: [] as string[],
    estimated_hours: ''
  })

  // New category creation
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Task title is required"
      })
      return
    }

    // Format due date
    let dueDate = undefined
    if (formData.due_date) {
      if (formData.due_time) {
        dueDate = `${formData.due_date}T${formData.due_time}:00`
      } else {
        dueDate = formData.due_date
      }
    }

    const taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority,
      status: formData.status,
      category_id: formData.category_id || undefined,
      due_date: dueDate,
      due_time: formData.due_time || undefined,
      is_recurring: false
    }

    await createTask(taskData)
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      category_id: '',
      due_date: '',
      due_time: '',
      tags: [],
      estimated_hours: ''
    })
    setOpen(false)
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return
    
    const category = await createCategory({
      name: newCategoryName.trim(),
      color: '#3B82F6',
      icon: 'folder',
      is_default: false
    })
    
    if (category) {
      setFormData(prev => ({ ...prev, category_id: category.id }))
      setNewCategoryName('')
      setShowNewCategory(false)
    }
  }

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5 text-primary" />
            Create Advanced Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Task Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What needs to be done?"
              className="text-base font-medium border-2 border-gray-200 focus:border-primary"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add details about this task..."
              rows={4}
              className="text-base border-2 border-gray-200 focus:border-primary resize-none"
            />
          </div>

          {/* Row 1: Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Priority
              </Label>
              <Select value={formData.priority} onValueChange={(value: Task['priority']) => 
                setFormData(prev => ({ ...prev, priority: value }))
              }>
                <SelectTrigger className="border-2 border-gray-200 focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      <span>Low</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span>Medium</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-400" />
                      <span>High</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <span>Urgent</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={formData.status} onValueChange={(value: Task['status']) => 
                setFormData(prev => ({ ...prev, status: value }))
              }>
                <SelectTrigger className="border-2 border-gray-200 focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Due Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Due Date
              </Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                className="border-2 border-gray-200 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_time" className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Due Time
              </Label>
              <Input
                id="due_time"
                type="time"
                value={formData.due_time}
                onChange={(e) => setFormData(prev => ({ ...prev, due_time: e.target.value }))}
                className="border-2 border-gray-200 focus:border-primary"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Category
            </Label>
            <div className="flex gap-2">
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger className="flex-1 border-2 border-gray-200 focus:border-primary">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewCategory(!showNewCategory)}
                className="border-2 border-gray-200"
              >
                New
              </Button>
            </div>

            {showNewCategory && (
              <div className="flex gap-2 mt-2">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                  className="flex-1 border-2 border-primary/30 bg-primary/5"
                />
                <Button type="button" onClick={handleCreateCategory} size="sm">
                  Add
                </Button>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-100 hover:text-red-600"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add tags (press Enter)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag(e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
              className="border-2 border-gray-200 focus:border-primary"
            />
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className={getPriorityColor(formData.priority)}>
                {formData.priority} priority
              </Badge>
              {formData.due_date && (
                <Badge variant="outline">
                  Due {new Date(formData.due_date).toLocaleDateString()}
                </Badge>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.title.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                Create Advanced Task
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}