import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePrayerTimes } from '@/hooks/usePrayerTimes'
import { useTasks } from '@/contexts/TasksContext'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { getLocalDateString } from '@/utils/date'

// CalDAV endpoints for major providers
const CALDAV_PROVIDERS = {
  icloud: {
    name: 'iCloud Calendar',
    serverUrl: 'https://caldav.icloud.com',
    principalUrl: '/{{username}}/principal/',
    calendarHomeSet: '/{{username}}/calendars/',
    icon: '🍎'
  },
  google: {
    name: 'Google Calendar (CalDAV)',
    serverUrl: 'https://apidata.googleusercontent.com/caldav/v2',
    principalUrl: '/{{username}}/user/',
    calendarHomeSet: '/{{username}}/events/',
    icon: '🌟'
  },
  outlook: {
    name: 'Outlook Calendar',
    serverUrl: 'https://outlook.office365.com',
    principalUrl: '/ews/calendar/',
    calendarHomeSet: '/calendar/',
    icon: '📧'
  }
}

export function useCalDAV() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connections, setConnections] = useState<Record<string, any>>({})
  const [isDiscovering, setIsDiscovering] = useState(false)
  
  const { user } = useAuth()
  const { prayerTimes } = usePrayerTimes()
  const { tasks } = useTasks()
  const { toast } = useToast()

  // Load existing connections from localStorage
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`caldav-connections-${user.id}`)
      if (stored) {
        setConnections(JSON.parse(stored))
      }
    }
  }, [user])

  const discoverCalDAVEndpoint = async (serverUrl: string, username: string, password: string) => {
    try {
      setIsDiscovering(true)
      
      // Discover principal URL using PROPFIND
      const principalResponse = await makeCalDAVRequest({
        method: 'PROPFIND',
        url: serverUrl,
        credentials: { username, password },
        headers: { 'Depth': '0' },
        body: `<?xml version="1.0" encoding="utf-8" ?>
<D:propfind xmlns:D="DAV:">
  <D:prop>
    <D:current-user-principal />
  </D:prop>
</D:propfind>`
      })

      if (!principalResponse.ok) {
        throw new Error('Failed to discover CalDAV principal')
      }

      // Parse principal URL from response
      const principalUrl = parsePrincipalUrl(principalResponse.body)
      
      // Discover calendar home set
      const calendarHomeResponse = await makeCalDAVRequest({
        method: 'PROPFIND',
        url: `${serverUrl}${principalUrl}`,
        credentials: { username, password },
        headers: { 'Depth': '0' },
        body: `<?xml version="1.0" encoding="utf-8" ?>
<D:propfind xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
  <D:prop>
    <C:calendar-home-set />
  </D:prop>
</D:propfind>`
      })

      const calendarHomeSet = parseCalendarHomeSet(calendarHomeResponse.body)
      
      return {
        principalUrl,
        calendarHomeSet,
        supportedFeatures: ['calendar-access', 'calendar-schedule'],
        calendars: []
      }
    } catch (error) {
      throw new Error(`CalDAV discovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDiscovering(false)
    }
  }

  const makeCalDAVRequest = async (request: {
    method: string
    url: string
    credentials: { username: string; password: string }
    headers?: Record<string, string>
    body?: string
  }) => {
    const { data, error } = await supabase.functions.invoke('caldav-proxy', {
      body: request
    })

    if (error) {
      throw new Error(`CalDAV request failed: ${error.message}`)
    }

    return data
  }

  const parsePrincipalUrl = (xmlResponse: string): string => {
    // Simple XML parsing for principal URL
    const match = xmlResponse.match(/<D:href[^>]*>([^<]+)<\/D:href>/)
    return match ? match[1] : '/principal/'
  }

  const parseCalendarHomeSet = (xmlResponse: string): string => {
    // Simple XML parsing for calendar home set
    const match = xmlResponse.match(/<D:href[^>]*>([^<]+)<\/D:href>/)
    return match ? match[1] : '/calendars/'
  }

  const testCalDAVConnection = async (config: {
    provider: string
    serverUrl: string
    username: string
    password: string
  }) => {
    try {
      setIsConnecting(true)
      
      // Test connection with a simple PROPFIND request
      const testResponse = await makeCalDAVRequest({
        method: 'PROPFIND',
        url: config.serverUrl,
        credentials: { username: config.username, password: config.password },
        headers: { 'Depth': '0' },
        body: `<?xml version="1.0" encoding="utf-8" ?>
<D:propfind xmlns:D="DAV:">
  <D:prop>
    <D:current-user-principal />
  </D:prop>
</D:propfind>`
      })

      if (!testResponse.ok) {
        throw new Error(`Authentication failed: ${testResponse.statusText}`)
      }
      
      const discovery = await discoverCalDAVEndpoint(config.serverUrl, config.username, config.password)
      
      return {
        success: true,
        serverInfo: {
          ...discovery,
          provider: config.provider,
          displayName: CALDAV_PROVIDERS[config.provider as keyof typeof CALDAV_PROVIDERS]?.name
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const connectCalDAV = async (config: {
    provider: string
    username: string
    password: string
    calendarName?: string
  }) => {
    try {
      setIsConnecting(true)
      
      const provider = CALDAV_PROVIDERS[config.provider as keyof typeof CALDAV_PROVIDERS]
      if (!provider) {
        throw new Error('Unsupported CalDAV provider')
      }

      // Test connection first
      const testResult = await testCalDAVConnection({
        ...config,
        serverUrl: provider.serverUrl
      })

      if (!testResult.success) {
        throw new Error(testResult.error || 'Connection test failed')
      }

      // Create or find Barakah Tasks calendar
      const calendarUrl = await createBarakahTasksCalendar(config)
      
      // Store connection info (in real app, encrypt the password)
      const connectionInfo = {
        id: `${config.provider}-${Date.now()}`,
        provider: config.provider,
        username: config.username,
        serverUrl: provider.serverUrl,
        calendarUrl,
        calendarName: config.calendarName || 'Barakah Tasks',
        connected: true,
        lastSync: new Date().toISOString(),
        serverInfo: testResult.serverInfo
      }

      const newConnections = {
        ...connections,
        [config.provider]: connectionInfo
      }
      
      setConnections(newConnections)
      
      if (user) {
        localStorage.setItem(`caldav-connections-${user.id}`, JSON.stringify(newConnections))
      }

      toast({
        title: "CalDAV Connected",
        description: `Successfully connected to ${provider.name}`,
      })

      return { success: true, connectionInfo }
    } catch (error) {
      toast({
        title: "CalDAV Connection Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      })
      return { success: false, error }
    } finally {
      setIsConnecting(false)
    }
  }

  const createBarakahTasksCalendar = async (config: any) => {
    const provider = CALDAV_PROVIDERS[config.provider as keyof typeof CALDAV_PROVIDERS]
    const calendarUrl = `${provider.serverUrl}${provider.calendarHomeSet.replace('{{username}}', config.username)}barakah-tasks-${Date.now()}/`
    
    // Create calendar using MKCALENDAR
    const createResponse = await makeCalDAVRequest({
      method: 'MKCALENDAR',
      url: calendarUrl,
      credentials: { username: config.username, password: config.password },
      body: `<?xml version="1.0" encoding="utf-8" ?>
<C:mkcalendar xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
  <D:set>
    <D:prop>
      <D:displayname>${config.calendarName || 'Barakah Tasks'}</D:displayname>
      <C:calendar-description>Prayer times and Islamic tasks from Barakah Tasks app</C:calendar-description>
      <C:supported-calendar-component-set>
        <C:comp name="VEVENT"/>
        <C:comp name="VTODO"/>
      </C:supported-calendar-component-set>
    </D:prop>
  </D:set>
</C:mkcalendar>`
    })

    if (!createResponse.ok && createResponse.status !== 201) {
      throw new Error(`Failed to create calendar: ${createResponse.statusText}`)
    }
    
    return calendarUrl
  }

  const syncEventsToCalDAV = async (providerId: string) => {
    const connection = connections[providerId]
    if (!connection?.connected) {
      throw new Error('CalDAV not connected')
    }

    try {
      setIsConnecting(true)
      
      // Prepare events for sync
      const events = []
      
      // Add prayer times as recurring events
      if (prayerTimes) {
        for (const prayer of prayerTimes.prayers) {
          const startTime = new Date(prayer.time)
          const endTime = new Date(startTime.getTime() + 30 * 60000)
          
          const icalEvent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Barakah Tasks//EN
BEGIN:VEVENT
UID:prayer-${prayer.name}-${getLocalDateString(new Date())}@barakah-tasks.app
DTSTART:${formatICalDate(startTime)}
DTEND:${formatICalDate(endTime)}
RRULE:FREQ=DAILY
SUMMARY:${prayer.displayName} Prayer
DESCRIPTION:Time for ${prayer.displayName} prayer - Barakah Tasks
CATEGORIES:Prayer,Barakah Tasks
END:VEVENT
END:VCALENDAR`

          events.push({
            uid: `prayer-${prayer.name}-${getLocalDateString(new Date())}`,
            icalData: icalEvent
          })
        }
      }

      // Add tasks with due dates
      tasks.filter(task => task.due_date).forEach(task => {
        const dueDate = new Date(task.due_date + (task.due_time ? 'T' + task.due_time : 'T09:00:00'))
        
        const icalEvent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Barakah Tasks//EN
BEGIN:VEVENT
UID:task-${task.id}@barakah-tasks.app
DTSTART:${formatICalDate(dueDate)}
DTEND:${formatICalDate(new Date(dueDate.getTime() + 60 * 60000))}
SUMMARY:${task.title}
DESCRIPTION:${task.description || ''}
CATEGORIES:Task,Barakah Tasks
PRIORITY:${task.priority === 'urgent' ? '1' : task.priority === 'high' ? '2' : '3'}
END:VEVENT
END:VCALENDAR`

        events.push({
          uid: `task-${task.id}`,
          icalData: icalEvent
        })
      })

      // Sync events to CalDAV server
      for (const event of events) {
        const eventUrl = `${connection.calendarUrl}${event.uid}.ics`
        
        await makeCalDAVRequest({
          method: 'PUT',
          url: eventUrl,
          credentials: { username: connection.username, password: connection.password },
          headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
          body: event.icalData
        })
      }
      
      // Update last sync time
      const updatedConnection = {
        ...connection,
        lastSync: new Date().toISOString()
      }
      
      const newConnections = {
        ...connections,
        [providerId]: updatedConnection
      }
      
      setConnections(newConnections)
      
      if (user) {
        localStorage.setItem(`caldav-connections-${user.id}`, JSON.stringify(newConnections))
      }

      toast({
        title: "CalDAV Sync Complete",
        description: `Synced ${events.length} events to ${connection.serverInfo.displayName}`,
      })

      return { success: true, eventCount: events.length }
    } catch (error) {
      toast({
        title: "CalDAV Sync Failed",
        description: error instanceof Error ? error.message : 'Sync failed',
        variant: "destructive",
      })
      return { success: false, error }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectCalDAV = async (providerId: string) => {
    const newConnections = { ...connections }
    delete newConnections[providerId]
    
    setConnections(newConnections)
    
    if (user) {
      localStorage.setItem(`caldav-connections-${user.id}`, JSON.stringify(newConnections))
    }

    toast({
      title: "CalDAV Disconnected",
      description: "Calendar connection has been removed",
    })
  }

  const formatICalDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  return {
    connections,
    isConnecting,
    isDiscovering,
    connectCalDAV,
    syncEventsToCalDAV,
    disconnectCalDAV,
    testCalDAVConnection,
    providers: CALDAV_PROVIDERS
  }
}