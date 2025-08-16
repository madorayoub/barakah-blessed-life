import { CheckCircle, Clock, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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

interface AgendaViewProps {
  date: Date
  events: CalendarEvent[]
  onPrayerComplete?: (prayerName: string) => void
}

const AgendaView = ({ date, events, onPrayerComplete }: AgendaViewProps) => {
  const prayers = events.filter(e => e.type === 'prayer')
  const tasks = events.filter(e => e.type === 'task')
  
  const completedPrayers = prayers.filter(p => p.completed)
  const currentPrayer = prayers.find(p => p.isNext && !p.completed)
  const upcomingPrayers = prayers.filter(p => !p.completed && !p.isNext)
  
  const completedTasks = tasks.filter(t => t.completed)
  const pendingTasks = tasks.filter(t => !t.completed)

  const totalEvents = prayers.length + tasks.length
  const completedEvents = completedPrayers.length + completedTasks.length

  return (
    <div className="agenda-view space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          Today - {date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h2>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
            📊 Progress: {completedEvents}/{totalEvents} complete
          </Badge>
        </div>
      </div>

      {/* COMPLETED SECTION */}
      {(completedPrayers.length > 0 || completedTasks.length > 0) && (
        <Card className="bg-emerald-50/50 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-800">
              ✅ COMPLETED
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                {completedEvents}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {completedPrayers.map(prayer => (
              <div key={prayer.id} className="flex items-center gap-3 p-2 rounded-lg bg-emerald-100/50">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <div className="flex-1">
                  <div className="font-medium text-emerald-800">🕌 {prayer.title} Prayer</div>
                  {prayer.time && (
                    <div className="text-xs text-emerald-600">
                      {formatPrayerTime(prayer.time)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {completedTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-blue-100/50">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <div className="font-medium text-blue-800">📋 {task.title}</div>
                  {task.time && (
                    <div className="text-xs text-blue-600">
                      {formatPrayerTime(task.time)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* CURRENT SECTION */}
      {currentPrayer && (
        <Card className="bg-amber-50 border-amber-300 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
              📍 CURRENT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-amber-100 border border-amber-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-amber-600" />
                  <div>
                    <div className="font-semibold text-amber-900">
                      🕌 {currentPrayer.title} Prayer
                    </div>
                    {currentPrayer.time && (
                      <div className="text-sm text-amber-700">
                        {formatPrayerTime(currentPrayer.time)}
                      </div>
                    )}
                    <div className="text-xs text-amber-600 font-medium mt-1">
                      → Next Prayer
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={() => onPrayerComplete?.(currentPrayer.title)}
                >
                  Mark Complete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* UPCOMING PRAYERS */}
      {upcomingPrayers.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              ⏳ UPCOMING PRAYERS
              <Badge variant="outline">{upcomingPrayers.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingPrayers.map(prayer => (
              <div key={prayer.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium">🕌 {prayer.title} Prayer</div>
                  {prayer.time && (
                    <div className="text-sm text-muted-foreground">
                      {formatPrayerTime(prayer.time)}
                    </div>
                  )}
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* PENDING TASKS */}
      {pendingTasks.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              📋 PENDING TASKS
              <Badge variant="outline">{pendingTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium">📋 {task.title}</div>
                  {task.time && (
                    <div className="text-sm text-muted-foreground">
                      Due: {formatPrayerTime(task.time)}
                    </div>
                  )}
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* MOTIVATIONAL FOOTER */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="text-center py-6">
          <div className="text-lg font-medium text-purple-800 mb-2">
            🌟 Daily Reflection
          </div>
          <div className="text-purple-700 italic">
            "And it is He who created the heavens and earth in truth. And the day He says, 'Be,' and it is, His word is the truth."
          </div>
          <div className="text-xs text-purple-600 mt-2">Quran 6:73</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AgendaView