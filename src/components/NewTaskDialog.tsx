import { useState, useEffect } from 'react'
import { Plus, Calendar, Clock, Flag, BookOpen, Heart, Star, Gift, GraduationCap, Phone, Users, Sun, Moon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ModernDatePicker } from '@/components/ui/modern-date-picker'
import { useTasks, TaskTemplate, Task } from '@/contexts/TasksContext'

const iconMap: Record<string, any> = {
  'sun': Sun,
  'moon': Moon,
  'book-open': BookOpen,
  'heart': Heart,
  'star': Star,
  'gift': Gift,
  'mosque': BookOpen,
  'graduation-cap': GraduationCap,
  'phone': Phone,
  'users': Users,
  'circle': Plus
}

// Islamic template icons mapping - comprehensive coverage
const islamicTemplateIcons: Record<string, string> = {
  // Prayer times
  'fajr': '🌅',
  'dhuhr': '☀️', 
  'asr': '🌤️',
  'maghrib': '🌇',
  'isha': '🌙',
  
  // Islamic practices  
  'quran': '📖',
  'dhikr': '📿',
  'dua': '🤲',
  'prayer': '🤲',
  'study': '🕌',
  'hadith': '📜',
  'mosque': '🕌',
  'charity': '💝',
  'zakat': '💰',
  'hajj': '🕋',
  'umrah': '🕋',
  'ramadan': '🌙',
  'fasting': '🌙',
  'tasbih': '📿',
  'salah': '🤲',
  'wudu': '💧',
  'qibla': '🧭',
  'islamic': '☪️',
  'recitation': '📖',
  'memorization': '🧠',
  'reflection': '💭'
}

// Helper function to get the appropriate icon for a template
const getTemplateIcon = (templateName: string): string => {
  const name = templateName.toLowerCase()
  
  // Direct matches first
  for (const [key, icon] of Object.entries(islamicTemplateIcons)) {
    if (name.includes(key)) {
      return icon
    }
  }
  
  // Fallback based on common Islamic terms
  if (name.includes('prayer') || name.includes('salah')) return '🤲'
  if (name.includes('quran') || name.includes('qur')) return '📖'
  if (name.includes('dhikr') || name.includes('remembrance')) return '📿'
  if (name.includes('dua') || name.includes('supplication')) return '🤲'
  if (name.includes('study') || name.includes('learn')) return '🕌'
  if (name.includes('hadith')) return '📜'
  if (name.includes('charity') || name.includes('sadaqah')) return '💝'
  if (name.includes('fast') || name.includes('suhur') || name.includes('iftar')) return '🌙'
  
  // Default Islamic icon
  return '☪️'
}

interface NewTaskDialogProps {
  children: React.ReactNode
  onTaskCreate?: (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  initialStatus?: 'pending' | 'in_progress' | 'completed'
}

export function NewTaskDialog({ children, onTaskCreate: propOnTaskCreate, initialStatus = 'pending' }: NewTaskDialogProps) {
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
    due_time: '',
    status: initialStatus
  })

  // Update status when initialStatus changes (when different column opens dialog)
  useEffect(() => {
    setFormData(prev => ({ ...prev, status: initialStatus }))
  }, [initialStatus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) return

    const taskData = {
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority,
      status: formData.status as 'pending' | 'in_progress' | 'completed',
      category_id: formData.category_id || undefined,
      due_date: formData.due_date || undefined,
      due_time: formData.due_time || undefined,
      is_recurring: false
    }

    // Use prop function if provided, otherwise use context
    if (propOnTaskCreate) {
      await propOnTaskCreate(taskData)
    } else {
      await createTask(taskData)
    }

    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category_id: '',
      due_date: '',
      due_time: '',
      status: initialStatus
    })
    setOpen(false)
  }

  const handleTemplateSelect = async (template: TaskTemplate) => {
    await createTaskFromTemplate(template.id)
    setOpen(false)
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return

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

  const getTemplateColor = (index: number) => {
    const colors = [
      'bg-primary/10 border border-primary/20 hover:bg-primary/15',
      'bg-accent/10 border border-accent/20 hover:bg-accent/15',
      'bg-secondary border border-border hover:bg-secondary/80',
      'bg-muted border border-border hover:bg-muted/80',
      'bg-card border border-border hover:bg-muted',
      'bg-primary/5 border border-primary/15 hover:bg-primary/10'
    ]
    return colors[index % colors.length]
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[600px] p-0 bg-card border border-border shadow-lg">

        {/* Compact Header */}
        <div className="px-6 py-4 border-b border-border bg-muted">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
              <Plus className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Create Task</h2>
              <p className="text-sm text-muted-foreground">Add a new task to your list</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">

          {/* Template Toggle (Compact) */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                type="button"
                variant={!isTemplate ? "default" : "ghost"}
                onClick={() => setIsTemplate(false)}
                className={`px-4 py-2 text-sm rounded-md transition-all ${
                  !isTemplate
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Custom Task
              </Button>
              <Button
                type="button"
                variant={isTemplate ? "default" : "ghost"}
                onClick={() => setIsTemplate(true)}
                className={`px-4 py-2 text-sm rounded-md transition-all ${
                  isTemplate
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Templates
              </Button>
            </div>
          </div>

          {isTemplate ? (
            /* Compact Templates Section */
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground text-center">Islamic Templates</h3>
              <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                {templates.map((template, index) => {
                  // Use the comprehensive icon detection function
                  const templateIcon = getTemplateIcon(template.name)

                  return (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all duration-200 rounded-lg shadow-sm hover:shadow-md ${getTemplateColor(index)}`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                       <CardContent className="p-4">
                         <div className="flex items-center gap-3">
                           <div className="text-2xl w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ fontSize: '24px', lineHeight: '24px' }}>
                             {templateIcon}
                           </div>
                           <div className="flex-1 min-w-0 ml-3">
                            <h4 className="text-sm font-semibold text-foreground truncate">{template.name}</h4>
                            <p className="text-xs text-muted-foreground truncate mt-1">{template.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Compact Custom Form */
            <div className="space-y-4">
              
              {/* Top Row: Title and Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="title" className="text-sm font-medium text-foreground">Task Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="What needs to be done?"
                    className="h-10 px-3 text-sm bg-background border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-foreground">Due Date</Label>
                  <ModernDatePicker
                    value={formData.due_date}
                    onChange={(date) => setFormData(prev => ({ ...prev, due_date: date }))}
                    showTime={true}
                    timeValue={formData.due_time}
                    onTimeChange={(time) => setFormData(prev => ({ ...prev, due_time: time }))}
                    placeholder="Set deadline"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Second Row: Priority and Category */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-foreground">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') =>
                      setFormData(prev => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger className="h-10 px-3 text-sm bg-background border border-border rounded-md focus:border-primary transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border">
                      <SelectItem value="low" className="text-foreground">🟢 Low</SelectItem>
                      <SelectItem value="medium" className="text-foreground">🟡 Medium</SelectItem>
                      <SelectItem value="high" className="text-foreground">🟠 High</SelectItem>
                      <SelectItem value="urgent" className="text-foreground">🔴 Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium text-foreground">Category</Label>
                  {!showNewCategory ? (
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                    >
                      <SelectTrigger className="h-10 px-3 text-sm bg-background border border-border rounded-md focus:border-primary transition-all">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border border-border">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id} className="text-foreground">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="text-sm">{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="__add_new__" onSelect={() => setShowNewCategory(true)} className="text-primary">
                          <div className="flex items-center gap-2">
                            <Plus className="w-3 h-3" />
                            <span className="text-sm">Add Category</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex gap-1">
                      <Input
                        placeholder="Category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="h-10 px-3 text-sm bg-background border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                        className="h-10 px-3"
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label htmlFor="description" className="text-sm font-medium text-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add details about this task..."
                  rows={3}
                  className="px-3 py-2 text-sm bg-background border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              {/* Quick Duration */}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-foreground">Quick Duration</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, description: prev.description + (prev.description ? ' • ' : '') + '5 minute task' }))}
                    className="text-xs px-3 py-1 h-7"
                  >
                    5m
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, description: prev.description + (prev.description ? ' • ' : '') + '15 minute task' }))}
                    className="text-xs px-3 py-1 h-7"
                  >
                    15m
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, description: prev.description + (prev.description ? ' • ' : '') + '30 minute task' }))}
                    className="text-xs px-3 py-1 h-7"
                  >
                    30m
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Compact Footer */}
        {!isTemplate && (
          <div className="px-6 py-4 border-t border-border bg-muted">
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline" 
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="px-4 py-2 text-sm"
                disabled={!formData.title.trim()}
              >
                Create Task
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}