import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePrayerTimes } from '@/hooks/usePrayerTimes'
import { useTasks } from '@/hooks/useTasks'
import { useToast } from '@/hooks/use-toast'
import { format, addDays } from 'date-fns'

// For demo purposes, we'll simulate the Google Calendar integration
const GOOGLE_CLIENT_ID = 'demo-client-id'
const GOOGLE_API_KEY = 'demo-api-key'
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
const SCOPES = 'https://www.googleapis.com/auth/calendar'

declare global {
  interface Window {
    gapi: any
    google: any
  }
}

export function useGoogleCalendar() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [calendarId, setCalendarId] = useState<string | null>(null)
  
  const { user } = useAuth()
  const { prayerTimes } = usePrayerTimes()
  const { tasks } = useTasks()
  const { toast } = useToast()

  // Simplified initialization for demo
  useEffect(() => {
    if (user) {
      // Simulate loading delay
      setTimeout(() => {
        setIsInitialized(true)
      }, 1000)
    }
  }, [user])

  const signIn = async () => {
    if (!isInitialized) return

    try {
      setIsLoading(true)
      // Simulate sign-in process
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsAuthorized(true)
      setCalendarId('demo-calendar-id-12345')
      
      toast({
        title: "Connected to Google Calendar",
        description: "Demo mode: Your prayer times and tasks can now sync with Google Calendar.",
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to Google Calendar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsAuthorized(false)
      setCalendarId(null)
      
      toast({
        title: "Disconnected",
        description: "Google Calendar has been disconnected.",
      })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const syncPrayerTimes = async (days: number = 30) => {
    if (!isAuthorized || !calendarId || !prayerTimes) return

    try {
      setIsLoading(true)
      
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const eventCount = prayerTimes.prayers.length * days
      
      toast({
        title: "Prayer Times Synced",
        description: `${eventCount} prayer times added to your Google Calendar (Demo).`,
      })
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Could not sync prayer times. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const syncTasks = async () => {
    if (!isAuthorized || !calendarId) return

    try {
      setIsLoading(true)
      
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const tasksWithDates = tasks.filter(task => task.due_date)
      
      toast({
        title: "Tasks Synced",
        description: `${tasksWithDates.length} tasks added to your Google Calendar (Demo).`,
      })
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Could not sync tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const syncAll = async () => {
    if (!isAuthorized) return

    try {
      setIsLoading(true)
      await syncPrayerTimes()
      await syncTasks()
      
      toast({
        title: "Full Sync Complete",
        description: "All prayer times and tasks have been synced to Google Calendar (Demo).",
      })
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Could not complete full sync. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isInitialized,
    isAuthorized,
    isLoading,
    signIn,
    signOut,
    syncPrayerTimes,
    syncTasks,
    syncAll,
    calendarId
  }
}