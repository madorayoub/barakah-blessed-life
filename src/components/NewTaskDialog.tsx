import { useState } from 'react'
import { Plus, Calendar, Clock, Flag, BookOpen, Heart, Star, Gift, GraduationCap, Phone, Users, Sun, Moon, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ModernDatePicker } from '@/components/ui/modern-date-picker'
import { useTasks, TaskTemplate } from '@/hooks/useTasks'
import { AdvancedTaskDialog } from './AdvancedTaskDialog'

const iconMap: Record<string, any> = {
  'sun': Sun,
  'moon': Moon,
  'book-open': BookOpen,
  'heart': Heart,
  'star': Star,
  'gift': Gift,
  'mosque': BookOpen, // Use BookOpen as fallback since Mosque isn't available
  'graduation-cap': GraduationCap,
  'phone': Phone,
  'users': Users,
  'circle': Plus
}

interface NewTaskDialogProps {
  children: React.ReactNode
}

export function NewTaskDialog({ children }: NewTaskDialogProps) {
  const { createTask, createTaskFromTemplate, createCategory, categories, templates } = useTasks()
  const [open, setOpen] = useState(false)
  const [isTemplate, setIsTemplate] = useState(false)
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category_id: '',
    due_date: '',
    due_time: ''
  })

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

    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category_id: '',
      due_date: '',
      due_time: ''
    })
    setOpen(false)
  }

  const handleTemplateSelect = async (template: TaskTemplate) => {
    await createTaskFromTemplate(template)
    setOpen(false)
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return

    // Generate a random color for the new category
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    const newCategory = await createCategory({
      name: newCategoryName,
      color: randomColor,
      icon: 'circle',
      is_default: false
    })

    if (newCategory) {
      setFormData(prev => ({ ...prev, category_id: newCategory.id }))
      setNewCategoryName('')
      setShowNewCategory(false)
    }
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a custom task or choose from Islamic templates
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="default"
                size="sm"
                className="h-8"
              >
                <Plus className="h-3 w-3 mr-1" />
                Quick Task
              </Button>
              <AdvancedTaskDialog>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Advanced
                </Button>
              </AdvancedTaskDialog>
            </div>
          </div>

          {/* Template or Custom Toggle */}
          <div className="flex gap-2 justify-center">
            <Button
              type="button"
              variant={!isTemplate ? "default" : "outline"}
              onClick={() => setIsTemplate(false)}
              size="sm"
            >
              Custom Task
            </Button>
            <Button
              type="button"
              variant={isTemplate ? "default" : "outline"}
              onClick={() => setIsTemplate(true)}
              size="sm"
            >
              Islamic Templates
            </Button>
          </div>

          {isTemplate ? (
            /* Template Selection */
            <div className="space-y-4">
              <h3 className="font-medium">Choose from Islamic Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {templates.map((template) => {
                  const IconComponent = iconMap[template.icon] || Plus
                  
                  return (
                    <Card 
                      key={template.id} 
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconComponent className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{template.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className={`text-xs ${getPriorityColor(template.priority)}`}>
                                {template.priority}
                              </Badge>
                              {template.estimated_duration && (
                                <Badge variant="outline" className="text-xs">
                                  {template.estimated_duration}m
                                </Badge>
                              )}
                              {template.is_recurring && (
                                <Badge variant="outline" className="text-xs">
                                  {template.recurring_pattern}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Custom Task Form */
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
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
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
              </div>

              <div className="space-y-4">
                <ModernDatePicker
                  label="Due Date"
                  value={formData.due_date}
                  onChange={(date) => setFormData(prev => ({ ...prev, due_date: date }))}
                  showTime={true}
                  timeValue={formData.due_time}
                  onTimeChange={(time) => setFormData(prev => ({ ...prev, due_time: time }))}
                  placeholder="Select due date (optional)"
                  className="w-full"
                />
              </div>

              {/* Quick Time Buttons */}
              <div className="space-y-2">
                <Label>Quick Duration</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, description: '5 minute task' }))}
                  >
                    5 min
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, description: '15 minute task' }))}
                  >
                    15 min
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, description: '30 minute task' }))}
                  >
                    30 min
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Task
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}