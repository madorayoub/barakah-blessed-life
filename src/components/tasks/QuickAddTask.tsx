import { Plus, Calendar, Flag } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTasks } from '@/hooks/useTasks'

interface QuickAddTaskProps {
  groupId?: string
}

export function QuickAddTask({ groupId }: QuickAddTaskProps) {
  const { createTask } = useTasks()
  const [isAdding, setIsAdding] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium')

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!taskTitle.trim()) return

    // Smart due date based on group
    let dueDate = undefined
    const today = new Date()
    
    if (groupId === 'today') {
      dueDate = today.toISOString().split('T')[0]
    } else if (groupId === 'tomorrow') {
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      dueDate = tomorrow.toISOString().split('T')[0]
    }

    await createTask({
      title: taskTitle,
      priority,
      status: 'pending',
      due_date: dueDate,
      is_recurring: false
    })

    setTaskTitle('')
    setPriority('medium')
    setIsAdding(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape') {
      setTaskTitle('')
      setIsAdding(false)
    }
  }

  const cyclePriority = () => {
    const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent']
    const currentIndex = priorities.indexOf(priority)
    const nextIndex = (currentIndex + 1) % priorities.length
    setPriority(priorities[nextIndex])
  }

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (!isAdding) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsAdding(true)}
        className="w-full justify-start text-muted-foreground hover:text-foreground h-8 mb-1"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add task
      </Button>
    )
  }

  return (
    <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
      <CardContent className="p-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What needs to be done?"
            className="border-none shadow-none focus:ring-0 font-medium"
            autoFocus
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={cyclePriority}
                className="h-6 px-2"
              >
                <Flag className="h-3 w-3 mr-1" />
                <Badge variant="outline" className={`text-xs h-4 px-1 ${getPriorityColor(priority)}`}>
                  {priority}
                </Badge>
              </Button>
              
              {groupId && (
                <Badge variant="secondary" className="text-xs h-6">
                  <Calendar className="h-3 w-3 mr-1" />
                  {groupId === 'today' ? 'Due today' : 
                   groupId === 'tomorrow' ? 'Due tomorrow' : 
                   groupId}
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTaskTitle('')
                  setIsAdding(false)
                }}
                className="h-6 px-2 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!taskTitle.trim()}
                className="h-6 px-3 text-xs"
              >
                Add
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}