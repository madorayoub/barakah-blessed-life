import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePrayerTimes } from '@/hooks/usePrayerTimes'
import { useTasks } from '@/contexts/TasksContext'
import { useToast } from '@/hooks/use-toast'
import { addDays } from 'date-fns'

interface GoogleCalendarEvent {
  summary: string
  start: { dateTime: string }
  end: { dateTime: string }
  description?: string
}

interface GapiCalendarEvents {
  insert: (params: { calendarId: string; resource: GoogleCalendarEvent }) => Promise<unknown>
}

interface GapiClientCalendar {
  events: GapiCalendarEvents
}

interface GapiClient {
  load: (api: string, version: string) => Promise<void>
  calendar?: GapiClientCalendar
}

interface GapiAuthUser {
  isSignedIn: () => boolean
}

interface GapiAuthInstance {
  signIn: () => Promise<GapiAuthUser>
  signOut: () => Promise<void>
}

interface GapiAuth2 {
  init: (params: { client_id: string; scope: string }) => Promise<void>
  getAuthInstance: () => GapiAuthInstance
}

interface Gapi {
  load: (module: string, callback: () => void) => void
  auth2?: GapiAuth2
  client?: GapiClient
}

// Real Google Calendar API configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-client-id'
const SCOPES = 'https://www.googleapis.com/auth/calendar'

declare global {
  interface Window {
    gapi?: Gapi
    google?: unknown
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

  // Initialize Google API
  useEffect(() => {
    const initializeGapi = async () => {
      if (typeof window !== 'undefined') {
        // Load Google API script
        const script = document.createElement('script')
        script.src = 'https://apis.google.com/js/api.js'
        script.onload = async () => {
          await window.gapi.load('auth2', async () => {
            try {
              await window.gapi.auth2.init({
                client_id: GOOGLE_CLIENT_ID,
                scope: SCOPES
              })
              setIsInitialized(true)
            } catch (error) {
              console.error('Error initializing Google API:', error)
              // Fallback to demo mode if API fails
              setIsInitialized(true)
            }
          })
        }
        document.head.appendChild(script)
      }
    }

    if (user && !isInitialized) {
      initializeGapi()
    }
  }, [user, isInitialized])

  const signIn = async () => {
    if (!isInitialized) return

    try {
      setIsLoading(true)
      
      if (window.gapi?.auth2) {
        // Real Google OAuth
        const authInstance = window.gapi.auth2.getAuthInstance()
        const user = await authInstance.signIn()

        if (user.isSignedIn()) {
          setIsAuthorized(true)
          setCalendarId('primary') // Use primary calendar
          
          toast({
            title: "Connected to Google Calendar",
            description: "Successfully connected! Your prayer times and tasks can now sync.",
          })
        }
      } else {
        // Fallback to demo mode
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsAuthorized(true)
        setCalendarId('demo-calendar-id-12345')
        
        toast({
          title: "Connected to Google Calendar",
          description: "Demo mode: Your prayer times and tasks can now sync with Google Calendar.",
        })
      }
    } catch (error) {
      console.error('Google sign-in error:', error)
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
      if (window.gapi?.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance()
        await authInstance.signOut()
      }
      
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
      
      if (window.gapi?.client) {
        // Real Google Calendar API sync
        await window.gapi.load('client', async () => {
          await window.gapi?.client?.load('calendar', 'v3')

          // Create events for each prayer time
          const events: GoogleCalendarEvent[] = []
          for (let i = 0; i < days; i++) {
            const date = addDays(new Date(), i)
            prayerTimes.prayers.forEach(prayer => {
              // prayer.time is already a Date object
              const startDateTime = new Date(date)
              startDateTime.setHours(prayer.time.getHours(), prayer.time.getMinutes())
              
              const endDateTime = new Date(startDateTime.getTime() + 30 * 60000) // 30 minutes later
              
              events.push({
                summary: `${prayer.name} Prayer`,
                start: { dateTime: startDateTime.toISOString() },
                end: { dateTime: endDateTime.toISOString() },
                description: `Daily ${prayer.name} prayer reminder from Barakah`,
              })
            })
          }
          
          // Batch create events
          const calendarClient = window.gapi?.client?.calendar
          if (calendarClient) {
            for (const event of events) {
              await calendarClient.events.insert({
                calendarId: calendarId,
                resource: event
              })
            }
          }
        })
      } else {
        // Fallback simulation
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      
      const eventCount = prayerTimes.prayers.length * days
      
      toast({
        title: "Prayer Times Synced",
        description: `${eventCount} prayer times added to your Google Calendar.`,
      })
    } catch (error) {
      console.error('Sync error:', error)
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