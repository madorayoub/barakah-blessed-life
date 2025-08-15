import { useState, useEffect } from 'react'
import { toast } from '@/hooks/use-toast'

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

  const sendNotification = (title: string, options?: {
    body?: string
    icon?: string
    tag?: string
    requireInteraction?: boolean
    silent?: boolean
  }) => {
    if (!preferences.enabled || Notification.permission !== 'granted') {
      return
    }

    try {
      const notification = new Notification(title, {
        body: options?.body,
        icon: options?.icon || '/favicon.ico',
        tag: options?.tag,
        requireInteraction: options?.requireInteraction || false,
        silent: options?.silent || false,
        badge: '/favicon.ico'
      })

      // Auto-close notification after 10 seconds
      setTimeout(() => {
        notification.close()
      }, 10000)

      return notification
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  const sendPrayerReminder = (prayerName: string, timeUntil: string) => {
    if (!preferences.prayerReminders) return

    return sendNotification(
      `${prayerName} Prayer Reminder`,
      {
        body: `${prayerName} prayer is in ${timeUntil}. Prepare for prayer.`,
        tag: `prayer-${prayerName.toLowerCase()}`,
        requireInteraction: true,
        icon: '/favicon.ico'
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

  const schedulePrayerNotifications = (prayerTimes: Array<{name: string, time: Date, displayName: string}>) => {
    if (!preferences.enabled || !preferences.prayerReminders) return

    // Clear existing prayer notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.getNotifications({ tag: 'prayer' }).then(notifications => {
          notifications.forEach(notification => notification.close())
        })
      })
    }

    prayerTimes.forEach(prayer => {
      const notificationTime = new Date(prayer.time.getTime() - preferences.minutesBefore * 60000)
      const now = new Date()

      if (notificationTime > now) {
        const timeUntil = Math.ceil((prayer.time.getTime() - notificationTime.getTime()) / 60000)
        
        setTimeout(() => {
          sendPrayerReminder(prayer.displayName, `${timeUntil} minutes`)
        }, notificationTime.getTime() - now.getTime())
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