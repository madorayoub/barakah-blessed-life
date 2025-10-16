import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import { getLocalDateString } from '@/utils/date'

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed'
  due_date?: string
  due_time?: string
  category_id?: string
  is_recurring?: boolean
  recurring_pattern?: string
  recurring_weekday?: number | null
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
  icon?: string
  is_default?: boolean
  created_at: string
  updated_at: string
}

export interface TaskTemplate {
  id: string
  name: string
  description?: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  estimated_duration?: number
  is_recurring?: boolean
  recurring_pattern?: string
  icon?: string
  is_system?: boolean
  is_public?: boolean
  created_at: string
}

interface TasksContextType {
  tasks: Task[]
  categories: TaskCategory[]
  templates: TaskTemplate[]
  loading: boolean
  createTask: (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Task | undefined>
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<Task | undefined>
  deleteTask: (taskId: string) => Promise<void>
  completeTask: (taskId: string) => Promise<void>
  createTaskFromTemplate: (templateId: string, customData?: Partial<Task>) => Promise<Task | undefined>
  createCategory: (categoryData: Omit<TaskCategory, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  getTodaysTasks: () => Task[]
  getCompletedTasksToday: () => Task[]
  getTasksByCategory: (categoryId: string) => Task[]
  calculateTaskStreak: () => number
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

interface RawTask extends Partial<Task> {
  [key: string]: unknown
  subtasks?: RawTask[]
}

const normalizeTask = (task: RawTask): Task => {
  const rawSubtasks = Array.isArray(task.subtasks) ? (task.subtasks as RawTask[]) : []

  return {
    ...task,
    priority: task.priority as Task['priority'],
    status: task.status as Task['status'],
    subtasks: rawSubtasks.map(sub => normalizeTask({ ...sub, subtasks: [] } as RawTask))
  } as Task
}

const isNewer = (
  existing?: { updated_at?: string },
  incoming?: { updated_at?: string }
) => {
  if (!incoming?.updated_at) return true
  if (!existing?.updated_at) return true
  return new Date(incoming.updated_at).getTime() >= new Date(existing.updated_at).getTime()
}

const insertOrReplaceParent = (prev: Task[], incoming: Task) => {
  const formatted = normalizeTask({ ...incoming, subtasks: [] } as RawTask)
  const existingIndex = prev.findIndex(task => task.id === formatted.id)

  if (existingIndex !== -1) {
    const existing = prev[existingIndex]
    if (!isNewer(existing, formatted)) {
      return prev
    }

    const updatedTask: Task = {
      ...existing,
      ...formatted,
      category: formatted.category ?? existing.category,
      subtasks: existing.subtasks || []
    }

    const next = [...prev]
    next[existingIndex] = updatedTask
    return next
  }

  return [
    {
      ...formatted,
      category: formatted.category,
      subtasks: formatted.subtasks || []
    },
    ...prev
  ]
}

const insertOrReplaceSubtask = (prev: Task[], incoming: Task) => {
  if (!incoming.parent_task_id) return prev

  const parentIndex = prev.findIndex(task => task.id === incoming.parent_task_id)
  if (parentIndex === -1) return prev

  const parent = prev[parentIndex]
  const subtasks = parent.subtasks || []
  const formattedSubtask = normalizeTask({ ...incoming, subtasks: [] } as RawTask)
  const existingSubtaskIndex = subtasks.findIndex(subtask => subtask.id === formattedSubtask.id)

  if (existingSubtaskIndex !== -1) {
    const existingSubtask = subtasks[existingSubtaskIndex]
    if (!isNewer(existingSubtask, formattedSubtask)) {
      return prev
    }

    const newSubtasks = [...subtasks]
    newSubtasks[existingSubtaskIndex] = {
      ...existingSubtask,
      ...formattedSubtask,
      category: formattedSubtask.category ?? existingSubtask.category,
      subtasks: []
    }

    const next = [...prev]
    next[parentIndex] = {
      ...parent,
      subtasks: newSubtasks
    }
    return next
  }

  const next = [...prev]
  next[parentIndex] = {
    ...parent,
    subtasks: [
      ...subtasks,
      {
        ...formattedSubtask,
        category: formattedSubtask.category,
        subtasks: []
      }
    ]
  }
  return next
}

const removeById = (prev: Task[], id: string) =>
  prev
    .filter(task => task.id !== id)
    .map(task => ({
      ...task,
      subtasks: (task.subtasks || []).filter(subtask => subtask.id !== id)
    }))

export function TasksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [templates, setTemplates] = useState<TaskTemplate[]>([])
  const [loading, setLoading] = useState(true)

  // Load user's tasks
  useEffect(() => {
    async function loadTasks() {
      if (!user) {
        setTasks([])
        return
      }

      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            category:task_categories(*),
            subtasks:tasks!parent_task_id(*)
          `)
          .eq('user_id', user.id)
          .is('parent_task_id', null)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error loading tasks:', error)
          return
        }

        const formattedTasks = (data as any[])?.map(task => ({
          ...task,
          priority: task.priority as Task['priority'],
          status: task.status as Task['status'],
          subtasks: Array.isArray(task.subtasks) ? task.subtasks.map((sub: any) => ({
            ...sub,
            priority: sub.priority as Task['priority'],
            status: sub.status as Task['status'],
            subtasks: []
          })) : []
        })) || []

        setTasks(formattedTasks)
        console.log('🔄 CONTEXT: Loaded tasks from database:', formattedTasks.length)
        console.log('🔄 CONTEXT: Task IDs loaded:', formattedTasks.map(t => t.id))
        console.log('🔄 CONTEXT: Raw database response:', data)
      } catch (error) {
        console.error('Error loading tasks:', error)
      }
    }

    loadTasks()
  }, [user])

  // Real-time subscription for tasks
  useEffect(() => {
    if (!user) return

    console.log('🔄 CONTEXT: Setting up real-time subscription')
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🔄 CONTEXT: Real-time task change:', payload.eventType)

          if (payload.eventType === 'INSERT') {
            const newTask = normalizeTask(payload.new as RawTask)
            setTasks(prev =>
              newTask.parent_task_id
                ? insertOrReplaceSubtask(prev, newTask)
                : insertOrReplaceParent(prev, newTask)
            )
          } else if (payload.eventType === 'UPDATE') {
            const updatedTask = normalizeTask(payload.new as RawTask)
            setTasks(prev =>
              updatedTask.parent_task_id
                ? insertOrReplaceSubtask(prev, updatedTask)
                : insertOrReplaceParent(prev, updatedTask)
            )
          } else if (payload.eventType === 'DELETE') {
            const deletedTask = payload.old as Task
            setTasks(prev => removeById(prev, deletedTask.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  // Load categories and templates
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

    async function loadTemplates() {
      try {
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

        setTemplates(filteredTemplates.map(template => ({
          ...template,
          priority: template.priority as 'low' | 'medium' | 'high' | 'urgent'
        })))
      } catch (error) {
        console.error('Error loading templates:', error)
      }
    }

    loadCategories()
    loadTemplates()
    setLoading(false)
  }, [user])

  const createTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return

    // Clean and validate task data
    const cleanTaskData: Record<string, any> = { ...taskData }
    
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
        if ((error as any)?.code === '23505') {
          console.info('Skipping duplicate recurring child task due to unique constraint')
          return
        }

        console.error('Error creating task:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create task"
        })
        return
      }

      const newTask = normalizeTask(data as RawTask)

      // 🚀 CONTEXT NUCLEAR UPDATE: JSON Deep Copy for Create
      if (!cleanTaskData.parent_task_id) {
        setTasks(prevTasks => {
          console.log('✅ CONTEXT NUCLEAR CREATE - Task:', newTask.title)
          console.log('✅ Tasks BEFORE create:', prevTasks.length)

          const finalTasks = insertOrReplaceParent(prevTasks, newTask)

          console.log('✅ Tasks AFTER create:', finalTasks.length)
          console.log('✅ CONTEXT NUCLEAR: Created completely new array!')

          return finalTasks
        })
      } else {
        // Handle subtask creation
        setTasks(prevTasks => insertOrReplaceSubtask(prevTasks, newTask))
      }

      console.log('✅ CONTEXT CREATE COMPLETE')
      return newTask
    } catch (error) {
      console.error('Error creating task:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create task"
      })
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!user) return

    const snapshot = tasks

    try {
      console.log('🔥 CONTEXT DELETE START - Task ID:', taskId)
      console.log('🔥 Current tasks:', tasks.length)

      // 🚀 CONTEXT NUCLEAR UPDATE: JSON Deep Copy for Delete
      setTasks(prevTasks => {
        console.log('🔥 CONTEXT Tasks BEFORE delete:', prevTasks.length)

        const filteredTasks = prevTasks
          .filter(task => task.id !== taskId)
          .map(task => ({
            ...task,
            subtasks: (task.subtasks || []).filter(subtask => subtask.id !== taskId)
          }))

        console.log('🔥 CONTEXT Tasks AFTER delete:', filteredTasks.length)
        console.log('🔥 CONTEXT NUCLEAR: Created completely new array!')

        return filteredTasks
      })

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting task:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete task'
        })
        setTasks(snapshot)
        return
      }

      console.log('🔥 CONTEXT DELETE COMPLETE')
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete task'
      })
      setTasks(snapshot)
    }
  }

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user) return

    try {
      const updateData = { ...updates }
      delete updateData.id
      delete updateData.user_id
      delete updateData.created_at
      delete updateData.updated_at

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

      // Nuclear update for task updates
      setTasks(prev =>
        prev.map(task => {
          if (task.id === taskId) {
            return { ...task, ...updatedTask }
          }
          return {
            ...task,
            subtasks: (task.subtasks || []).map(subtask =>
              subtask.id === taskId ? { ...subtask, ...updatedTask } : subtask
            )
          }
        })
      )

      return updatedTask
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const completeTask = async (taskId: string) => {
    const completed_at = new Date().toISOString()
    
    // Nuclear optimistic update
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return { ...t, status: 'completed' as Task['status'], completed_at }
        }
        return {
          ...t,
          subtasks: (t.subtasks || []).map(subtask =>
            subtask.id === taskId
              ? { ...subtask, status: 'completed' as Task['status'], completed_at }
              : subtask
          )
        }
      })
    )

    const result = await updateTask(taskId, { 
      status: 'completed',
      completed_at
    })

    if (result) {
      toast({
        title: "Task completed!",
        description: "Great job! Keep up the good work.",
      })
    }
  }

  const createTaskFromTemplate = async (templateId: string, customData?: Partial<Task>) => {
    const template = templates.find(t => t.id === templateId)
    if (!template) return

    const taskData = {
      title: template.name,
      description: template.description,
      priority: template.priority,
      status: 'pending' as const,
      category_id: customData?.category_id,
      due_date: customData?.due_date,
      due_time: customData?.due_time,
      is_recurring: template.is_recurring || false,
      recurring_pattern: template.recurring_pattern,
      ...customData
    }

    return await createTask(taskData)
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
        return
      }

      setCategories(prev => [...prev, data])
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  const getTodaysTasks = () => {
    const today = getLocalDateString(new Date())
    return tasks.filter(task =>
      task.due_date === today && task.status !== 'completed'
    )
  }

  const getCompletedTasksToday = () => {
    const today = getLocalDateString(new Date())
    return tasks.filter(task => {
      if (!task.completed_at) return false
      const completedDate = getLocalDateString(new Date(task.completed_at))
      return completedDate === today
    })
  }

  const getTasksByCategory = (categoryId: string) => {
    return tasks.filter(task => task.category_id === categoryId)
  }

  const calculateTaskStreak = () => {
    if (tasks.length === 0) return 0
    
    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    
    while (true) {
      const dateStr = getLocalDateString(currentDate)
      const tasksOnDate = tasks.filter(task => {
        if (!task.completed_at) return false
        const completedDate = getLocalDateString(new Date(task.completed_at))
        return completedDate === dateStr
      })
      
      if (tasksOnDate.length > 0) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  }

  const value: TasksContextType = {
    tasks,
    categories,
    templates,
    loading,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    createTaskFromTemplate,
    createCategory,
    getTodaysTasks,
    getCompletedTasksToday,
    getTasksByCategory,
    calculateTaskStreak
  }

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TasksContext)
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider')
  }
  return context
}