import { useState } from 'react'
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
import { useTasks, TaskTemplate } from '@/hooks/useTasks'

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0 bg-[#f8f9fa] border-0 shadow-xl">
        
        {/* Header Section */}
        <div className="bg-white border-b border-[#e9ecef] px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#1ca094] to-[#16a085] flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#333] leading-none">Create New Task</h2>
                <p className="text-sm text-[#666] mt-1">Build your Islamic productivity journey</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-8 space-y-8">
            
            {/* Template Toggle Section */}
            <div className="flex items-center justify-center">
              <div className="bg-white rounded-lg p-2 shadow-sm border border-[#e9ecef]">
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant={!isTemplate ? "default" : "ghost"}
                    onClick={() => setIsTemplate(false)}
                    className={`px-6 py-3 rounded-md font-medium transition-all ${
                      !isTemplate 
                        ? 'bg-gradient-to-r from-[#1ca094] to-[#16a085] text-white shadow-sm' 
                        : 'text-[#666] hover:text-[#333] hover:bg-gray-50'
                    }`}
                  >
                    Custom Task
                  </Button>
                  <Button
                    type="button"
                    variant={isTemplate ? "default" : "ghost"}
                    onClick={() => setIsTemplate(true)}
                    className={`px-6 py-3 rounded-md font-medium transition-all ${
                      isTemplate 
                        ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white shadow-sm' 
                        : 'text-[#666] hover:text-[#333] hover:bg-gray-50'
                    }`}
                  >
                    ✨ Islamic Templates
                  </Button>
                </div>
              </div>
            </div>

            {isTemplate ? (
              /* Islamic Templates Section */
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-[#333] mb-2">Choose from Islamic Templates</h3>
                  <p className="text-sm text-[#666]">Pre-designed tasks for your spiritual journey</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                  {templates.map((template) => {
                    const IconComponent = iconMap[template.icon] || Plus
                    
                    return (
                      <Card 
                        key={template.id} 
                        className="cursor-pointer bg-white border border-[#e9ecef] hover:shadow-lg transition-all duration-200 hover:border-[#FFD700] hover:-translate-y-1 relative overflow-hidden"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFD700] to-[#FFA500]"></div>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 flex items-center justify-center border border-[#FFD700]/30">
                              <IconComponent className="h-6 w-6 text-[#B8860B]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-[#333] text-base mb-2 truncate">{template.name}</h4>
                              <p className="text-sm text-[#666] line-clamp-2 mb-3">
                                {template.description}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={`text-xs border ${getPriorityColor(template.priority)}`}>
                                  {template.priority}
                                </Badge>
                                {template.estimated_duration && (
                                  <Badge variant="outline" className="text-xs border-[#e9ecef] text-[#666]">
                                    {template.estimated_duration}m
                                  </Badge>
                                )}
                                {template.is_recurring && (
                                  <Badge variant="outline" className="text-xs border-[#1ca094] text-[#1ca094]">
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
              <div className="space-y-8">
                
                {/* Task Details Section */}
                <Card className="bg-white border border-[#e9ecef] shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-[#333] flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#1ca094]"></div>
                      Task Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Task Title */}
                    <div className="space-y-3">
                      <Label htmlFor="title" className="text-sm font-semibold text-[#333]">Task Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="What needs to be done?"
                        className="h-12 px-4 text-base font-medium border border-[#e9ecef] rounded-lg focus:border-[#1ca094] focus:ring-2 focus:ring-[#1ca094]/20 transition-all"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                      <Label htmlFor="description" className="text-sm font-semibold text-[#333]">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Add details about this task..."
                        rows={3}
                        className="px-4 py-3 border border-[#e9ecef] rounded-lg focus:border-[#1ca094] focus:ring-2 focus:ring-[#1ca094]/20 transition-all resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Task Properties Section */}
                <Card className="bg-white border border-[#e9ecef] shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-[#333] flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#0066cc]"></div>
                      Properties
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Priority and Category Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="priority" className="text-sm font-semibold text-[#333]">Priority</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                            setFormData(prev => ({ ...prev, priority: value }))
                          }
                        >
                          <SelectTrigger className="h-12 px-4 border border-[#e9ecef] rounded-lg focus:border-[#1ca094]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border border-[#e9ecef] shadow-lg">
                            <SelectItem value="low" className="py-3">🟢 Low Priority</SelectItem>
                            <SelectItem value="medium" className="py-3">🟡 Medium Priority</SelectItem>
                            <SelectItem value="high" className="py-3">🟠 High Priority</SelectItem>
                            <SelectItem value="urgent" className="py-3">🔴 Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="category" className="text-sm font-semibold text-[#333]">Category</Label>
                        <div className="space-y-3">
                          <Select
                            value={formData.category_id}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                          >
                            <SelectTrigger className="h-12 px-4 border border-[#e9ecef] rounded-lg focus:border-[#1ca094]">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="border border-[#e9ecef] shadow-lg">
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id} className="py-3">
                                  <div className="flex items-center gap-3">
                                    <div 
                                      className="w-3 h-3 rounded-full" 
                                      style={{ backgroundColor: category.color }}
                                    />
                                    <span className="font-medium">{category.name}</span>
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
                              onClick={() => setShowNewCategory(true)}
                              className="w-full h-10 border border-[#e9ecef] text-[#666] hover:text-[#333] hover:border-[#1ca094] transition-all"
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
                                className="h-10 border border-[#e9ecef] focus:border-[#1ca094]"
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
                                onClick={handleCreateCategory}
                                disabled={!newCategoryName.trim()}
                                className="h-10 bg-gradient-to-r from-[#1ca094] to-[#16a085] hover:from-[#16a085] hover:to-[#138b7a]"
                              >
                                Add
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setShowNewCategory(false)
                                  setNewCategoryName('')
                                }}
                                className="h-10 border border-[#e9ecef]"
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Due Date & Time */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-[#333]">Due Date & Time</Label>
                      <ModernDatePicker
                        value={formData.due_date}
                        onChange={(date) => setFormData(prev => ({ ...prev, due_date: date }))}
                        showTime={true}
                        timeValue={formData.due_time}
                        onTimeChange={(time) => setFormData(prev => ({ ...prev, due_time: time }))}
                        placeholder="When is this due?"
                        className="w-full"
                      />
                    </div>

                    {/* Quick Duration Buttons */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-[#333]">Quick Duration</Label>
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setFormData(prev => ({ ...prev, description: prev.description + (prev.description ? ' • ' : '') + '5 minute task' }))}
                          className="px-4 py-2 border border-[#e9ecef] text-[#666] hover:border-[#1ca094] hover:text-[#1ca094] transition-all"
                        >
                          5 min
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setFormData(prev => ({ ...prev, description: prev.description + (prev.description ? ' • ' : '') + '15 minute task' }))}
                          className="px-4 py-2 border border-[#e9ecef] text-[#666] hover:border-[#1ca094] hover:text-[#1ca094] transition-all"
                        >
                          15 min
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setFormData(prev => ({ ...prev, description: prev.description + (prev.description ? ' • ' : '') + '30 minute task' }))}
                          className="px-4 py-2 border border-[#e9ecef] text-[#666] hover:border-[#1ca094] hover:text-[#1ca094] transition-all"
                        >
                          30 min
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Footer Section */}
        {!isTemplate && (
          <div className="bg-white border-t border-[#e9ecef] px-8 py-6">
            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="px-6 py-3 border border-[#e9ecef] text-[#666] hover:text-[#333] hover:border-[#1ca094] transition-all"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="px-8 py-3 bg-gradient-to-r from-[#1ca094] to-[#16a085] hover:from-[#16a085] hover:to-[#138b7a] text-white font-medium shadow-sm transition-all"
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