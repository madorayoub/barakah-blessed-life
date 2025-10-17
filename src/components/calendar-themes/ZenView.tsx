import { CheckCircle, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrayerTime } from '@/lib/prayerTimes'

interface CalendarEvent {
  id: string
  type: 'prayer' | 'task'
  title: string
  time?: Date
  completed?: boolean
  isNext?: boolean
  taskData?: any // Full task object for editing
}

interface ZenViewProps {
  date: Date
  events: CalendarEvent[]
  onPrayerComplete?: (prayerName: string) => void
  onEventClick?: (event: CalendarEvent) => void
  onAddTask?: () => void
}

const ZenView = ({ date, events, onEventClick, onAddTask }: ZenViewProps) => {
  const prayers = events.filter(e => e.type === 'prayer')
  const tasks = events.filter(e => e.type === 'task')

  const morningPrayers = prayers.filter(p => ['Fajr'].includes(p.title))
  const afternoonPrayers = prayers.filter(p => ['Dhuhr', 'Asr'].includes(p.title))
  const eveningPrayers = prayers.filter(p => ['Maghrib', 'Isha'].includes(p.title))

  const getPrayerIcon = (prayerName: string) => {
    const icons: { [key: string]: string } = {
      'Fajr': '🌅',
      'Dhuhr': '🌞', 
      'Asr': '🌇',
      'Maghrib': '🌆',
      'Isha': '🌙'
    }
    return icons[prayerName] || '🕌'
  }

  const PrayerItem = ({ prayer }: { prayer: CalendarEvent }) => (
    <div 
      className={`
        flex items-center justify-between py-3 px-4 rounded-lg transition-all cursor-pointer
        ${prayer.isNext 
          ? 'bg-amber-50 border border-amber-200 hover:bg-amber-100' 
          : prayer.completed 
            ? 'opacity-60 hover:opacity-80' 
            : 'hover:bg-muted/50'
        }
      `}
      onClick={() => onEventClick?.(prayer)}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{getPrayerIcon(prayer.title)}</span>
        <div>
          <div className={`font-medium ${prayer.completed ? 'line-through' : ''}`}>
            {prayer.title}
          </div>
          {prayer.time && !prayer.isNext && (
            <div className="text-sm text-muted-foreground">
              {formatPrayerTime(prayer.time)}
            </div>
          )}
          {prayer.isNext && (
            <div className="text-sm text-amber-600 font-medium">
              Now - {prayer.time && formatPrayerTime(prayer.time)}
            </div>
          )}
        </div>
      </div>
      {prayer.completed && <CheckCircle className="h-4 w-4 text-emerald-600" />}
    </div>
  )

  const getArabicDay = () => {
    const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    return arabicDays[date.getDay()]
  }

  return (
    <div className="zen-view max-w-2xl mx-auto space-y-8 py-4">
      {/* Peaceful Header */}
      <div className="text-center space-y-4">
        <div className="text-2xl font-light text-muted-foreground">
          {getArabicDay()}
        </div>
        <div className="text-3xl font-light">
          {date.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
        <div className="w-16 h-px bg-border mx-auto"></div>
      </div>

      {/* Prayer Sections */}
      <div className="space-y-8">
        {/* Morning */}
        {morningPrayers.length > 0 && (
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-100 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-light text-center mb-4 text-orange-800">
                Morning
              </h3>
              <div className="space-y-2">
                {morningPrayers.map(prayer => (
                  <PrayerItem key={prayer.id} prayer={prayer} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Afternoon */}
        {afternoonPrayers.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-light text-center mb-4 text-blue-800">
                Afternoon
              </h3>
              <div className="space-y-2">
                {afternoonPrayers.map(prayer => (
                  <PrayerItem key={prayer.id} prayer={prayer} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Evening */}
        {eveningPrayers.length > 0 && (
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-light text-center mb-4 text-purple-800">
                Evening
              </h3>
              <div className="space-y-2">
                {eveningPrayers.map(prayer => (
                  <PrayerItem key={prayer.id} prayer={prayer} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tasks (if any) */}
      {tasks.length > 0 && (
        <Card className="bg-card dark:bg-muted border border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-light text-foreground">
                Tasks
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddTask}
                className="text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  className="flex items-center justify-between py-2 px-3 rounded cursor-pointer hover:bg-muted/50 transition-all"
                  onClick={() => onEventClick?.(task)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📋</span>
                    <div className={`font-medium ${task.completed ? 'line-through opacity-60' : ''}`}>
                      {task.title}
                    </div>
                  </div>
                  {task.completed && <CheckCircle className="h-4 w-4 text-primary" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spiritual Quote */}
      <Card className="bg-card dark:bg-muted border border-border shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="text-2xl mb-4">☪️</div>
          <div className="text-lg font-light text-foreground mb-2 leading-relaxed">
            "And whoever relies upon Allah - then He is sufficient for him"
          </div>
          <div className="text-sm text-primary font-medium">
            Quran 65:3
          </div>
        </CardContent>
      </Card>

      {/* Peaceful Elements */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Peace</span>
            <span>☪️</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Gratitude</span>
            <span>🤲</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Mindfulness</span>
            <span>🕊️</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ZenView