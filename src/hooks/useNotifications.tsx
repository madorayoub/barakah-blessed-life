import { useEffect, useRef, useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { isPrayerNotificationTag, PRAYER_NOTIFICATION_PREFIX } from '@/utils/notifications'

export interface NotificationPreferences {
  enabled: boolean
  prayerReminders: boolean
  taskReminders: boolean
  dailyGoals: boolean
  minutesBefore: number
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: true,
    prayerReminders: true,
    taskReminders: true,
    dailyGoals: true,
    minutesBefore: 10
  })
  const prayerTimeoutsRef = useRef<number[]>([])

  const getServiceWorkerRegistration = async (): Promise<ServiceWorkerRegistration | null> => {
    if (!('serviceWorker' in navigator)) {
      return null
    }

    try {
      return await navigator.serviceWorker.ready
    } catch (error) {
      console.error('Service worker not ready:', error)
      return null
    }
  }

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      toast({
        variant: "destructive",
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications"
      })
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      
      if (result === 'granted') {
        toast({
          title: "Notifications enabled",
          description: "You'll now receive prayer and task reminders"
        })
        return true
      } else {
        toast({
          variant: "destructive",
          title: "Notifications denied",
          description: "You can enable them later in your browser settings"
        })
        return false
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  const sendNotification = async (title: string, options?: NotificationOptions) => {
    if (!preferences.enabled || Notification.permission !== 'granted') {
      return
    }

    try {
      const registration = await getServiceWorkerRegistration()
      if (!registration) {
        console.warn('Service worker registration unavailable; notification skipped')
        return
      }

      await registration.showNotification(title, {
        badge: '/favicon.ico',
        icon: options?.icon || '/favicon.ico',
        renotify: true,
        ...options
      })
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  const sendPrayerReminder = async (prayerName: string) => {
    if (!preferences.prayerReminders) return

    return sendNotification(
      `${prayerName} Prayer Reminder`,
      {
        body: `It's almost time for ${prayerName} prayer. Take a moment to prepare.`,
        tag: `${PRAYER_NOTIFICATION_PREFIX}${prayerName.toLowerCase()}`,
        requireInteraction: false,
        silent: false
      }
    )
  }

  const sendTaskReminder = (taskTitle: string, dueTime?: string) => {
    if (!preferences.taskReminders) return

    return sendNotification(
      'Task Reminder',
      {
        body: dueTime
          ? `"${taskTitle}" is due ${dueTime}`
          : `Don't forget: "${taskTitle}"`,
        tag: 'task-reminder',
        icon: '/favicon.ico'
      }
    )
  }

  const sendDailyGoalReminder = (goalType: 'morning-dhikr' | 'evening-dhikr' | 'quran') => {
    if (!preferences.dailyGoals) return

    const messages = {
      'morning-dhikr': {
        title: 'Morning Dhikr Reminder',
        body: 'Start your day with remembrance of Allah. Time for morning dhikr!'
      },
      'evening-dhikr': {
        title: 'Evening Dhikr Reminder', 
        body: 'End your day with gratitude. Time for evening dhikr!'
      },
      'quran': {
        title: 'Quran Reading Reminder',
        body: 'Nourish your soul with the words of Allah. Time for Quran reading!'
      }
    }

    const message = messages[goalType]
    return sendNotification(message.title, {
      body: message.body,
      tag: `daily-goal-${goalType}`,
      icon: '/favicon.ico'
    })
  }

  const clearScheduledPrayerTimeouts = () => {
    prayerTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId))
    prayerTimeoutsRef.current = []
  }

  const clearPrayerNotifications = async () => {
    const registration = await getServiceWorkerRegistration()
    if (!registration) return

    try {
      const notifications = await registration.getNotifications({ includeTriggered: true })
      notifications
        .filter(notification => isPrayerNotificationTag(notification.tag))
        .forEach(notification => notification.close())
    } catch (error) {
      console.error('Error clearing prayer notifications:', error)
    }
  }

  const schedulePrayerNotifications = (prayerTimes: Array<{name: string, time: Date, displayName: string}>) => {
    if (!preferences.enabled || !preferences.prayerReminders) return

    clearScheduledPrayerTimeouts()
    void clearPrayerNotifications()

    prayerTimes.forEach(prayer => {
      const notificationTime = new Date(prayer.time.getTime() - preferences.minutesBefore * 60000)
      const now = new Date()

      if (notificationTime > now) {
        const delay = notificationTime.getTime() - now.getTime()
        const timeoutId = window.setTimeout(() => {
          void sendPrayerReminder(prayer.displayName)
        }, delay)
        prayerTimeoutsRef.current.push(timeoutId)
      }
    })
  }

  const updatePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }))
    
    // Save to localStorage
    localStorage.setItem('notification-preferences', JSON.stringify({
      ...preferences,
      ...newPreferences
    }))
  }

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notification-preferences')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setPreferences(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Error loading notification preferences:', error)
      }
    }
  }, [])

  return {
    permission,
    preferences,
    requestPermission,
    sendNotification,
    sendPrayerReminder,
    sendTaskReminder,
    sendDailyGoalReminder,
    schedulePrayerNotifications,
    updatePreferences
  }
}