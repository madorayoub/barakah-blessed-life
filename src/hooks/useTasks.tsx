import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import { toast } from '@/hooks/use-toast'

export interface Task {
  id: string
  user_id: string
  category_id?: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  due_date?: string
  due_time?: string
  is_recurring: boolean
  recurring_pattern?: string
  parent_task_id?: string
  completed_at?: string
  created_at: string
  updated_at: string
  category?: TaskCategory
  subtasks?: Task[]
}

export interface TaskCategory {
  id: string
  user_id: string
  name: string
  color: string
  icon: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface TaskTemplate {
  id: string
  name: string
  description?: string
  category: string
  priority: string
  is_recurring: boolean
  recurring_pattern?: string
  estimated_duration?: number
  icon: string
  is_system: boolean
  created_at: string
}

export function useTasks() {
  const { user } = useAuth()
  const { sendTaskReminder } = useNotifications()
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [templates, setTemplates] = useState<TaskTemplate[]>([])
  const [loading, setLoading] = useState(true)

  // Schedule task reminders
  useEffect(() => {
    const scheduleTaskReminders = () => {
      const now = new Date()
      const today = now.toISOString().split('T')[0]
      
      tasks.forEach(task => {
        if (task.due_date === today && task.due_time && task.status === 'pending') {
          const [hours, minutes] = task.due_time.split(':')
          const dueDateTime = new Date()
          dueDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
          
          // Remind 30 minutes before
          const reminderTime = new Date(dueDateTime.getTime() - 30 * 60000)
          
          if (reminderTime > now) {
            setTimeout(() => {
              sendTaskReminder(task.title, 'in 30 minutes')
            }, reminderTime.getTime() - now.getTime())
          }
        }
      })
    }

    scheduleTaskReminders()
  }, [tasks, sendTaskReminder])

  // Load user's tasks
  useEffect(() => {
    async function loadTasks() {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            category:task_categories(*)
          `)
          .eq('user_id', user.id)
          .is('parent_task_id', null) // Only get parent tasks
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error loading tasks:', error)
          return
        }

        // Type assertion since we know the data structure
        setTasks((data as any[])?.map(task => ({
          ...task,
          priority: task.priority as Task['priority']
        })) || [])
      } catch (error) {
        console.error('Error loading tasks:', error)
      }
    }

    loadTasks()
  }, [user])

  // Load user's categories
  useEffect(() => {
    async function loadCategories() {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('task_categories')
          .select('*')
          .eq('user_id', user.id)
          .order('name')

        if (error) {
          console.error('Error loading categories:', error)
          return
        }

        setCategories(data || [])
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }

    loadCategories()
  }, [user])

  // Load task templates (filter by difficulty mode)
  useEffect(() => {
    async function loadTemplates() {
      try {
        // Get user's difficulty mode
        let difficultyMode = 'basic'
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('difficulty_mode')
            .eq('user_id', user.id)
            .maybeSingle()
          
          difficultyMode = profileData?.difficulty_mode || 'basic'
        }

        const { data, error } = await supabase
          .from('task_templates')
          .select('*')
          .order('name')

        if (error) {
          console.error('Error loading templates:', error)
          return
        }

        // Filter templates based on difficulty mode
        let filteredTemplates = data || []
        if (difficultyMode === 'basic') {
          // In basic mode, only show essential worship tasks
          filteredTemplates = filteredTemplates.filter(template => 
            ['Morning Dhikr', 'Evening Dhikr', 'Quran Reading', 'Friday Prayer'].includes(template.name)
          )
        }
        // In advanced mode, show all templates

        setTemplates(filteredTemplates)
      } catch (error) {
        console.error('Error loading templates:', error)
      }
    }

    loadTemplates()
    setLoading(false)
  }, [user])

  const createTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          user_id: user.id
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating task:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create task"
        })
        return
      }

      setTasks(prev => [(data as any), ...prev].map(task => ({
        ...task,
        priority: task.priority as Task['priority']
      })))
      toast({
        title: "Task created",
        description: `"${taskData.title}" has been added to your tasks`
      })

      return data as Task
    } catch (error) {
      console.error('Error creating task:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create task"
      })
    }
  }

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user) return

    try {
      // Remove read-only and joined fields that shouldn't be updated
      const {
        id,
        user_id,
        created_at,
        updated_at,
        category, // Remove joined category data
        subtasks, // Remove joined subtasks data
        ...updateData
      } = updates

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .eq('user_id', user.id)
        .select(`
          *,
          category:task_categories(*)
        `)
        .single()

      if (error) {
        console.error('Error updating task:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update task"
        })
        return
      }

      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, ...(data as any), priority: (data as any).priority as Task['priority'] } 
          : task
      ))
      return data as Task
    } catch (error) {
      console.error('Error updating task:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task"
      })
    }
  }

  const completeTask = async (taskId: string) => {
    const completed_at = new Date().toISOString()
    const task = tasks.find(t => t.id === taskId)
    
    const result = await updateTask(taskId, { 
      status: 'completed',
      completed_at
    })

    if (result) {
      // Check for streak
      const completedToday = getCompletedTasksToday()
      const streak = calculateTaskStreak(task?.title || '', completedToday)
      
      toast({
        title: "Task completed! 🎉",
        description: streak > 1 ? `${streak} day streak!` : "Great job! Keep up the good work"
      })
    }

    return result
  }

  const calculateTaskStreak = (taskTitle: string, completedTasks: Task[]) => {
    // Simple streak calculation - count consecutive days
    const similarTasks = tasks.filter(t => 
      t.title === taskTitle && t.status === 'completed'
    ).sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
    
    let streak = 1
    const today = new Date()
    
    for (let i = 1; i < similarTasks.length; i++) {
      const taskDate = new Date(similarTasks[i].completed_at!)
      const prevDate = new Date(similarTasks[i-1].completed_at!)
      const daysDiff = Math.floor((prevDate.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 1) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const deleteTask = async (taskId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting task:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete task"
        })
        return
      }

      setTasks(prev => prev.filter(task => task.id !== taskId))
      toast({
        title: "Task deleted",
        description: "Task has been removed"
      })
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete task"
      })
    }
  }

  const createTaskFromTemplate = async (template: TaskTemplate) => {
    const taskData = {
      title: template.name,
      description: template.description,
      priority: template.priority as Task['priority'],
      status: 'pending' as Task['status'],
      is_recurring: template.is_recurring,
      recurring_pattern: template.recurring_pattern,
      due_date: new Date().toISOString().split('T')[0], // Today
    }

    return await createTask(taskData)
  }

  const getTodaysTasks = () => {
    const today = new Date().toISOString().split('T')[0]
    return tasks.filter(task => 
      task.due_date === today && 
      task.status !== 'completed' && 
      task.status !== 'cancelled'
    )
  }

  const getCompletedTasksToday = () => {
    const today = new Date().toISOString().split('T')[0]
    return tasks.filter(task => 
      task.completed_at && 
      task.completed_at.startsWith(today)
    )
  }

  const getTasksByCategory = (categoryId: string) => {
    return tasks.filter(task => task.category_id === categoryId)
  }

  const createCategory = async (categoryData: Omit<TaskCategory, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('task_categories')
        .insert({
          ...categoryData,
          user_id: user.id
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating category:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create category"
        })
        return
      }

      setCategories(prev => [...prev, data as TaskCategory])
      toast({
        title: "Category created",
        description: `"${categoryData.name}" category has been added`
      })

      return data as TaskCategory
    } catch (error) {
      console.error('Error creating category:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create category"
      })
    }
  }

  return {
    tasks,
    categories,
    templates,
    loading,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
    createTaskFromTemplate,
    createCategory,
    getTodaysTasks,
    getCompletedTasksToday,
    getTasksByCategory,
    calculateTaskStreak
  }
}