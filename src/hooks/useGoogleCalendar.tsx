import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePrayerTimes } from '@/hooks/usePrayerTimes'
import { useTasks } from '@/hooks/useTasks'
import { useToast } from '@/hooks/use-toast'
import { format, addDays } from 'date-fns'

// Google Calendar API configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id'
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || 'your-google-api-key'
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

  // Initialize Google API
  useEffect(() => {
    const initializeGapi = async () => {
      try {
        if (typeof window.gapi === 'undefined') {
          // Load the Google API script
          const script = document.createElement('script')
          script.src = 'https://apis.google.com/js/api.js'
          script.onload = () => initGapi()
          document.body.appendChild(script)
        } else {
          initGapi()
        }
      } catch (error) {
        console.error('Error initializing Google API:', error)
      }
    }

    const initGapi = async () => {
      await window.gapi.load('client:auth2', async () => {
        await window.gapi.client.init({
          apiKey: GOOGLE_API_KEY,
          clientId: GOOGLE_CLIENT_ID,
          discoveryDocs: [DISCOVERY_DOC],
          scope: SCOPES
        })
        
        setIsInitialized(true)
        
        // Check if user is already signed in
        const authInstance = window.gapi.auth2.getAuthInstance()
        if (authInstance.isSignedIn.get()) {
          setIsAuthorized(true)
          await findOrCreateBarakahCalendar()
        }
      })
    }

    if (user) {
      initializeGapi()
    }
  }, [user])

  const signIn = async () => {
    if (!isInitialized) return

    try {
      setIsLoading(true)
      const authInstance = window.gapi.auth2.getAuthInstance()
      await authInstance.signIn()
      setIsAuthorized(true)
      
      await findOrCreateBarakahCalendar()
      
      toast({
        title: "Connected to Google Calendar",
        description: "Your prayer times and tasks can now sync with Google Calendar.",
      })
    } catch (error) {
      console.error('Error signing in to Google:', error)
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
    if (!isInitialized) return

    try {
      const authInstance = window.gapi.auth2.getAuthInstance()
      await authInstance.signOut()
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

  const findOrCreateBarakahCalendar = async () => {
    try {
      // First, try to find existing Barakah Tasks calendar
      const response = await window.gapi.client.calendar.calendarList.list()
      const calendars = response.result.items || []
      
      let barakahCalendar = calendars.find((cal: any) => 
        cal.summary === 'Barakah Tasks - Prayer Times & Tasks'
      )

      if (!barakahCalendar) {
        // Create new calendar
        const createResponse = await window.gapi.client.calendar.calendars.insert({
          resource: {
            summary: 'Barakah Tasks - Prayer Times & Tasks',
            description: 'Islamic prayer times and personal tasks from Barakah Tasks app',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }
        })
        barakahCalendar = createResponse.result
      }

      setCalendarId(barakahCalendar.id)
      return barakahCalendar.id
    } catch (error) {
      console.error('Error creating/finding calendar:', error)
      throw error
    }
  }

  const syncPrayerTimes = async (days: number = 30) => {
    if (!isAuthorized || !calendarId || !prayerTimes) return

    try {
      setIsLoading(true)
      
      // Clear existing prayer events
      await clearExistingEvents('prayer')
      
      const events = []
      const today = new Date()
      
      // Generate prayer times for specified days
      for (let i = 0; i < days; i++) {
        const date = addDays(today, i)
        
        for (const prayer of prayerTimes.prayers) {
          const startTime = new Date(prayer.time)
          startTime.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
          
          const endTime = new Date(startTime.getTime() + 30 * 60000) // 30 minutes
          
          events.push({
            summary: `${prayer.displayName} Prayer`,
            description: `Time for ${prayer.displayName} prayer\n\nGenerated by Barakah Tasks`,
            start: {
              dateTime: startTime.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
              dateTime: endTime.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            colorId: '10', // Green color for prayers
            extendedProperties: {
              private: {
                barakahType: 'prayer',
                prayerName: prayer.name
              }
            }
          })
        }
      }

      // Batch insert events
      for (const event of events) {
        await window.gapi.client.calendar.events.insert({
          calendarId: calendarId,
          resource: event
        })
      }

      toast({
        title: "Prayer Times Synced",
        description: `${events.length} prayer times added to your Google Calendar.`,
      })
    } catch (error) {
      console.error('Error syncing prayer times:', error)
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
      
      // Clear existing task events
      await clearExistingEvents('task')
      
      const events = []
      
      for (const task of tasks) {
        if (task.due_date) {
          const dueDate = new Date(task.due_date)
          
          let startTime, endTime
          if (task.due_time) {
            const [hours, minutes] = task.due_time.split(':')
            dueDate.setHours(parseInt(hours), parseInt(minutes))
            startTime = dueDate
            endTime = new Date(dueDate.getTime() + 60 * 60000) // 1 hour
          } else {
            startTime = dueDate
            endTime = new Date(dueDate.getTime() + 24 * 60 * 60000) // All day
          }

          events.push({
            summary: task.title,
            description: `${task.description || ''}\n\nFrom Barakah Tasks`,
            start: task.due_time ? {
              dateTime: startTime.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            } : {
              date: format(startTime, 'yyyy-MM-dd')
            },
            end: task.due_time ? {
              dateTime: endTime.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            } : {
              date: format(endTime, 'yyyy-MM-dd')
            },
            colorId: task.priority === 'urgent' ? '11' : task.priority === 'high' ? '9' : '7',
            extendedProperties: {
              private: {
                barakahType: 'task',
                taskId: task.id,
                priority: task.priority
              }
            }
          })
        }
      }

      // Batch insert events
      for (const event of events) {
        await window.gapi.client.calendar.events.insert({
          calendarId: calendarId,
          resource: event
        })
      }

      toast({
        title: "Tasks Synced",
        description: `${events.length} tasks added to your Google Calendar.`,
      })
    } catch (error) {
      console.error('Error syncing tasks:', error)
      toast({
        title: "Sync Failed",
        description: "Could not sync tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearExistingEvents = async (type: 'prayer' | 'task') => {
    if (!calendarId) return

    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: calendarId,
        privateExtendedProperty: `barakahType=${type}`,
        maxResults: 2500
      })

      const events = response.result.items || []
      
      for (const event of events) {
        await window.gapi.client.calendar.events.delete({
          calendarId: calendarId,
          eventId: event.id
        })
      }
    } catch (error) {
      console.error(`Error clearing existing ${type} events:`, error)
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
        description: "All prayer times and tasks have been synced to Google Calendar.",
      })
    } catch (error) {
      console.error('Error during full sync:', error)
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