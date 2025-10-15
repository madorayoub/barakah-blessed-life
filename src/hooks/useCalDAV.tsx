import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePrayerTimes } from '@/hooks/usePrayerTimes'
import { useTasks } from '@/contexts/TasksContext'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { getLocalDateString } from '@/utils/date'
import { calculatePrayerTimes, PrayerSettings } from '@/lib/prayerTimes'

type CalDAVConnection = {
  id: string
  provider: string
  username: string
  serverUrl: string
  calendarUrl: string
  calendarName: string
  connected: boolean
  lastSync: string
  serverInfo: Record<string, unknown>
}

type CalDAVConnections = Record<string, CalDAVConnection>

type CalDAVProvider = {
  name: string
  serverUrl: string
  principalUrl: string
  calendarHomeSet: string
  icon: string
  disabled?: boolean
}

// CalDAV endpoints for major providers
const CALDAV_PROVIDERS: Record<string, CalDAVProvider> = {
  icloud: {
    name: 'iCloud Calendar',
    serverUrl: 'https://caldav.icloud.com',
    principalUrl: '/{{username}}/principal/',
    calendarHomeSet: '/{{username}}/calendars/',
    icon: '🍎'
  },
  outlook: {
    name: 'Outlook Calendar',
    serverUrl: 'https://outlook.office365.com',
    principalUrl: '/ews/calendar/',
    calendarHomeSet: '/calendar/',
    icon: '📧'
  },
  google: {
    name: 'Google Calendar (CalDAV)',
    serverUrl: 'https://apidata.googleusercontent.com/caldav/v2',
    principalUrl: '/{{username}}/user/',
    calendarHomeSet: '/{{username}}/events/',
    icon: '🌟',
    disabled: true // Google CalDAV is not supported for consumer accounts; use OAuth integration instead.
  }
}

export function useCalDAV() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connections, setConnections] = useState<CalDAVConnections>({})
  const [isDiscovering, setIsDiscovering] = useState(false)

  const { user } = useAuth()
  const { prayerTimes, settings } = usePrayerTimes()
  const { tasks } = useTasks()
  const { toast } = useToast()
  const secretsRef = useRef<Record<string, { username: string; password: string }>>({})

  const getConnectionsStorageKey = (userId: string) => `caldav-connections-${userId}`
  const getSecretsStorageKey = (userId: string) => `caldav-secrets-${userId}`

  const joinUrlSegments = (...segments: string[]) => {
    return segments
      .filter(Boolean)
      .map((segment, index) => {
        if (index === 0) {
          return segment.replace(/\/+$/, '')
        }
        return segment.replace(/^\/+/, '').replace(/\/+$/, '')
      })
      .join('/')
  }

  // Load existing connections from localStorage
  useEffect(() => {
    if (!user) {
      setConnections({})
      secretsRef.current = {}
      if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
        Object.keys(window.sessionStorage)
          .filter(key => key.startsWith('caldav-secrets-'))
          .forEach(key => window.sessionStorage.removeItem(key))
      }
      return
    }

    if (typeof window === 'undefined') {
      return
    }

    const stored = window.localStorage.getItem(getConnectionsStorageKey(user.id))
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Record<string, CalDAVConnection & { password?: string }>
        const sanitizedEntries = Object.entries(parsed).map(([providerId, connection]) => {
          const { password: _password, ...rest } = connection
          return [providerId, rest as CalDAVConnection]
        })
        const sanitizedConnections = Object.fromEntries(sanitizedEntries) as CalDAVConnections
        setConnections(sanitizedConnections)
        // Ensure any legacy password fields are removed from storage.
        window.localStorage.setItem(getConnectionsStorageKey(user.id), JSON.stringify(sanitizedConnections))
      } catch (error) {
        console.error('Failed to parse stored CalDAV connections', error)
        setConnections({})
      }
    } else {
      setConnections({})
    }

    const storedSecrets = typeof window.sessionStorage !== 'undefined'
      ? window.sessionStorage.getItem(getSecretsStorageKey(user.id))
      : null

    if (storedSecrets) {
      try {
        secretsRef.current = JSON.parse(storedSecrets)
      } catch (error) {
        console.error('Failed to parse CalDAV secrets from sessionStorage', error)
        secretsRef.current = {}
      }
    } else {
      secretsRef.current = {}
    }
  }, [user])

  /**
   * Persist sanitized connection metadata (without secrets) to storage.
   */
  const persistConnections = (nextConnections: CalDAVConnections) => {
    setConnections(nextConnections)
    if (user && typeof window !== 'undefined') {
      window.localStorage.setItem(getConnectionsStorageKey(user.id), JSON.stringify(nextConnections))
    }
  }

  /**
   * Persist the in-memory secrets to sessionStorage for this browser session.
   */
  const persistSecrets = () => {
    if (user && typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
      window.sessionStorage.setItem(getSecretsStorageKey(user.id), JSON.stringify(secretsRef.current))
    }
  }

  /**
   * Retrieve credentials for the given provider or prompt the user to reconnect.
   */
  const getSecretOrThrow = (providerId: string) => {
    const secret = secretsRef.current[providerId]
    if (!secret?.password || !secret.username) {
      throw new Error('Please reconnect to CalDAV to re-enter your password')
    }
    return secret
  }

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
        url: joinUrlSegments(serverUrl, principalUrl),
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
    if (!supabase) {
      throw new Error('Supabase client is not configured')
    }
    const { data, error } = await supabase.functions.invoke('caldav-proxy', {
      body: request
    })

    if (error) {
      throw new Error(`CalDAV request failed: ${error.message}`)
    }

    return data
  }

  /**
   * Parse the first DAV:href value for the requested DAV node.
   */
  const parseHref = (xmlResponse: string, localName: string) => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(xmlResponse, 'application/xml')
      const nodes = doc.getElementsByTagNameNS('DAV:', localName)
      const href = nodes[0]?.getElementsByTagNameNS('DAV:', 'href')[0]?.textContent
        ?? doc.getElementsByTagNameNS('DAV:', 'href')[0]?.textContent
      if (href) {
        return href
      }
    } catch (error) {
      console.warn('Failed to parse CalDAV discovery response', error)
    }

    return localName === 'current-user-principal' ? '/principal/' : '/calendars/'
  }

  const parsePrincipalUrl = (xmlResponse: string): string => parseHref(xmlResponse, 'current-user-principal')

  const parseCalendarHomeSet = (xmlResponse: string): string => parseHref(xmlResponse, 'calendar-home-set')

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
      if (!provider || provider.disabled) {
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

      secretsRef.current[config.provider] = {
        username: config.username,
        password: config.password
      }
      persistSecrets()

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

      persistConnections(newConnections)

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

  const createBarakahTasksCalendar = async (config: { provider: string; calendarName?: string }) => {
    const provider = CALDAV_PROVIDERS[config.provider as keyof typeof CALDAV_PROVIDERS]
    if (!provider) {
      throw new Error('Unsupported CalDAV provider')
    }

    const secret = getSecretOrThrow(config.provider)
    const calendarUrl = `${provider.serverUrl}${provider.calendarHomeSet.replace('{{username}}', secret.username)}barakah-tasks-${Date.now()}/`

    // Create calendar using MKCALENDAR
    const createResponse = await makeCalDAVRequest({
      method: 'MKCALENDAR',
      url: calendarUrl,
      credentials: { username: secret.username, password: secret.password },
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

      const secret = getSecretOrThrow(providerId)
      const coordinates = prayerTimes?.coordinates
      const syncSettings = settings as PrayerSettings | null
      const daysToSync = typeof (prayerTimes as { days?: number } | null)?.days === 'number'
        ? Math.max(1, (prayerTimes as { days?: number }).days ?? 30)
        : 30

      // Prepare events for sync
      const events: { uid: string; icalData: string }[] = []

      // Add prayer times as single events per day to avoid drift
      if (prayerTimes && coordinates) {
        for (let dayOffset = 0; dayOffset < daysToSync; dayOffset++) {
          const date = new Date()
          date.setHours(0, 0, 0, 0)
          date.setDate(date.getDate() + dayOffset)

          const dailyPrayers = calculatePrayerTimes(
            coordinates.latitude,
            coordinates.longitude,
            new Date(date),
            syncSettings ?? undefined
          )

          dailyPrayers.prayers.forEach(prayer => {
            const startTime = new Date(prayer.time)
            const endTime = new Date(startTime.getTime() + 30 * 60000)
            const uidDate = formatUIDDate(date)

            const icalEvent = [
              'BEGIN:VCALENDAR',
              'VERSION:2.0',
              'PRODID:-//Barakah Tasks//EN',
              'BEGIN:VEVENT',
              `UID:prayer-${prayer.name}-${uidDate}@barakah-tasks.app`,
              `DTSTART:${formatICalDate(startTime)}`,
              `DTEND:${formatICalDate(endTime)}`,
              `SUMMARY:${prayer.displayName} Prayer`,
              `DESCRIPTION:Time for ${prayer.displayName} prayer - Barakah Tasks`,
              'CATEGORIES:Prayer,Barakah Tasks',
              'END:VEVENT',
              'END:VCALENDAR'
            ].join('\n')

            events.push({
              uid: `prayer-${prayer.name}-${uidDate}`,
              icalData: icalEvent
            })
          })
        }
      }

      // Add tasks with due dates
      tasks.filter(task => task.due_date).forEach(task => {
        const dueDate = new Date(task.due_date + (task.due_time ? 'T' + task.due_time : 'T09:00:00'))

        const icalEvent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Barakah Tasks//EN',
          'BEGIN:VEVENT',
          `UID:task-${task.id}@barakah-tasks.app`,
          `DTSTART:${formatICalDate(dueDate)}`,
          `DTEND:${formatICalDate(new Date(dueDate.getTime() + 60 * 60000))}`,
          `SUMMARY:${task.title}`,
          `DESCRIPTION:${task.description || ''}`,
          'CATEGORIES:Task,Barakah Tasks',
          `PRIORITY:${task.priority === 'urgent' ? '1' : task.priority === 'high' ? '2' : '3'}`,
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\n')

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
          credentials: { username: secret.username, password: secret.password },
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

      persistConnections(newConnections)

      const serverDisplayName = typeof (connection.serverInfo as { displayName?: unknown })?.displayName === 'string'
        ? (connection.serverInfo as { displayName: string }).displayName
        : connection.calendarName

      toast({
        title: "CalDAV Sync Complete",
        description: `Synced ${events.length} events to ${serverDisplayName}`,
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

    persistConnections(newConnections)
    if (secretsRef.current[providerId]) {
      delete secretsRef.current[providerId]
      persistSecrets()
    }

    toast({
      title: "CalDAV Disconnected",
      description: "Calendar connection has been removed",
    })
  }

  const formatICalDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  /**
   * Format a UID-safe date stamp (YYYYMMDD) for per-day prayer events.
   */
  const formatUIDDate = (date: Date): string => {
    return getLocalDateString(date).replace(/-/g, '')
  }

  const availableProviders = Object.fromEntries(
    Object.entries(CALDAV_PROVIDERS).filter(([, provider]) => !provider.disabled)
  ) as Record<string, CalDAVProvider>

  return {
    connections,
    isConnecting,
    isDiscovering,
    connectCalDAV,
    syncEventsToCalDAV,
    disconnectCalDAV,
    testCalDAVConnection,
    providers: availableProviders
  }
}
