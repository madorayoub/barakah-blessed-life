import { CheckCircle, Clock, Star, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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

interface CardsViewProps {
  date: Date
  events: CalendarEvent[]
  onPrayerComplete?: (prayerName: string) => void
}

const CardsView = ({ date, events }: CardsViewProps) => {
  const prayers = events.filter(e => e.type === 'prayer')
  const tasks = events.filter(e => e.type === 'task')

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

  const getPrayerQuote = (prayerName: string) => {
    const quotes: { [key: string]: string } = {
      'Fajr': 'Start your day with gratitude',
      'Dhuhr': 'Pause and reflect mid-day',
      'Asr': 'Afternoon blessings await',
      'Maghrib': 'Thank Allah for the day',
      'Isha': 'End with peaceful prayers'
    }
    return quotes[prayerName] || 'Allah is always with you'
  }

  const completedCount = prayers.filter(p => p.completed).length + tasks.filter(t => t.completed).length
  const totalCount = prayers.length + tasks.length

  return (
    <div className="cards-view space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h2>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            Cards View
          </Badge>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
            {completedCount}/{totalCount} Complete
          </Badge>
        </div>
      </div>

      {/* Prayer Cards Grid */}
      {prayers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🕌 Prayer Times
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prayers.map(prayer => (
              <Card 
                key={prayer.id}
                className={`
                  relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer
                  ${prayer.isNext 
                    ? 'ring-2 ring-amber-400 bg-gradient-to-br from-amber-50 to-orange-50' 
                    : prayer.completed 
                      ? 'bg-gradient-to-br from-emerald-50 to-green-50 opacity-90' 
                      : 'bg-gradient-to-br from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100'
                  }
                `}
              >
                <CardContent className="p-6 text-center">
                  {/* Prayer Icon */}
                  <div className="text-4xl mb-3">
                    {getPrayerIcon(prayer.title)}
                  </div>
                  
                  {/* Prayer Name */}
                  <div className="font-bold text-lg mb-2">
                    {prayer.title} Prayer
                  </div>
                  
                  {/* Prayer Time */}
                  {prayer.time && (
                    <div className="text-sm text-muted-foreground mb-3">
                      {formatPrayerTime(prayer.time)}
                    </div>
                  )}
                  
                  {/* Inspirational Quote */}
                  <div className="text-xs text-muted-foreground italic mb-4 min-h-[32px] flex items-center justify-center">
                    "{getPrayerQuote(prayer.title)}"
                  </div>
                  
                  {/* Status Indicators */}
                  <div className="flex justify-center">
                    {prayer.completed ? (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    ) : prayer.isNext ? (
                      <div className="flex items-center gap-1 text-amber-600">
                        <Star className="h-5 w-5" />
                        <span className="text-sm font-medium">→ NEXT</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Upcoming</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                {/* Decorative Corner */}
                {prayer.isNext && (
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-amber-400">
                    <Star className="absolute -top-8 -right-8 h-4 w-4 text-white" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Task Cards */}
      {tasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            📋 Tasks
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map(task => (
              <Card 
                key={task.id}
                className={`
                  relative transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer
                  ${task.completed 
                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 opacity-90' 
                    : 'bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100'
                  }
                `}
              >
                <CardContent className="p-6 text-center">
                  {/* Task Icon */}
                  <div className="text-3xl mb-3">
                    📋
                  </div>
                  
                  {/* Task Title */}
                  <div className="font-bold text-lg mb-2">
                    {task.title}
                  </div>
                  
                  {/* Task Time */}
                  {task.time && (
                    <div className="text-sm text-muted-foreground mb-3">
                      Due: {formatPrayerTime(task.time)}
                    </div>
                  )}
                  
                  {/* Motivational Message */}
                  <div className="text-xs text-muted-foreground italic mb-4 min-h-[32px] flex items-center justify-center">
                    "Every task completed is a step closer to excellence"
                  </div>
                  
                  {/* Status */}
                  <div className="flex justify-center">
                    {task.completed ? (
                      <div className="flex items-center gap-1 text-blue-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Pending</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Daily Intention Card */}
      <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
        <CardContent className="p-6 text-center">
          <div className="text-2xl mb-3">🎯</div>
          <div className="font-bold text-lg text-purple-800 mb-2">
            Daily Intention
          </div>
          <div className="text-purple-700 italic">
            "Seek Allah's guidance in all that you do"
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <Heart className="h-4 w-4 text-pink-500" />
            <span className="text-sm text-purple-600">Set with love and purpose</span>
            <Heart className="h-4 w-4 text-pink-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CardsView