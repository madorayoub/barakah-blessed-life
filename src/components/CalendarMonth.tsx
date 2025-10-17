import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePrayerTimes } from '@/hooks/usePrayerTimes'
import { calculatePrayerTimes, formatPrayerTime } from '@/lib/prayerTimes'

interface CalendarEvent {
  id: string
  type: 'prayer' | 'task' | 'islamic-event'
  title: string
  time?: Date
  completed?: boolean
}

const CalendarMonth = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { prayerTimes, settings, location } = usePrayerTimes()

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentIterator = new Date(startDate)
    
    while (currentIterator <= lastDay || days.length < 42) {
      days.push(new Date(currentIterator))
      currentIterator.setDate(currentIterator.getDate() + 1)
      
      if (days.length >= 42) break
    }
    
    return days
  }, [currentDate])

  // Generate events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const events: CalendarEvent[] = []
    
    // Add prayer times for this date
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
            completed: false // You might want to check actual completion status
          })
        })
      } catch (error) {
        console.error('Error calculating prayer times for date:', error)
      }
    }
    
    // Add Islamic events (sample data)
    const islamicEvents = getIslamicEventsForDate(date)
    events.push(...islamicEvents)
    
    return events.sort((a, b) => {
      if (!a.time && !b.time) return 0
      if (!a.time) return 1
      if (!b.time) return -1
      return a.time.getTime() - b.time.getTime()
    })
  }

  const getIslamicEventsForDate = (date: Date): CalendarEvent[] => {
    const events: CalendarEvent[] = []
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    // Sample Islamic events (in a real app, you'd use a proper Islamic calendar library)
    const islamicEventData: Record<string, string> = {
      "1-1": "Islamic New Year",
      "1-10": "Day of Ashura",
      "3-12": "Mawlid al-Nabi (estimated)",
      "9-1": "Ramadan Begins (estimated)",
      "10-1": "Eid al-Fitr (estimated)",
      "12-10": "Eid al-Adha (estimated)"
    }
    
    const eventKey = `${month}-${day}`
    if (islamicEventData[eventKey]) {
      events.push({
        id: `islamic-${eventKey}`,
        type: 'islamic-event',
        title: islamicEventData[eventKey]
      })
    }
    
    return events
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex items-center gap-2">
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
              onClick={() => setCurrentDate(new Date())}
            >
              Today
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
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((date, index) => {
            const events = getEventsForDate(date)
            const prayers = events.filter(e => e.type === 'prayer')
            const islamicEvents = events.filter(e => e.type === 'islamic-event')
            
            return (
              <div
                key={index}
                className={`min-h-[100px] p-1 border border-border ${
                  !isCurrentMonth(date) ? 'bg-muted text-muted-foreground' : 'bg-card'
                } ${isToday(date) ? 'ring-2 ring-primary bg-primary/10' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday(date) ? 'text-primary' :
                  !isCurrentMonth(date) ? 'text-muted-foreground' : 'text-foreground'
                }`}>
                  {date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {/* Prayer times */}
                  {prayers.slice(0, 2).map(prayer => (
                    <div
                      key={prayer.id}
                      className="text-xs p-1 rounded bg-primary/10 text-primary flex items-center gap-1"
                    >
                      <Clock className="h-2 w-2" />
                      <span className="truncate">
                        {prayer.title}
                        {prayer.time && (
                          <span className="ml-1 font-medium">
                            {formatPrayerTime(prayer.time).split(' ')[0]}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                  
                  {/* Show prayer count if more than 2 */}
                  {prayers.length > 2 && (
                    <div className="text-xs text-primary px-1">
                      +{prayers.length - 2} more prayers
                    </div>
                  )}
                  
                  {/* Islamic events */}
                  {islamicEvents.map(event => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded bg-amber-100 text-amber-800"
                    >
                      <span className="truncate">{event.title}</span>
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
            <div className="w-3 h-3 rounded bg-amber-100 border border-amber-200"></div>
            <span>Islamic Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded ring-2 ring-emerald-500 bg-emerald-50"></div>
            <span>Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CalendarMonth