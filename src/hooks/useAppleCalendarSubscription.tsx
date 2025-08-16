import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePrayerTimes } from '@/hooks/usePrayerTimes'
import { useTasks } from '@/contexts/TasksContext'
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
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate calendar subscription.",
        variant: "destructive",
      })
      return
    }

    // Don't require prayer times - generate basic calendar even without them
    console.log('Generating Apple Calendar subscription...', { user: !!user, prayerTimes: !!prayerTimes, tasks: tasks?.length })

    try {
      setIsGenerating(true)
      
      // Generate ICS calendar data
      const icsData = generateICSCalendar()
      
      if (!icsData || icsData.length < 100) {
        throw new Error("Generated calendar data is too small - likely missing events")
      }
      
      console.log('Generated ICS data:', icsData.substring(0, 200) + '...')
      
      // Create blob URL for the ICS file
      const blob = new Blob([icsData], { type: 'text/calendar; charset=utf-8' })
      const url = URL.createObjectURL(blob)
      
      setSubscriptionUrl(url)
      
      toast({
        title: "Calendar Subscription Ready! 🍎",
        description: "Click 'Open Calendar' to add to Apple Calendar.",
      })
    } catch (error) {
      console.error('Apple Calendar subscription error:', error)
      toast({
        title: "Generation Failed",
        description: `Could not generate calendar subscription: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateICSCalendar = () => {
    const events = []
    console.log('Generating ICS calendar with:', { prayerTimes: !!prayerTimes, tasks: tasks?.length })
    
    // Add prayer times for next 30 days
    if (prayerTimes && prayerTimes.prayers && Array.isArray(prayerTimes.prayers)) {
      console.log('Adding prayer times to calendar:', prayerTimes.prayers.length, 'prayers')
      for (let i = 0; i < 30; i++) {
        const date = addDays(new Date(), i)
        prayerTimes.prayers.forEach(prayer => {
          const startTime = new Date(date)
          startTime.setHours(prayer.time.getHours(), prayer.time.getMinutes(), 0, 0)
          
          const endTime = new Date(startTime.getTime() + 30 * 60000) // 30 minutes
          
          events.push({
            uid: `prayer-${prayer.name}-${format(date, 'yyyy-MM-dd')}-${user?.id}@barakah.app`,
            summary: `🕌 ${prayer.displayName || prayer.name} Prayer`,
            start: startTime,
            end: endTime,
            description: `Daily ${prayer.displayName || prayer.name} prayer reminder from Barakah Tasks`,
            categories: ['Prayer', 'Barakah Tasks'],
            alarm: '15' // 15 minutes before
          })
        })
      }
    } else {
      console.log('No prayer times available for calendar generation')
      // Add a sample event so calendar isn't empty
      const tomorrow = addDays(new Date(), 1)
      tomorrow.setHours(12, 0, 0, 0)
      events.push({
        uid: `sample-event-${user?.id}@barakah.app`,
        summary: '🌟 Barakah Tasks - Prayer times will appear when location is set',
        start: tomorrow,
        end: new Date(tomorrow.getTime() + 30 * 60000),
        description: 'Set your location in Settings to see accurate prayer times in your calendar',
        categories: ['Barakah Tasks'],
        alarm: '0'
      })
    }
    
    // Add tasks with due dates
    if (tasks && Array.isArray(tasks)) {
      console.log('Adding tasks to calendar:', tasks.length, 'tasks')
      tasks.filter(task => task.due_date).forEach(task => {
        const dueDate = new Date(task.due_date!)
        if (task.due_time) {
          const [hours, minutes] = task.due_time.split(':')
          dueDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        } else {
          dueDate.setHours(12, 0, 0, 0) // Default to noon
        }
        
        events.push({
          uid: `task-${task.id}-${user?.id}@barakah.app`,
          summary: `📝 ${task.title}`,
          start: dueDate,
          end: new Date(dueDate.getTime() + 60 * 60000), // 1 hour
          description: `Task from Barakah Tasks: ${task.description || ''}`,
          categories: ['Task', 'Barakah Tasks'],
          alarm: '30' // 30 minutes before
        })
      })
    }

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

    console.log('Generated', events.length, 'events for calendar')

    events.forEach(event => {
      ics.push(
        'BEGIN:VEVENT',
        `UID:${event.uid}`,
        `SUMMARY:${event.summary}`,
        `DTSTART:${formatDate(event.start)}`,
        `DTEND:${formatDate(event.end)}`,
        `DESCRIPTION:${event.description}`,
        `CATEGORIES:${event.categories.join(',')}`,
        // Add alarm if specified
        ...(event.alarm ? [
          'BEGIN:VALARM',
          'TRIGGER:-PT' + event.alarm + 'M',
          'ACTION:DISPLAY',
          `DESCRIPTION:${event.summary}`,
          'END:VALARM'
        ] : []),
        'END:VEVENT'
      )
    })

    ics.push('END:VCALENDAR')
    const result = ics.join('\r\n')
    console.log('Final ICS length:', result.length)
    return result
  }

  const openAppleCalendar = () => {
    if (!subscriptionUrl) {
      toast({
        title: "No Subscription URL",
        description: "Please generate a subscription first by clicking 'Connect Apple Calendar'.",
        variant: "destructive",
      })
      return
    }

    console.log('Opening Apple Calendar with URL:', subscriptionUrl)

    // For mobile devices, try to open directly in calendar app
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // Create a downloadable link for mobile
      const link = document.createElement('a')
      link.href = subscriptionUrl
      link.download = 'barakah-tasks-calendar.ics'
      link.click()
      
      toast({
        title: "Calendar File Downloaded! 📱",
        description: "Open the downloaded file to add events to your calendar app.",
      })
    } else {
      // Desktop: Show instructions
      const instructions = `🍎 Add Barakah Tasks to Apple Calendar:

1. Copy this URL: ${subscriptionUrl}

2. Open Apple Calendar on Mac

3. Go to File → New Calendar Subscription

4. Paste the URL and click Subscribe

5. Your prayer times and tasks will appear!

Note: This is a one-time import. For live sync, you'll need the full CalDAV integration.`

      // Show instructions in a new window
      const instructionWindow = window.open('', '_blank', 'width=700,height=500')
      if (instructionWindow) {
        instructionWindow.document.write(`
          <html>
            <head>
              <title>🍎 Apple Calendar Setup - Barakah Tasks</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 30px; line-height: 1.6; }
                .container { max-width: 600px; margin: 0 auto; }
                .url-box { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; word-break: break-all; }
                .button { background: #007AFF; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; margin: 10px 5px; }
                .button:hover { background: #0051D0; }
                h1 { color: #333; margin-bottom: 20px; }
                .step { margin: 15px 0; padding: 10px; background: #f9f9f9; border-radius: 5px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>🍎 Add Barakah Tasks to Apple Calendar</h1>
                
                <div class="step">
                  <strong>Step 1:</strong> Copy the subscription URL below
                  <div class="url-box">${subscriptionUrl}</div>
                  <button class="button" onclick="navigator.clipboard.writeText('${subscriptionUrl}').then(() => alert('URL copied to clipboard! 📋'))">Copy URL</button>
                </div>
                
                <div class="step">
                  <strong>Step 2:</strong> Open Apple Calendar on your Mac
                </div>
                
                <div class="step">
                  <strong>Step 3:</strong> Go to <em>File → New Calendar Subscription</em>
                </div>
                
                <div class="step">
                  <strong>Step 4:</strong> Paste the URL and click Subscribe
                </div>
                
                <div class="step">
                  <strong>Step 5:</strong> Your prayer times and tasks will appear! 🕌
                </div>
                
                <p><strong>Note:</strong> This creates a one-time import. For real-time sync, contact support about CalDAV integration.</p>
                
                <button class="button" onclick="window.close()">Done</button>
              </div>
            </body>
          </html>
        `)
      }

      toast({
        title: "Apple Calendar Instructions Opened! 🍎",
        description: "Follow the steps in the new window to add your calendar.",
      })
    }
  }

  return {
    subscriptionUrl,
    isGenerating,
    generateSubscriptionUrl,
    openAppleCalendar,
    isConnected: !!subscriptionUrl
  }
}