import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import { calculatePrayerTimes, DailyPrayerTimes, PrayerSettings } from '@/lib/prayerTimes'
import { toast } from '@/hooks/use-toast'

interface PrayerCompletion {
  prayer_name: string
  prayer_date: string
  completed_at: string
}

export function usePrayerTimes() {
  const { user } = useAuth()
  const { schedulePrayerNotifications } = useNotifications()
  const [prayerTimes, setPrayerTimes] = useState<DailyPrayerTimes | null>(null)
  const [completions, setCompletions] = useState<PrayerCompletion[]>([])
  const [settings, setSettings] = useState<PrayerSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null)

  // Load user's prayer settings
  useEffect(() => {
    async function loadSettings() {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('prayer_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (error) {
          console.error('Error loading prayer settings:', error)
          return
        }

        setSettings(data)
        
        // Force recalculation when settings change
        if (location && data) {
          const today = new Date()
          const times = calculatePrayerTimes(
            location.latitude,
            location.longitude,
            today,
            data
          )
          setPrayerTimes(times)
        }
      } catch (error) {
        console.error('Error loading prayer settings:', error)
      }
    }

    loadSettings()
  }, [user])

  // Load user's location from profile
  useEffect(() => {
    async function loadLocation() {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('location_latitude, location_longitude')
          .eq('user_id', user.id)
          .maybeSingle()

        if (error) {
          console.error('Error loading location:', error)
          return
        }

        if (data && data.location_latitude && data.location_longitude) {
          setLocation({
            latitude: data.location_latitude,
            longitude: data.location_longitude
          })
        } else {
          // Try to get current location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords
                setLocation({ latitude, longitude })
                
                // Save location to profile
                supabase
                  .from('profiles')
                  .update({
                    location_latitude: latitude,
                    location_longitude: longitude
                  })
                  .eq('user_id', user.id)
                  .then()
              },
              (error) => {
                console.error('Error getting location:', error)
                toast({
                  variant: "destructive",
                  title: "Location access denied",
                  description: "Please enable location access for accurate prayer times"
                })
              }
            )
          }
        }
      } catch (error) {
        console.error('Error loading location:', error)
      }
    }

    loadLocation()
  }, [user])

  // Calculate prayer times when location and settings are available
  useEffect(() => {
    if (location && settings) {
      try {
        const today = new Date()
        const times = calculatePrayerTimes(
          location.latitude,
          location.longitude,
          today,
          settings
        )
        setPrayerTimes(times)
        
        // Schedule notifications for today's prayers
        schedulePrayerNotifications(times.prayers)
      } catch (error) {
        console.error('Error calculating prayer times:', error)
        toast({
          variant: "destructive", 
          title: "Error calculating prayer times",
          description: "Please check your location and settings"
        })
      }
    }
    setLoading(false)
  }, [location, settings, schedulePrayerNotifications])

  // Load today's prayer completions
  useEffect(() => {
    async function loadCompletions() {
      if (!user) return

      try {
        const today = new Date().toISOString().split('T')[0]
        
        const { data, error } = await supabase
          .from('prayer_completions')
          .select('*')
          .eq('user_id', user.id)
          .eq('prayer_date', today)

        if (error) {
          console.error('Error loading completions:', error)
          return
        }

        setCompletions(data || [])
      } catch (error) {
        console.error('Error loading completions:', error)
      }
    }

    loadCompletions()
  }, [user])

  const markPrayerComplete = async (prayerName: string) => {
    if (!user) return

    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { error } = await supabase
        .from('prayer_completions')
        .insert({
          user_id: user.id,
          prayer_name: prayerName,
          prayer_date: today
        })

      if (error) {
        console.error('Error marking prayer complete:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to mark prayer as complete"
        })
        return
      }

      // Update local state
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

  const unmarkPrayerComplete = async (prayerName: string) => {
    if (!user) return

    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { error } = await supabase
        .from('prayer_completions')
        .delete()
        .eq('user_id', user.id)
        .eq('prayer_name', prayerName)
        .eq('prayer_date', today)

      if (error) {
        console.error('Error unmarking prayer:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to unmark prayer"
        })
        return
      }

      // Update local state
      setCompletions(prev => prev.filter(c => c.prayer_name !== prayerName))

      toast({
        title: "Prayer unmarked",
        description: `${prayerName.charAt(0).toUpperCase() + prayerName.slice(1)} prayer unmarked`
      })
    } catch (error) {
      console.error('Error unmarking prayer:', error)
    }
  }

  const isPrayerComplete = (prayerName: string): boolean => {
    return completions.some(c => c.prayer_name === prayerName)
  }

  return {
    prayerTimes,
    completions,
    settings,
    loading,
    location,
    markPrayerComplete,
    unmarkPrayerComplete,
    isPrayerComplete
  }
}