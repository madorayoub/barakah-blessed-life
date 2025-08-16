import { Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrayerTime } from '@/lib/prayerTimes'

interface CalendarEvent {
  id: string
  type: 'prayer' | 'task'
  title: string
  time?: Date
  completed?: boolean
  isNext?: boolean
}

interface TimelineViewProps {
  date: Date
  events: CalendarEvent[]
  onPrayerComplete?: (prayerName: string) => void
}

const TimelineView = ({ date, events }: TimelineViewProps) => {
  // Generate hourly slots from 4 AM to 11 PM
  const hours = Array.from({ length: 19 }, (_, i) => i + 4)
  const now = new Date()
  const currentHour = now.getHours()
  const isToday = date.toDateString() === now.toDateString()

  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      if (!event.time) return false
      return event.time.getHours() === hour
    })
  }

  const formatHour = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:00 ${ampm}`
  }

  return (
    <div className="timeline-view">
      <div className="sticky top-0 bg-background z-10 pb-4">
        <h2 className="text-2xl font-bold mb-2">
          {date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h2>
        <div className="text-muted-foreground">Timeline View</div>
      </div>

      <div className="timeline-container space-y-0 relative">
        {/* Current time indicator */}
        {isToday && (
          <div 
            className="absolute left-20 right-0 h-0.5 bg-red-500 z-20 flex items-center"
            style={{ 
              top: `${(currentHour - 4) * 80 + (now.getMinutes() / 60) * 80}px` 
            }}
          >
            <div className="absolute -left-20 text-xs text-red-500 font-medium bg-background px-1">
              {formatPrayerTime(now)}
            </div>
            <div className="w-2 h-2 bg-red-500 rounded-full -ml-1"></div>
          </div>
        )}

        {hours.map(hour => {
          const hourEvents = getEventsForHour(hour)
          const isCurrentHour = isToday && hour === currentHour

          return (
            <div key={hour} className="hour-slot flex min-h-[80px] border-b border-border/30">
              <div className="time-label w-20 text-sm text-muted-foreground pt-2 pr-4 text-right">
                {formatHour(hour)}
              </div>
              
              <div className="events-container flex-1 py-2 relative">
                {hourEvents.length > 0 ? (
                  <div className="space-y-2">
                    {hourEvents.map(event => (
                      <Card 
                        key={event.id}
                        className={`
                          p-3 transition-all
                          ${event.type === 'prayer' 
                            ? event.isNext 
                              ? 'bg-emerald-100 border-emerald-300 shadow-sm' 
                              : event.completed 
                                ? 'bg-emerald-50 opacity-75' 
                                : 'bg-emerald-50 border-emerald-200'
                            : event.completed 
                              ? 'bg-blue-50 opacity-75' 
                              : 'bg-blue-50 border-blue-200'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-3 h-3 rounded-full
                              ${event.type === 'prayer' ? 'bg-emerald-500' : 'bg-blue-500'}
                            `} />
                            <div>
                              <div className="font-medium text-sm">{event.title}</div>
                              {event.time && (
                                <div className="text-xs text-muted-foreground">
                                  {formatPrayerTime(event.time)}
                                </div>
                              )}
                              {event.isNext && (
                                <div className="text-xs text-emerald-600 font-medium">
                                  ← Next Prayer
                                </div>
                              )}
                            </div>
                          </div>
                          {event.completed && (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : isCurrentHour ? (
                  <div className="text-xs text-muted-foreground italic py-2">
                    Current hour
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TimelineView