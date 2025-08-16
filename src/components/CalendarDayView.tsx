import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, CheckCircle, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { usePrayerTimes } from '@/hooks/usePrayerTimes'
import { useTasks } from '@/hooks/useTasks'
import { calculatePrayerTimes, formatPrayerTime } from '@/lib/prayerTimes'
import { GoogleCalendarConnect } from '@/components/GoogleCalendarConnect'
import { AppleCalendarExport } from '@/components/AppleCalendarExport'

interface CalendarEvent {
  id: string
  type: 'prayer' | 'task'
  title: string
  time?: Date
  completed?: boolean
  isNext?: boolean
}

const CalendarDayView = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { prayerTimes, settings, location, markPrayerComplete, isPrayerComplete } = usePrayerTimes()
  const { tasks } = useTasks()

  // Generate events for the current date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const events: CalendarEvent[] = []
    const now = new Date()
    
    // Add all prayer times for this date
    if (location && settings) {
      try {
        const dayPrayerTimes = calculatePrayerTimes(
          location.latitude, 
          location.longitude, 
          date, 
          settings
        )
        
        dayPrayerTimes.prayers.forEach(prayer => {
          events.push({
            id: `prayer-${prayer.name}-${date.toDateString()}`,
            type: 'prayer',
            title: prayer.displayName,
            time: prayer.time,
            completed: isPrayerComplete(prayer.name)
          })
        })
      } catch (error) {
        console.error('Error calculating prayer times for date:', error)
      }
    }
    
    // Add tasks for this date
    const dayTasks = tasks.filter(task => {
      if (!task.due_date) return false
      const taskDate = new Date(task.due_date)
      return taskDate.toDateString() === date.toDateString()
    })
    
    dayTasks.forEach(task => {
      events.push({
        id: `task-${task.id}`,
        type: 'task',
        title: task.title,
        time: task.due_time ? new Date(`${task.due_date}T${task.due_time}`) : undefined,
        completed: task.status === 'completed'
      })
    })
    
    // Sort by time and mark next upcoming event
    const sortedEvents = events.sort((a, b) => {
      if (!a.time && !b.time) return 0
      if (!a.time) return 1
      if (!b.time) return -1
      return a.time.getTime() - b.time.getTime()
    })
    
    // Mark next upcoming prayer if it's today
    if (date.toDateString() === now.toDateString()) {
      const nextEvent = sortedEvents.find(event => 
        event.time && event.time > now && !event.completed && event.type === 'prayer'
      )
      if (nextEvent) {
        nextEvent.isNext = true
      }
    }
    
    return sortedEvents
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const navigateDay = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }

  const events = getEventsForDate(currentDate)
  const prayers = events.filter(e => e.type === 'prayer')
  const tasksForDay = events.filter(e => e.type === 'task')

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDay('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDay('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            {/* Sync Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="ml-2">
                  <Settings className="h-4 w-4 mr-2" />
                  Sync
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Calendar Sync</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    Connect your external calendars to sync prayer times and tasks automatically.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GoogleCalendarConnect />
                    <AppleCalendarExport />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prayer Times Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-600" />
            Prayer Times
            {isToday(currentDate) && (
              <span className="text-sm font-normal text-muted-foreground">- Today</span>
            )}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {prayers.map(prayer => (
              <Card 
                key={prayer.id} 
                className={`p-4 ${
                  prayer.isNext 
                    ? 'ring-2 ring-emerald-500 bg-emerald-50' 
                    : prayer.completed 
                      ? 'bg-emerald-50 opacity-75' 
                      : 'bg-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{prayer.title}</div>
                    {prayer.time && (
                      <div className="text-sm text-muted-foreground">
                        {formatPrayerTime(prayer.time)}
                      </div>
                    )}
                    {prayer.isNext && (
                      <div className="text-xs text-emerald-600 font-medium mt-1">
                        Next Prayer
                      </div>
                    )}
                  </div>
                  {prayer.completed ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-300" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Tasks Section */}
        {tasksForDay.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              Tasks
            </h3>
            <div className="space-y-2">
              {tasksForDay.map(task => (
                <Card key={task.id} className={`p-3 ${task.completed ? 'bg-blue-50 opacity-75' : 'bg-card'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{task.title}</div>
                      {task.time && (
                        <div className="text-sm text-muted-foreground">
                          Due: {formatPrayerTime(task.time)}
                        </div>
                      )}
                    </div>
                    {task.completed ? (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-blue-300" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {prayers.length === 0 && tasksForDay.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No prayer times or tasks for this date.</p>
            <p className="text-sm">Check your location and prayer settings.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CalendarDayView