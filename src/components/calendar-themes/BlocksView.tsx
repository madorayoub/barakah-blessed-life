import { CheckCircle, Clock, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrayerTime } from '@/lib/prayerTimes'

interface CalendarEvent {
  id: string
  type: 'prayer' | 'task'
  title: string
  time?: Date
  completed?: boolean
  isNext?: boolean
}

interface BlocksViewProps {
  date: Date
  events: CalendarEvent[]
  onPrayerComplete?: (prayerName: string) => void
  onEventClick?: (event: CalendarEvent) => void
}

const BlocksView = ({ date, events, onEventClick }: BlocksViewProps) => {
  // Generate time blocks covering the full day
  const generateTimeBlocks = () => {
    const blocks = []
    const sortedEvents = [...events].sort((a, b) => {
      if (!a.time && !b.time) return 0
      if (!a.time) return 1
      if (!b.time) return -1
      return a.time.getTime() - b.time.getTime()
    })

    // Early morning block (4:00-6:00)
    const earlyMorningEvents = sortedEvents.filter(e => 
      e.time && e.time.getHours() >= 4 && e.time.getHours() < 6
    )
    if (earlyMorningEvents.length > 0) {
      blocks.push({
        id: 'early-morning',
        startTime: '4:00 AM',
        endTime: '6:00 AM',
        period: 'Early Morning',
        events: earlyMorningEvents,
        color: 'from-indigo-50 to-purple-50',
        borderColor: 'border-indigo-200',
        textColor: 'text-indigo-800'
      })
    }

    // Morning block (6:00-12:00)
    const morningEvents = sortedEvents.filter(e => 
      e.time && e.time.getHours() >= 6 && e.time.getHours() < 12
    )
    if (morningEvents.length > 0) {
      blocks.push({
        id: 'morning',
        startTime: '6:00 AM',
        endTime: '12:00 PM',
        period: 'Morning',
        events: morningEvents,
        color: 'from-yellow-50 to-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-800'
      })
    }

    // Afternoon block (12:00-18:00)
    const afternoonEvents = sortedEvents.filter(e => 
      e.time && e.time.getHours() >= 12 && e.time.getHours() < 18
    )
    if (afternoonEvents.length > 0) {
      blocks.push({
        id: 'afternoon',
        startTime: '12:00 PM',
        endTime: '6:00 PM',
        period: 'Afternoon',
        events: afternoonEvents,
        color: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800'
      })
    }

    // Evening block (18:00-22:00)
    const eveningEvents = sortedEvents.filter(e => 
      e.time && e.time.getHours() >= 18 && e.time.getHours() < 22
    )
    if (eveningEvents.length > 0) {
      blocks.push({
        id: 'evening',
        startTime: '6:00 PM',
        endTime: '10:00 PM',
        period: 'Evening',
        events: eveningEvents,
        color: 'from-purple-50 to-pink-50',
        borderColor: 'border-purple-200',
        textColor: 'text-purple-800'
      })
    }

    // Night block (22:00-24:00)
    const nightEvents = sortedEvents.filter(e => 
      e.time && e.time.getHours() >= 22
    )
    if (nightEvents.length > 0) {
      blocks.push({
        id: 'night',
        startTime: '10:00 PM',
        endTime: '12:00 AM',
        period: 'Night',
        events: nightEvents,
        color: 'from-slate-50 to-gray-50',
        borderColor: 'border-slate-200',
        textColor: 'text-slate-800'
      })
    }

    return blocks
  }

  const timeBlocks = generateTimeBlocks()
  const totalEvents = events.length
  const completedEvents = events.filter(e => e.completed).length
  const productivityScore = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0

  const getEventIcon = (event: CalendarEvent) => {
    if (event.type === 'prayer') {
      const icons: { [key: string]: string } = {
        'Fajr': '🌅',
        'Dhuhr': '🌞', 
        'Asr': '🌇',
        'Maghrib': '🌆',
        'Isha': '🌙'
      }
      return icons[event.title] || '🕌'
    }
    return '📋'
  }

  const getBlockStatus = (block: any) => {
    const now = new Date()
    const currentHour = now.getHours()
    
    // Determine if block is active based on time ranges
    if (block.id === 'early-morning' && currentHour >= 4 && currentHour < 6) return 'active'
    if (block.id === 'morning' && currentHour >= 6 && currentHour < 12) return 'active'
    if (block.id === 'afternoon' && currentHour >= 12 && currentHour < 18) return 'active'
    if (block.id === 'evening' && currentHour >= 18 && currentHour < 22) return 'active'
    if (block.id === 'night' && currentHour >= 22) return 'active'
    
    const allCompleted = block.events.every((e: CalendarEvent) => e.completed)
    if (allCompleted && block.events.length > 0) return 'completed'
    
    return 'upcoming'
  }

  return (
    <div className="blocks-view space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })} - Time Blocks
        </h2>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
          Productivity Focus
        </Badge>
      </div>

      {/* Productivity Score */}
      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-emerald-600" />
              <div>
                <div className="font-semibold text-emerald-800">Productivity Score</div>
                <div className="text-sm text-emerald-600">
                  {completedEvents}/{totalEvents} items completed
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-800">{productivityScore}%</div>
              <div className="w-32 h-2 bg-emerald-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${productivityScore}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Blocks */}
      <div className="space-y-4">
        {timeBlocks.map(block => {
          const blockStatus = getBlockStatus(block)
          
          return (
            <Card 
              key={block.id}
              className={`
                transition-all duration-300
                ${blockStatus === 'active' 
                  ? 'ring-2 ring-amber-400 shadow-lg bg-amber-50' 
                  : blockStatus === 'completed'
                    ? 'bg-emerald-50 border-emerald-200'
                    : `bg-gradient-to-r ${block.color} ${block.borderColor}`
                }
              `}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-lg ${block.textColor}`}>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5" />
                      <div>
                        <div>{block.period}</div>
                        <div className="text-sm font-normal opacity-75">
                          {block.startTime} - {block.endTime}
                        </div>
                      </div>
                    </div>
                  </CardTitle>
                  
                  <div className="flex items-center gap-2">
                    {blockStatus === 'active' && (
                      <Badge variant="default" className="bg-amber-600">
                        → ACTIVE
                      </Badge>
                    )}
                    {blockStatus === 'completed' && (
                      <Badge variant="default" className="bg-emerald-600">
                        ✅ COMPLETE
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {block.events.length} item{block.events.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {block.events.map((event: CalendarEvent) => (
                  <div 
                    key={event.id}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer
                      ${event.completed 
                        ? 'bg-emerald-100 border-emerald-200 opacity-75 hover:opacity-90' 
                        : event.isNext
                          ? 'bg-amber-100 border-amber-200 hover:bg-amber-150'
                          : 'bg-white border-gray-200 hover:shadow-sm hover:bg-gray-50'
                      }
                    `}
                    onClick={() => onEventClick?.(event)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getEventIcon(event)}</span>
                      <div>
                        <div className={`font-medium ${event.completed ? 'line-through' : ''}`}>
                          {event.title} {event.type === 'prayer' ? 'Prayer' : ''}
                        </div>
                        {event.time && (
                          <div className="text-sm text-muted-foreground">
                            {formatPrayerTime(event.time)}
                          </div>
                        )}
                        {event.isNext && (
                          <div className="text-xs text-amber-600 font-medium">
                            Current focus
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {event.completed && (
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Motivation Footer */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <div className="text-lg font-semibold text-blue-800 mb-2">
            🎯 Time Management Excellence
          </div>
          <div className="text-blue-700">
            "Time is the most valuable thing we have. Use it wisely in worship and productivity."
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BlocksView