import { useState, useEffect } from 'react'
import { Clock, MapPin, CheckCircle, Circle, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import { getLocalDateString } from '@/utils/date'

interface PrayerTime {
  name: string
  displayName: string
  time: string
  timestamp: number
}

interface AlAdhanResponse {
  code: number
  status: string
  data: {
    timings: {
      Fajr: string
      Sunrise: string
      Dhuhr: string
      Asr: string
      Maghrib: string
      Isha: string
    }
    date: {
      readable: string
      gregorian: {
        date: string
      }
    }
    meta: {
      latitude: number
      longitude: number
      timezone: string
    }
  }
}

interface PrayerCompletion {
  prayer_name: string
  prayer_date: string
  completed_at: string
}

export function PrayerTimesFixed() {
  const { user } = useAuth()
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([])
  const [completions, setCompletions] = useState<PrayerCompletion[]>([])
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Get user location
  useEffect(() => {
    async function getLocation() {
      if (!user) return

      try {
        // Try to get saved location first
        const { data, error } = await supabase
          .from('profiles')
          .select('location_latitude, location_longitude')
          .eq('user_id', user.id)
          .maybeSingle()

        if (data?.location_latitude && data?.location_longitude) {
          setLocation({
            latitude: data.location_latitude,
            longitude: data.location_longitude
          })
        } else {
          // Request current location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude, longitude } = position.coords
                setLocation({ latitude, longitude })
                
                // Save location
                await supabase
                  .from('profiles')
                  .update({
                    location_latitude: latitude,
                    location_longitude: longitude
                  })
                  .eq('user_id', user.id)
              },
              (error) => {
                console.error('Location error:', error)
                // Default to Mecca coordinates for demo
                setLocation({ latitude: 21.4225, longitude: 39.8262 })
              }
            )
          } else {
            // Default to Mecca coordinates
            setLocation({ latitude: 21.4225, longitude: 39.8262 })
          }
        }
      } catch (error) {
        console.error('Error getting location:', error)
        // Default to Mecca coordinates
        setLocation({ latitude: 21.4225, longitude: 39.8262 })
      }
    }

    getLocation()
  }, [user])

  // Fetch prayer times from Al-Adhan API
  useEffect(() => {
    async function fetchPrayerTimes() {
      if (!location) return

      setLoading(true)
      try {
        const today = new Date()
        const dateString = getLocalDateString(today)
        
        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${dateString}?latitude=${location.latitude}&longitude=${location.longitude}&method=4`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch prayer times')
        }
        
        const data: AlAdhanResponse = await response.json()
        
        if (data.code === 200) {
          const timings = data.data.timings
          const prayers: PrayerTime[] = [
            { name: 'fajr', displayName: 'Fajr', time: timings.Fajr, timestamp: parseTime(timings.Fajr) },
            { name: 'dhuhr', displayName: 'Dhuhr', time: timings.Dhuhr, timestamp: parseTime(timings.Dhuhr) },
            { name: 'asr', displayName: 'Asr', time: timings.Asr, timestamp: parseTime(timings.Asr) },
            { name: 'maghrib', displayName: 'Maghrib', time: timings.Maghrib, timestamp: parseTime(timings.Maghrib) },
            { name: 'isha', displayName: 'Isha', time: timings.Isha, timestamp: parseTime(timings.Isha) }
          ]
          
          setPrayerTimes(prayers)
        } else {
          throw new Error('Invalid API response')
        }
      } catch (error) {
        console.error('Error fetching prayer times:', error)
        toast({
          variant: "destructive",
          title: "Error loading prayer times",
          description: "Please check your internet connection"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPrayerTimes()
  }, [location])

  // Load prayer completions
  useEffect(() => {
    async function loadCompletions() {
      if (!user) return

      try {
        const today = getLocalDateString(new Date())
        const { data, error } = await supabase
          .from('prayer_completions')
          .select('*')
          .eq('user_id', user.id)
          .eq('prayer_date', today)

        if (error) throw error
        setCompletions(data || [])
      } catch (error) {
        console.error('Error loading completions:', error)
      }
    }

    loadCompletions()
  }, [user])

  // Helper function to parse time string to timestamp
  const parseTime = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    const today = new Date()
    today.setHours(hours, minutes, 0, 0)
    return today.getTime()
  }

  // Get next prayer
  const getNextPrayer = (): PrayerTime | null => {
    const now = currentTime.getTime()
    return prayerTimes.find(prayer => prayer.timestamp > now) || null
  }

  // Check if prayer is completed
  const isPrayerComplete = (prayerName: string): boolean => {
    return completions.some(c => c.prayer_name === prayerName)
  }

  // Mark prayer as complete
  const markPrayerComplete = async (prayerName: string) => {
    if (!user) return

    try {
      const today = getLocalDateString(new Date())
      
      const { error } = await supabase
        .from('prayer_completions')
        .insert({
          user_id: user.id,
          prayer_name: prayerName,
          prayer_date: today
        })

      if (error) throw error

      setCompletions(prev => [...prev, {
        prayer_name: prayerName,
        prayer_date: today,
        completed_at: new Date().toISOString()
      }])

      toast({
        title: "Prayer completed",
        description: `${prayerName.charAt(0).toUpperCase() + prayerName.slice(1)} prayer marked as complete`
      })
    } catch (error) {
      console.error('Error marking prayer complete:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark prayer as complete"
      })
    }
  }

  // Unmark prayer
  const unmarkPrayerComplete = async (prayerName: string) => {
    if (!user) return

    try {
      const today = getLocalDateString(new Date())
      
      const { error } = await supabase
        .from('prayer_completions')
        .delete()
        .eq('user_id', user.id)
        .eq('prayer_name', prayerName)
        .eq('prayer_date', today)

      if (error) throw error

      setCompletions(prev => prev.filter(c => c.prayer_name !== prayerName))

      toast({
        title: "Prayer unmarked",
        description: `${prayerName.charAt(0).toUpperCase() + prayerName.slice(1)} prayer unmarked`
      })
    } catch (error) {
      console.error('Error unmarking prayer:', error)
    }
  }

  // Format time for display
  const formatTime = (timeStr: string): string => {
    return timeStr
  }

  // Get time until prayer
  const getTimeUntil = (timestamp: number): string => {
    const diff = timestamp - currentTime.getTime()
    if (diff <= 0) return 'Now'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const nextPrayer = getNextPrayer()
  const completedCount = completions.length
  const totalPrayers = 5

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Prayer Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex justify-between animate-pulse">
                <div className="h-4 w-16 bg-muted rounded"></div>
                <div className="h-4 w-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Next Prayer Card */}
      {nextPrayer && (
        <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-emerald-900">Next Prayer</h3>
              <div className="text-2xl font-bold text-emerald-700">{nextPrayer.displayName}</div>
              <div className="text-emerald-600">{formatTime(nextPrayer.time)}</div>
              <Badge variant="outline" className="mt-2 bg-emerald-100 text-emerald-800 border-emerald-300">
                in {getTimeUntil(nextPrayer.timestamp)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Prayers Completed</span>
              <span>{completedCount}/{totalPrayers}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{width: `${(completedCount / totalPrayers) * 100}%`}}
              />
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {completedCount === totalPrayers
                ? "🎉 All prayers completed today! Masha'Allah!"
                : `${totalPrayers - completedCount} prayers remaining`
              }
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prayer Times List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Prayer Times
            {location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                <MapPin className="h-3 w-3" />
                {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {prayerTimes.map((prayer) => {
              const isCompleted = isPrayerComplete(prayer.name)
              const isNext = nextPrayer?.name === prayer.name
              
              return (
                <div 
                  key={prayer.name}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    isNext
                      ? 'bg-primary/10 border-primary/40'
                      : isCompleted
                      ? 'bg-primary/5 border-primary/30'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => isCompleted ? unmarkPrayerComplete(prayer.name) : markPrayerComplete(prayer.name)}
                      className="p-1 h-8 w-8"
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>

                    <div>
                      <div className={`font-medium ${
                        isNext ? 'text-primary' :
                        isCompleted ? 'text-primary' :
                        'text-foreground'
                      }`}>
                        {prayer.displayName}
                      </div>
                      {isNext && (
                        <div className="text-xs text-primary">
                          {getTimeUntil(prayer.timestamp)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-medium ${
                      isNext ? 'text-primary' :
                      isCompleted ? 'text-primary' :
                      'text-foreground'
                    }`}>
                      {formatTime(prayer.time)}
                    </div>
                    {isNext && (
                      <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                        Next
                      </Badge>
                    )}
                    {isCompleted && (
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300">
                        ✓ Done
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}