import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Clock, CheckCircle, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
}

const CalendarWeekView = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const { prayerTimes, settings, location, markPrayerComplete, isPrayerComplete } = usePrayerTimes()
  const { tasks } = useTasks()

  // Generate week days
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentWeek)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      days.push(date)
    }
    return days
  }, [currentWeek])

  // Generate events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const events: CalendarEvent[] = []
    
    // Add main prayer times (Fajr, Dhuhr, Maghrib)
    if (location && settings) {
      try {
        const dayPrayerTimes = calculatePrayerTimes(
          location.latitude, 
          location.longitude, 
          date, 
          settings
        )
        
        // Only show 3 main prayers for clean display
        const mainPrayers = ['fajr', 'dhuhr', 'maghrib']
        dayPrayerTimes.prayers
          .filter(prayer => mainPrayers.includes(prayer.name.toLowerCase()))
          .forEach(prayer => {
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
    
    dayTasks.slice(0, 2).forEach(task => {
      events.push({
        id: `task-${task.id}`,
        type: 'task',
        title: task.title,
        time: task.due_time ? new Date(`${task.due_date}T${task.due_time}`) : undefined,
        completed: task.status === 'completed'
      })
    })
    
    return events.sort((a, b) => {
      if (!a.time && !b.time) return 0
      if (!a.time) return 1
      if (!b.time) return -1
      return a.time.getTime() - b.time.getTime()
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7))
      return newDate
    })
  }

  const getWeekDateRange = () => {
    const start = weekDays[0]
    const end = weekDays[6]
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' })
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' })
    
    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`
    } else {
      return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${start.getFullYear()}`
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            {getWeekDateRange()}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('next')}
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
      <CardContent>
        {/* Week Grid */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((date, index) => {
            const events = getEventsForDate(date)
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
            
            return (
              <div
                key={index}
                className={`min-h-[280px] p-3 border border-border rounded-lg ${
                  isToday(date) ? 'ring-2 ring-primary bg-primary/5' : 'bg-card'
                }`}
              >
                <div className="text-center mb-3">
                  <div className={`text-sm font-medium ${
                    isToday(date) ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {dayName}
                  </div>
                  <div className={`text-lg font-bold ${
                    isToday(date) ? 'text-primary' : 'text-foreground'
                  }`}>
                    {date.getDate()}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {events.map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-2 rounded-md flex items-start gap-2 ${
                        event.type === 'prayer' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      } ${event.completed ? 'opacity-50' : ''}`}
                    >
                      {event.completed ? (
                        <CheckCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Clock className="h-3 w-3 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{event.title}</div>
                        {event.time && (
                          <div className="text-xs opacity-75">
                            {formatPrayerTime(event.time).split(' ')[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200"></div>
            <span>Prayer Times</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div>
            <span>Tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-muted-foreground" />
            <span>Completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CalendarWeekView