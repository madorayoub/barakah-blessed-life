import { ArrowLeft, Clock, CheckCircle, Circle, Star, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useNavigate } from 'react-router-dom'
import { usePrayerTimes } from '@/hooks/usePrayerTimes'
import { formatPrayerTime, getTimeUntilPrayer } from '@/lib/prayerTimes'
import { useEffect, useState } from 'react'

const Prayers = () => {
  const navigate = useNavigate()
  const { prayerTimes, loading, markPrayerComplete, unmarkPrayerComplete, isPrayerComplete } = usePrayerTimes()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const togglePrayerCompletion = async (prayerName: string) => {
    if (isPrayerComplete(prayerName)) {
      await unmarkPrayerComplete(prayerName)
    } else {
      await markPrayerComplete(prayerName)
    }
  }

  const getCompletedPrayersCount = () => {
    if (!prayerTimes?.prayers) return 0
    return prayerTimes.prayers.filter(prayer => isPrayerComplete(prayer.name)).length
  }

  const getNextPrayer = () => {
    if (!prayerTimes?.prayers) return null
    const now = new Date()
    return prayerTimes.prayers.find(prayer => prayer.time > now)
  }

  const nextPrayer = getNextPrayer()
  const completedCount = getCompletedPrayersCount()
  const totalPrayers = prayerTimes?.prayers?.length || 5
  const completionPercentage = (completedCount / totalPrayers) * 100

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="h-4 w-px bg-border" />
              <div>
                <h1 className="text-2xl font-bold">Prayer Times</h1>
                <p className="text-muted-foreground">Your daily prayer schedule and tracking</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading prayer times...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="h-4 w-px bg-border" />
            <div>
              <h1 className="text-2xl font-bold">Prayer Times</h1>
              <p className="text-muted-foreground">Your daily prayer schedule and tracking</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          
          {/* Header Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Next Prayer Card */}
            {nextPrayer && (
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-emerald-600" />
                      <CardTitle className="text-emerald-900">Next Prayer</CardTitle>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-200 text-emerald-800">
                      Upcoming
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-emerald-900">{nextPrayer.displayName}</div>
                    <div className="text-xl text-emerald-700">{formatPrayerTime(nextPrayer.time)}</div>
                    <div className="text-sm text-emerald-600">{getTimeUntilPrayer(nextPrayer.time)}</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Daily Progress Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <CardTitle>Today's Progress</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Prayers Completed</span>
                      <span>{completedCount}/{totalPrayers}</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {completedCount === totalPrayers 
                      ? "🎉 All prayers completed today! Masha'Allah!" 
                      : `${totalPrayers - completedCount} prayers remaining`
                    }
                  </div>
                  <div className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded">
                    💡 Your progress is tracked fairly from your join date - no historical penalties!
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Time & Location */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg font-medium">
                    {currentTime.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{"Location not set"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prayer Times List */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Prayer Times</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {prayerTimes?.prayers ? (
                <div className="space-y-3">
                  {prayerTimes.prayers.map((prayer) => {
                    const isCompleted = isPrayerComplete(prayer.name)
                    const isPast = prayer.time < currentTime
                    const isNext = nextPrayer?.name === prayer.name
                    
                    return (
                      <div 
                        key={prayer.name}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                          isNext 
                            ? 'bg-emerald-50 border-emerald-200' 
                            : isCompleted
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePrayerCompletion(prayer.name)}
                            className="p-1"
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400" />
                            )}
                          </Button>
                          
                          <div>
                            <div className={`font-medium ${
                              isNext ? 'text-emerald-900' : 
                              isCompleted ? 'text-green-700' : 
                              'text-foreground'
                            }`}>
                              {prayer.displayName}
                            </div>
                            <div className={`text-sm ${
                              isNext ? 'text-emerald-600' : 'text-muted-foreground'
                            }`}>
                              {isNext && getTimeUntilPrayer(prayer.time)}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`font-medium ${
                            isNext ? 'text-emerald-900' : 
                            isCompleted ? 'text-green-700' : 
                            'text-foreground'
                          }`}>
                            {formatPrayerTime(prayer.time)}
                          </div>
                          {isNext && (
                            <Badge variant="secondary" className="text-xs bg-emerald-200 text-emerald-800">
                              Next
                            </Badge>
                          )}
                          {isCompleted && (
                            <Badge variant="secondary" className="text-xs bg-green-200 text-green-800">
                              ✓ Done
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Prayer times unavailable</h3>
                  <p className="text-muted-foreground mb-4">
                    Please set your location in settings to calculate accurate prayer times.
                  </p>
                  <Button onClick={() => navigate('/settings')}>
                    Go to Settings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Prayers