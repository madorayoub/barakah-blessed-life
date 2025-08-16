import { Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NewTaskDialog } from '@/components/NewTaskDialog'
import { MagicTaskCard } from './MagicTaskCard'
import { Task } from '@/contexts/TasksContext'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns'

interface TaskCalendarViewProps {
  tasks: Task[]
  onTaskComplete: (taskId: string) => void
  onTaskDelete: (taskId: string) => void
  onTaskEdit: (task: Task) => void
  onTaskCreate: (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  loading: boolean
}

export function TaskCalendarView({ tasks, onTaskComplete, onTaskDelete, onTaskEdit, onTaskCreate, loading }: TaskCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.due_date) return false
      return isSameDay(new Date(task.due_date), date)
    })
  }

  const getSelectedDateTasks = () => {
    return getTasksForDate(selectedDate)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentMonth(subMonths(currentMonth, 1))
    } else {
      setCurrentMonth(addMonths(currentMonth, 1))
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-96">
            <CardHeader>
              <div className="h-6 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="h-10 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-96">
            <CardHeader>
              <div className="h-6 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Task Calendar</h2>
          <p className="text-muted-foreground text-sm">Schedule and visualize your Islamic productivity</p>
        </div>
        <NewTaskDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </NewTaskDialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {format(currentMonth, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {monthDays.map(day => {
                  const dayTasks = getTasksForDate(day)
                  const isSelected = isSameDay(day, selectedDate)
                  const isToday = isSameDay(day, new Date())
                  
                  return (
                    <button
                      key={day.toString()}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        relative p-2 text-sm min-h-12 border rounded-lg transition-all hover:bg-accent
                        ${isSelected ? 'bg-primary text-white' : 'bg-background'}
                        ${isToday && !isSelected ? 'border-primary' : 'border-border'}
                      `}
                    >
                      <div className="font-medium">{format(day, 'd')}</div>
                      {dayTasks.length > 0 && (
                        <div className="absolute bottom-1 right-1">
                          <Badge 
                            variant="secondary" 
                            className={`h-4 w-4 p-0 text-xs flex items-center justify-center ${
                              isSelected ? 'bg-white/20 text-white' : ''
                            }`}
                          >
                            {dayTasks.length}
                          </Badge>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Tasks */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {format(selectedDate, 'MMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {getSelectedDateTasks().map(task => (
                  <MagicTaskCard
                    key={task.id}
                    task={task}
                    onComplete={onTaskComplete}
                    onDelete={onTaskDelete}
                    onEdit={onTaskEdit}
                  />
                ))}
                
                {getSelectedDateTasks().length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <p className="text-sm mb-2">No tasks scheduled</p>
                    <NewTaskDialog>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </NewTaskDialog>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Calendar Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Calendar Tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Click on any date to view tasks for that day</li>
                <li>• Numbers on dates show how many tasks are scheduled</li>
                <li>• Create tasks with due dates to see them on the calendar</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}