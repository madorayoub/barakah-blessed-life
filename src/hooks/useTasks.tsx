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

  // Load user's tasks and set up real-time subscription
  useEffect(() => {
    async function loadTasks() {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            category:task_categories(*),
            subtasks:tasks!parent_task_id(*)
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
          priority: task.priority as Task['priority'],
          status: task.status as Task['status'],
          subtasks: Array.isArray(task.subtasks) ? task.subtasks.map((sub: any) => ({
            ...sub,
            priority: sub.priority as Task['priority'],
            status: sub.status as Task['status'],
            subtasks: [] // Subtasks don't have their own subtasks
          })) : []
        })) || [])
      } catch (error) {
        console.error('Error loading tasks:', error)
      }
    }

    loadTasks()

    // Set up real-time subscription for tasks
    if (user) {
      const channel = supabase
        .channel('tasks_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Task change:', payload)
            
            if (payload.eventType === 'INSERT') {
              const newTask = payload.new as any
              // Only add if it's a parent task (not a subtask) and not already in state
              if (!newTask.parent_task_id) {
                setTasks(prev => {
                  // Check if task already exists (from optimistic update)
                  const exists = prev.some(task => task.id === newTask.id)
                  if (exists) return prev
                  
                  const formattedTask = {
                    ...newTask,
                    priority: newTask.priority as Task['priority'],
                    status: newTask.status as Task['status'],
                    subtasks: []
                  } as Task
                  return [formattedTask, ...prev]
                })
              }
            } else if (payload.eventType === 'UPDATE') {
              const updatedTask = payload.new as any
              setTasks(prev => prev.map(task => {
                if (task.id === updatedTask.id) {
                  return {
                    ...task,
                    ...updatedTask,
                    priority: updatedTask.priority as Task['priority'],
                    status: updatedTask.status as Task['status'],
                    subtasks: task.subtasks || []
                  } as Task
                }
                return task
              }))
            } else if (payload.eventType === 'DELETE') {
              const deletedTask = payload.old as any
              setTasks(prev => prev.filter(task => task.id !== deletedTask.id))
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
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

    // Clean and validate task data
    const cleanTaskData = { ...taskData }
    
    // Remove undefined/null fields that shouldn't be sent to database
    Object.keys(cleanTaskData).forEach(key => {
      const value = cleanTaskData[key as keyof typeof cleanTaskData]
      if (value === undefined || value === null || value === '') {
        delete cleanTaskData[key as keyof typeof cleanTaskData]
      }
    })

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...cleanTaskData,
          user_id: user.id
        })
        .select(`
          *,
          category:task_categories(*),
          subtasks:tasks!parent_task_id(*)
        `)
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

      const newTask = {
        ...data,
        priority: data.priority as Task['priority'],
        status: data.status as Task['status'],
        subtasks: Array.isArray(data.subtasks) ? data.subtasks : []
      } as Task

      console.log('✅ CREATE START - Task:', newTask.title)
      console.log('✅ Tasks BEFORE create:', tasks.length)
      console.log('✅ Task IDs before:', tasks.map(t => t.id))
      
      // 🚀 NUCLEAR OPTION: JSON Deep Copy - Guaranteed to work!
      if (!cleanTaskData.parent_task_id) {
        // It's a main task
        setTasks(prevTasks => {
          console.log('✅ NUCLEAR CREATE START - Task:', newTask.title)
          console.log('✅ Tasks BEFORE create:', prevTasks.length)
          
          // Deep copy existing tasks (completely new objects)
          const deepCopiedTasks = JSON.parse(JSON.stringify(prevTasks))
          
          // Add new task at the beginning
          const finalTasks = [newTask, ...deepCopiedTasks]
          
          console.log('✅ Tasks AFTER create:', finalTasks.length)
          console.log('✅ NUCLEAR: Created completely new array reference!')
          
          return finalTasks
        })
      } else {
        // It's a subtask
        setTasks(prevTasks => {
          console.log('✅ NUCLEAR SUBTASK CREATE for parent:', cleanTaskData.parent_task_id)
          
          // Deep copy and add subtask
          const deepCopiedTasks = JSON.parse(JSON.stringify(prevTasks))
          const finalTasks = deepCopiedTasks.map((task: Task) => {
            if (task.id === cleanTaskData.parent_task_id) {
              return {
                ...task,
                subtasks: [...(task.subtasks || []), newTask]
              }
            }
            return task
          })
          
          return finalTasks
        })
      }
      toast({
        title: cleanTaskData.parent_task_id ? "Subtask created" : "Task created",
        description: `"${cleanTaskData.title}" has been ${cleanTaskData.parent_task_id ? 'added to your subtasks' : 'created successfully'}`
      })

      console.log('✅ CREATE COMPLETE - Database operation successful')
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
          category:task_categories(*),
          subtasks:tasks!parent_task_id(*)
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

      const updatedTask = {
        ...data,
        priority: data.priority as Task['priority'],
        status: data.status as Task['status'],
        subtasks: Array.isArray(data.subtasks) ? data.subtasks : []
      } as Task

      // OPTIMISTIC UPDATE: Update state immediately for instant UI feedback
      setTasks(prev => prev.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            ...updatedTask,
            subtasks: task.subtasks || []
          }
        }
        // Also update if this is a subtask
        return {
          ...task,
          subtasks: (task.subtasks || []).map(subtask => 
            subtask.id === taskId ? { ...subtask, ...updatedTask } : subtask
          )
        }
      }))

      return updatedTask
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
    
    // OPTIMISTIC UPDATE: Mark as completed immediately for instant UI feedback
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: 'completed' as Task['status'], completed_at }
      }
      // Also update subtasks
      return {
        ...t,
        subtasks: (t.subtasks || []).map(subtask => 
          subtask.id === taskId 
            ? { ...subtask, status: 'completed' as Task['status'], completed_at }
            : subtask
        )
      }
    }))

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
      console.log('🔥 DELETE START - Task ID:', taskId)
      console.log('🔥 Tasks BEFORE delete:', tasks.length)
      console.log('🔥 Task IDs before:', tasks.map(t => t.id))
      
      // 🚀 NUCLEAR OPTION: JSON Deep Copy - Guaranteed to work!
      setTasks(prevTasks => {
        console.log('🔥 NUCLEAR DELETE START - Task ID:', taskId)
        console.log('🔥 Tasks BEFORE delete:', prevTasks.length)
        
        // Step 1: Deep copy the entire tasks array (completely new objects)
        const deepCopiedTasks = JSON.parse(JSON.stringify(prevTasks))
        
        // Step 2: Filter out the deleted task
        const filteredTasks = deepCopiedTasks.filter((task: Task) => task.id !== taskId)
        
        // Step 3: Also remove from subtasks
        const finalTasks = filteredTasks.map((task: Task) => ({
          ...task,
          subtasks: (task.subtasks || []).filter(subtask => subtask.id !== taskId)
        }))
        
        console.log('🔥 Tasks AFTER delete:', finalTasks.length)
        console.log('🔥 NUCLEAR: Created completely new array reference!')
        
        return finalTasks
      })

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting task:', error)
        // Revert optimistic update on error
        const { data: taskData } = await supabase
          .from('tasks')
          .select(`
            *,
            category:task_categories(*),
            subtasks:tasks!parent_task_id(*)
          `)
          .eq('user_id', user.id)
          .is('parent_task_id', null)
          .order('created_at', { ascending: false })
        
        if (taskData) {
          setTasks((taskData as any[])?.map(task => ({
            ...task,
            priority: task.priority as Task['priority'],
            status: task.status as Task['status'],
            subtasks: Array.isArray(task.subtasks) ? task.subtasks.map((sub: any) => ({
              ...sub,
              priority: sub.priority as Task['priority'],
              status: sub.status as Task['status'],
              subtasks: []
            })) : []
          })) || [])
        }
        
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete task"
        })
        return
      }
      
      console.log('🔥 DELETE COMPLETE - Database operation successful')

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
    const taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
      title: template.name,
      description: template.description || undefined,
      priority: template.priority as Task['priority'],
      status: 'pending' as Task['status'],
      // CRITICAL FIX: Do NOT make template tasks recurring by default
      // User can manually enable recurring if they want
      is_recurring: false,
      // Remove any automatic recurring pattern
      recurring_pattern: undefined,
      due_date: new Date().toISOString().split('T')[0] // Today
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