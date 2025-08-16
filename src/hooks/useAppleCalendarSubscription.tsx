import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePrayerTimes } from '@/hooks/usePrayerTimes'
import { useTasks } from '@/hooks/useTasks'
import { useToast } from '@/hooks/use-toast'
import { format, addDays } from 'date-fns'

export function useAppleCalendarSubscription() {
  const [subscriptionUrl, setSubscriptionUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const { user } = useAuth()
  const { prayerTimes } = usePrayerTimes()
  const { tasks } = useTasks()
  const { toast } = useToast()

  const generateSubscriptionUrl = async () => {
    if (!user || !prayerTimes) return

    try {
      setIsGenerating(true)
      
      // Generate ICS calendar data
      const icsData = generateICSCalendar()
      
      // In a real implementation, you'd upload this to a public URL
      // For demo, we'll create a blob URL
      const blob = new Blob([icsData], { type: 'text/calendar' })
      const url = URL.createObjectURL(blob)
      
      // In production, this would be a permanent URL like:
      // https://your-domain.com/calendar/${user.id}/barakah-tasks.ics
      setSubscriptionUrl(url)
      
      toast({
        title: "Calendar Subscription Ready",
        description: "Your Apple Calendar subscription URL has been generated.",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate calendar subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateICSCalendar = () => {
    const events = []
    
    // Add prayer times for next 365 days
    for (let i = 0; i < 365; i++) {
      const date = addDays(new Date(), i)
      if (prayerTimes) {
        prayerTimes.prayers.forEach(prayer => {
          const startTime = new Date(date)
          // prayer.time is already a Date object
          startTime.setHours(prayer.time.getHours(), prayer.time.getMinutes())
          
          const endTime = new Date(startTime.getTime() + 30 * 60000) // 30 minutes
          
          events.push({
            uid: `prayer-${prayer.name}-${format(date, 'yyyy-MM-dd')}@barakah.app`,
            summary: `${prayer.name} Prayer`,
            start: startTime,
            end: endTime,
            description: `Daily ${prayer.name} prayer reminder from Barakah Tasks`,
            categories: ['Prayer', 'Barakah Tasks']
          })
        })
      }
    }
    
    // Add tasks with due dates
    tasks.filter(task => task.due_date).forEach(task => {
      const dueDate = new Date(task.due_date!)
      events.push({
        uid: `task-${task.id}@barakah.app`,
        summary: task.title,
        start: dueDate,
        end: new Date(dueDate.getTime() + 60 * 60000), // 1 hour
        description: `Task from Barakah Tasks: ${task.description || ''}`,
        categories: ['Task', 'Barakah Tasks']
      })
    })

    // Generate ICS format
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    let ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Barakah Tasks//EN',
      'NAME:Barakah Tasks',
      'X-WR-CALNAME:Barakah Tasks',
      'DESCRIPTION:Prayer times and tasks from Barakah Tasks',
      'X-WR-CALDESC:Prayer times and tasks from Barakah Tasks',
      'REFRESH-INTERVAL;VALUE=DURATION:PT1H',
      'X-PUBLISHED-TTL:PT1H'
    ]

    events.forEach(event => {
      ics.push(
        'BEGIN:VEVENT',
        `UID:${event.uid}`,
        `SUMMARY:${event.summary}`,
        `DTSTART:${formatDate(event.start)}`,
        `DTEND:${formatDate(event.end)}`,
        `DESCRIPTION:${event.description}`,
        `CATEGORIES:${event.categories.join(',')}`,
        'END:VEVENT'
      )
    })

    ics.push('END:VCALENDAR')
    return ics.join('\r\n')
  }

  const openAppleCalendar = () => {
    if (!subscriptionUrl) return

    // Create instructions for user
    const instructions = `
To add Barakah Tasks to Apple Calendar:

1. Copy this URL: ${subscriptionUrl}
2. Open Apple Calendar
3. Go to File > New Calendar Subscription
4. Paste the URL and click Subscribe
5. Your prayer times and tasks will sync automatically!

The calendar will update automatically when you add new tasks.
    `.trim()

    // Show instructions in a new window
    const instructionWindow = window.open('', '_blank', 'width=600,height=400')
    if (instructionWindow) {
      instructionWindow.document.write(`
        <html>
          <head><title>Apple Calendar Setup</title></head>
          <body style="font-family: sans-serif; padding: 20px;">
            <h2>🍎 Add Barakah Tasks to Apple Calendar</h2>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${instructions}</pre>
            <button onclick="navigator.clipboard.writeText('${subscriptionUrl}'); alert('URL copied!')">Copy Subscription URL</button>
          </body>
        </html>
      `)
    }

    toast({
      title: "Apple Calendar Instructions",
      description: "Instructions opened in new window. Follow the steps to add your calendar.",
    })
  }

  return {
    subscriptionUrl,
    isGenerating,
    generateSubscriptionUrl,
    openAppleCalendar,
    isConnected: !!subscriptionUrl
  }
}