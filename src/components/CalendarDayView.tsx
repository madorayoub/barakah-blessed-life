import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { usePrayerTimes } from '@/hooks/usePrayerTimes'
import { useTasks, type Task } from '@/contexts/TasksContext'
import { calculatePrayerTimes } from '@/lib/prayerTimes'
import { GoogleCalendarConnect } from '@/components/GoogleCalendarConnect'
import { AppleCalendarExport } from '@/components/AppleCalendarExport'
import { EditTaskDialog } from '@/components/EditTaskDialog'
import { EditPrayerDialog } from '@/components/EditPrayerDialog'
import { CalendarTaskDialog } from '@/components/CalendarTaskDialog'
import ThemeSelector, { ThemeType, getRecommendedTheme } from '@/components/calendar-themes/ThemeSelector'
import TimelineView from '@/components/calendar-themes/TimelineView'
import AgendaView from '@/components/calendar-themes/AgendaView'
import CardsView from '@/components/calendar-themes/CardsView'
import ZenView from '@/components/calendar-themes/ZenView'
import BlocksView from '@/components/calendar-themes/BlocksView'
import { getLocalDateString } from '@/utils/date'
import type { CalendarEvent } from '@/types/calendar'

const CalendarDayView = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('timeline')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingPrayer, setEditingPrayer] = useState<CalendarEvent | null>(null)
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false)
  const [newTaskTime, setNewTaskTime] = useState<string | undefined>()
  const { prayerTimes, settings, location, markPrayerComplete, isPrayerComplete } = usePrayerTimes()
  const { tasks } = useTasks()

  // Load saved theme or use recommended theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('calendar-theme') as ThemeType
    if (savedTheme) {
      setCurrentTheme(savedTheme)
    } else {
      setCurrentTheme(getRecommendedTheme())
    }
  }, [])

  // Save theme preference
  const handleThemeChange = (theme: ThemeType) => {
    setCurrentTheme(theme)
    localStorage.setItem('calendar-theme', theme)
  }

  // Generate events for the current date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const events: CalendarEvent[] = []
    const now = new Date()
    
    // Add all prayer times for this date
    if (location && settings) {
      try {
        const dayPrayerTimes = calculatePrayerTimes(
          location.latitude, 
          location.longitude, 
          date, 
          settings
        )
        
        dayPrayerTimes.prayers.forEach(prayer => {
          events.push({
            id: `prayer-${prayer.name}-${date.toDateString()}`,
            type: 'prayer',
            title: prayer.displayName,
            time: prayer.time,
            completed: isPrayerComplete(prayer.name)
          })
        })
      } catch (error) {
        console.error('Error calculating prayer times for date:', error)
      }
    }
    
    // Add tasks for this date
    const dayTasks = tasks.filter(task => {
      if (!task.due_date) return false
      const taskDate = new Date(task.due_date)
      return taskDate.toDateString() === date.toDateString()
    })
    
    dayTasks.forEach(task => {
      events.push({
        id: `task-${task.id}`,
        type: 'task',
        title: task.title,
        time: task.due_time ? new Date(`${task.due_date}T${task.due_time}`) : undefined,
        completed: task.status === 'completed',
        taskData: task
      })
    })
    
    // Sort by time and mark next upcoming event
    const sortedEvents = events.sort((a, b) => {
      if (!a.time && !b.time) return 0
      if (!a.time) return 1
      if (!b.time) return -1
      return a.time.getTime() - b.time.getTime()
    })
    
    // Mark next upcoming prayer if it's today
    if (date.toDateString() === now.toDateString()) {
      const nextEvent = sortedEvents.find(event => 
        event.time && event.time > now && !event.completed && event.type === 'prayer'
      )
      if (nextEvent) {
        nextEvent.isNext = true
      }
    }
    
    return sortedEvents
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const navigateDay = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }

  const events = getEventsForDate(currentDate)

  const handleEventClick = (event: CalendarEvent) => {
    if (event.type === 'task' && event.taskData) {
      setEditingTask(event.taskData)
    } else if (event.type === 'prayer') {
      setEditingPrayer(event)
    }
  }

  const handleAddTask = (hour?: number, _timeBlock?: string) => {
    // Set default due time based on hour or time block
    if (hour !== undefined) {
      setNewTaskTime(`${hour.toString().padStart(2, '0')}:00`)
    } else {
      setNewTaskTime(undefined)
    }
    setShowNewTaskDialog(true)
  }

  const renderThemeView = () => {
    const props = {
      date: currentDate,
      events,
      onPrayerComplete: (prayerName: string) => {
        markPrayerComplete(prayerName)
      },
      onEventClick: handleEventClick,
      onAddTask: (hourOrTimeBlock?: number | string) => {
        if (typeof hourOrTimeBlock === 'number') {
          handleAddTask(hourOrTimeBlock)
        } else {
          handleAddTask(undefined, hourOrTimeBlock)
        }
      }
    }

    switch (currentTheme) {
      case 'timeline':
        return <TimelineView {...props} />
      case 'agenda':
        return <AgendaView {...props} />
      case 'cards':
        return <CardsView {...props} />
      case 'zen':
        return <ZenView {...props} />
      case 'blocks':
        return <BlocksView {...props} />
      default:
        return <TimelineView {...props} />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDay('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDay('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Sync Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Sync
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Calendar Sync</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Connect your external calendars to sync prayer times and tasks automatically.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GoogleCalendarConnect />
                  <AppleCalendarExport />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Theme Selector */}
        <ThemeSelector 
          currentTheme={currentTheme} 
          onThemeChange={handleThemeChange} 
        />
      </CardHeader>

      <CardContent>
        {/* Theme-based Content */}
        {renderThemeView()}
      </CardContent>

      {/* Edit Dialogs */}
      <EditTaskDialog
        task={editingTask}
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
      />
      
      <EditPrayerDialog
        prayer={editingPrayer}
        open={!!editingPrayer}
        onOpenChange={(open) => !open && setEditingPrayer(null)}
        onPrayerComplete={markPrayerComplete}
      />

      <CalendarTaskDialog
        open={showNewTaskDialog}
        onOpenChange={setShowNewTaskDialog}
        defaultDueDate={getLocalDateString(currentDate)}
        defaultDueTime={newTaskTime}
      />
    </Card>
  )
}

export default CalendarDayView
