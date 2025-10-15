import { useState, useEffect, useCallback, useMemo } from 'react'
import { Lightbulb, Clock, BookOpen, Heart, Sun, Moon, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTasks } from '@/contexts/TasksContext'
import { usePrayerTimes } from '@/hooks/usePrayerTimes'
import { getLocalDateString } from '@/utils/date'

interface SmartTaskSuggestionsProps {
  onTaskSuggested: (taskTitle: string) => void
}

export function SmartTaskSuggestions({ onTaskSuggested }: SmartTaskSuggestionsProps) {
  const { tasks, createTask } = useTasks()
  const { prayerTimes } = usePrayerTimes()
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [lastGeneratedTime, setLastGeneratedTime] = useState<number>(0)

  // Memoize today's date to prevent unnecessary recalculations
  const today = useMemo(() => getLocalDateString(new Date()), [])
  
  // Get today's completed tasks
  const todayCompleted = useMemo(() => 
    tasks.filter(task => task.completed_at?.startsWith(today)),
    [tasks, today]
  )
  
  // Get pending tasks
  const pendingTasks = useMemo(() => 
    tasks.filter(task => task.status === 'pending'),
    [tasks]
  )
  const generateSmartSuggestions = useCallback(() => {
    const now = new Date()
    const currentTime = now.getTime()
    
    // Only generate suggestions once every 5 minutes to prevent loops
    if (currentTime - lastGeneratedTime < 5 * 60 * 1000) {
      return
    }
    
    const currentHour = now.getHours()
    const newSuggestions = []

    // Get current completed and pending tasks
    const currentTodayCompleted = tasks.filter(task => task.completed_at?.startsWith(today))
    const currentPendingTasks = tasks.filter(task => task.status === 'pending')

    // Morning suggestions (5 AM - 11 AM)
    if (currentHour >= 5 && currentHour < 11) {
      const hasFajr = currentTodayCompleted.some(task => 
        task.title.toLowerCase().includes('fajr')
      )
      const hasMorningDhikr = currentTodayCompleted.some(task => 
        task.title.toLowerCase().includes('morning dhikr')
      )
      
      if (!hasFajr) {
        newSuggestions.push({
          title: "Fajr Prayer",
          reason: "Start your day with blessings",
          priority: "urgent",
          icon: Sun,
          isIslamic: true,
          action: "prayer"
        })
      } else if (!hasMorningDhikr) {
        newSuggestions.push({
          title: "Morning Dhikr",
          reason: "Perfect time for morning remembrance",
          priority: "high",
          icon: Heart,
          isIslamic: true,
          action: "dhikr"
        })
      } else {
        newSuggestions.push({
          title: "Quran Reading",
          reason: "You usually read Quran after Fajr",
          priority: "medium",
          icon: BookOpen,
          isIslamic: true,
          action: "study"
        })
      }
    }

    // Afternoon suggestions (12 PM - 4 PM)
    if (currentHour >= 12 && currentHour < 16) {
      const hasDhuhr = currentTodayCompleted.some(task => 
        task.title.toLowerCase().includes('dhuhr')
      )
      
      if (!hasDhuhr) {
        newSuggestions.push({
          title: "Dhuhr Prayer",
          reason: "Time for the midday prayer",
          priority: "urgent",
          icon: Sun,
          isIslamic: true,
          action: "prayer"
        })
      }
    }

    // Evening suggestions (5 PM - 8 PM)
    if (currentHour >= 17 && currentHour < 20) {
      const hasAsr = currentTodayCompleted.some(task => 
        task.title.toLowerCase().includes('asr')
      )
      const hasMaghrib = currentTodayCompleted.some(task => 
        task.title.toLowerCase().includes('maghrib')
      )
      
      if (!hasAsr) {
        newSuggestions.push({
          title: "Asr Prayer",
          reason: "Don't miss the afternoon prayer",
          priority: "urgent",
          icon: Clock,
          isIslamic: true,
          action: "prayer"
        })
      } else if (!hasMaghrib && currentHour >= 18) {
        newSuggestions.push({
          title: "Maghrib Prayer",
          reason: "Time for sunset prayer",
          priority: "urgent",
          icon: Moon,
          isIslamic: true,
          action: "prayer"
        })
      }
    }

    // Night suggestions (8 PM - 11 PM)
    if (currentHour >= 20 && currentHour < 23) {
      const hasIsha = currentTodayCompleted.some(task => 
        task.title.toLowerCase().includes('isha')
      )
      const hasEveningDhikr = currentTodayCompleted.some(task => 
        task.title.toLowerCase().includes('evening dhikr')
      )
      
      if (!hasIsha) {
        newSuggestions.push({
          title: "Isha Prayer",
          reason: "Complete your daily prayers",
          priority: "urgent",
          icon: Moon,
          isIslamic: true,
          action: "prayer"
        })
      } else if (!hasEveningDhikr) {
        newSuggestions.push({
          title: "Evening Dhikr",
          reason: "End your day with remembrance",
          priority: "high",
          icon: Star,
          isIslamic: true,
          action: "dhikr"
        })
      }
    }

    // Late night suggestions (11 PM - 4 AM)
    if (currentHour >= 23 || currentHour < 5) {
      newSuggestions.push({
        title: "Istighfar (100x)",
        reason: "Perfect time for seeking forgiveness",
        priority: "medium",
        icon: Heart,
        isIslamic: true,
        action: "dhikr"
      })
    }

    // Add productivity suggestions based on incomplete tasks
    const incompleteTasks = currentPendingTasks.filter(task => 
      task.due_date === today && !task.title.toLowerCase().includes('prayer')
    )
    
    if (incompleteTasks.length > 0) {
      const urgentTask = incompleteTasks.find(task => task.priority === 'urgent')
      if (urgentTask) {
        newSuggestions.push({
          title: urgentTask.title,
          reason: "Urgent task needs attention",
          priority: "urgent",
          icon: Clock,
          isIslamic: false,
          action: "existing_task",
          taskId: urgentTask.id
        })
      }
    }

    setSuggestions(newSuggestions.slice(0, 3)) // Show max 3 suggestions
    setLastGeneratedTime(currentTime)
  }, [tasks, today, lastGeneratedTime])

  // Initialize suggestions once and use interval for updates
  useEffect(() => {
    // Initial generation
    generateSmartSuggestions()
    
    // Update suggestions every 10 minutes
    const interval = setInterval(() => {
      generateSmartSuggestions()
    }, 10 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [generateSmartSuggestions])

  const handleCreateSuggestion = async (suggestion: any) => {
    if (suggestion.action === 'existing_task') {
      onTaskSuggested(suggestion.title)
      return
    }

    try {
      await createTask({
        title: suggestion.title,
        description: `Smart suggestion: ${suggestion.reason}`,
        priority: suggestion.priority as any,
        status: 'pending',
        due_date: today,
        is_recurring: suggestion.isIslamic
      })
      
      onTaskSuggested(suggestion.title)
      
      // Remove the created suggestion from current suggestions
      setSuggestions(prev => prev.filter((_, index) => 
        suggestions.findIndex(s => s.title === suggestion.title) !== index
      ))
    } catch (error) {
      console.error('Failed to create suggested task:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (suggestions.length === 0) return null

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Smart Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion, index) => {
          const IconComponent = suggestion.icon
          return (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  suggestion.isIslamic ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <IconComponent className={`h-4 w-4 ${
                    suggestion.isIslamic ? 'text-green-600' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{suggestion.title}</h4>
                  <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getPriorityColor(suggestion.priority)}`}
                >
                  {suggestion.priority}
                </Badge>
                <Button 
                  size="sm" 
                  onClick={() => handleCreateSuggestion(suggestion)}
                  className="h-7 px-2 text-xs"
                >
                  {suggestion.action === 'existing_task' ? 'Focus' : 'Add'}
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}