import { Calendar, Download, FileText, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePrayerTimes } from '@/hooks/usePrayerTimes'
import { useTasks } from '@/contexts/TasksContext'
import { format, addDays } from 'date-fns'

const parseLocalDateString = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

const createLocalDateTime = (dateString: string, timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  const date = parseLocalDateString(dateString)
  date.setHours(hours ?? 0, minutes ?? 0, 0, 0)
  return date
}

export function CalendarExport() {
  const { prayerTimes } = usePrayerTimes()
  const { tasks } = useTasks()

  const generateICS = () => {
    if (!prayerTimes) return

    const events = []
    const today = new Date()
    
    // Generate prayer times for next 30 days
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i)
      const dateStr = format(date, 'yyyyMMdd')
      
      prayerTimes.prayers.forEach(prayer => {
        const startTime = new Date(prayer.time)
        startTime.setDate(date.getDate())
        
        const startTimeStr = format(startTime, "yyyyMMdd'T'HHmmss")
        const endTime = new Date(startTime.getTime() + 30 * 60000) // 30 minutes later
        const endTimeStr = format(endTime, "yyyyMMdd'T'HHmmss")
        
        events.push(
          'BEGIN:VEVENT',
          `UID:prayer-${prayer.name}-${dateStr}@barakahtasks.com`,
          `DTSTART:${startTimeStr}`,
          `DTEND:${endTimeStr}`,
          `SUMMARY:${prayer.displayName} Prayer`,
          `DESCRIPTION:Time for ${prayer.displayName} prayer`,
          'CATEGORIES:Prayer,Islamic',
          'END:VEVENT'
        )
      })
    }

    // Add tasks with due dates
    tasks.forEach(task => {
      if (task.due_date) {
        const dueDate = parseLocalDateString(task.due_date)
        const dateStr = format(dueDate, 'yyyyMMdd')

        let startTimeStr, endTimeStr
        if (task.due_time) {
          const dueDateTime = createLocalDateTime(task.due_date, task.due_time)
          startTimeStr = format(dueDateTime, "yyyyMMdd'T'HHmmss")
          const endTime = new Date(dueDateTime.getTime() + 60 * 60000) // 1 hour later
          endTimeStr = format(endTime, "yyyyMMdd'T'HHmmss")
        } else {
          startTimeStr = dateStr
          endTimeStr = dateStr
        }
        
        events.push(
          'BEGIN:VEVENT',
          `UID:task-${task.id}@barakahtasks.com`,
          `DTSTART${task.due_time ? '' : ';VALUE=DATE'}:${startTimeStr}`,
          `DTEND${task.due_time ? '' : ';VALUE=DATE'}:${endTimeStr}`,
          `SUMMARY:${task.title}`,
          `DESCRIPTION:${task.description || 'Task from Barakah Tasks'}`,
          `CATEGORIES:Task,${task.category?.name || 'Personal'}`,
          `PRIORITY:${task.priority === 'urgent' ? '1' : task.priority === 'high' ? '2' : '3'}`,
          'END:VEVENT'
        )
      }
    })

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Barakah Tasks//Prayer Times and Tasks//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Barakah Tasks - Prayer Times & Tasks',
      'X-WR-CALDESC:Islamic prayer times and personal tasks from Barakah Tasks',
      ...events,
      'END:VCALENDAR'
    ].join('\r\n')

    // Download the file
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'barakah-tasks-calendar.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Integration
        </CardTitle>
        <CardDescription>
          Export your prayer times and tasks to external calendars
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Export to Calendar</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Download an ICS file containing your prayer times and tasks for the next 30 days
            </p>
            <Button onClick={generateICS} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Calendar File
            </Button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Import Instructions</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Import the downloaded file into:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Google Calendar</li>
              <li>• Apple Calendar</li>
              <li>• Outlook</li>
              <li>• Any calendar app</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Coming Soon: Live Sync</h4>
              <p className="text-sm text-blue-700">
                Direct Google Calendar and Apple Calendar integration with real-time syncing is in development.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}