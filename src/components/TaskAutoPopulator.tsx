import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface TaskTemplate {
  name: string
  description: string
  category: string
  icon: string
  priority: 'high' | 'medium' | 'low'
  estimated_duration?: number
}

const basicTasks: TaskTemplate[] = [
  { name: "Fajr Prayer", description: "Dawn prayer - the first prayer of the day", category: "worship", icon: "sun", priority: "high", estimated_duration: 10 },
  { name: "Dhuhr Prayer", description: "Midday prayer", category: "worship", icon: "sun", priority: "high", estimated_duration: 10 },
  { name: "Asr Prayer", description: "Afternoon prayer", category: "worship", icon: "sun", priority: "high", estimated_duration: 10 },
  { name: "Maghrib Prayer", description: "Sunset prayer", category: "worship", icon: "sunset", priority: "high", estimated_duration: 10 },
  { name: "Isha Prayer", description: "Night prayer", category: "worship", icon: "moon", priority: "high", estimated_duration: 10 }
]

const advancedTasks: TaskTemplate[] = [
  ...basicTasks,
  { name: "Morning Dhikr", description: "Recite morning supplications after Fajr prayer", category: "worship", icon: "sun", priority: "high", estimated_duration: 15 },
  { name: "Evening Dhikr", description: "Recite evening supplications after Maghrib prayer", category: "worship", icon: "moon", priority: "high", estimated_duration: 15 },
  { name: "Quran Reading", description: "Read and reflect on the Quran", category: "worship", icon: "book-open", priority: "high", estimated_duration: 30 },
  { name: "Istighfar (100x)", description: "Seek forgiveness from Allah", category: "worship", icon: "heart", priority: "medium", estimated_duration: 10 },
  { name: "Tahajjud Prayer", description: "Optional night prayer", category: "worship", icon: "moon", priority: "medium", estimated_duration: 20 },
  { name: "Duha Prayer", description: "Optional morning prayer", category: "worship", icon: "sun", priority: "medium", estimated_duration: 10 },
  { name: "Read Islamic Book", description: "Study Islamic knowledge", category: "learning", icon: "graduation-cap", priority: "medium", estimated_duration: 45 },
  { name: "Charity/Sadaqah", description: "Give charity or help someone in need", category: "worship", icon: "gift", priority: "medium", estimated_duration: 5 }
]

const TaskAutoPopulator = () => {
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const populateInitialTasks = async () => {
      if (!user) return

      try {
        // Check if user already has tasks
        const { data: existingTasks } = await supabase
          .from('tasks')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)

        if (existingTasks && existingTasks.length > 0) {
          // User already has tasks, don't populate
          return
        }

        // Get user's difficulty mode
        const { data: profileData } = await supabase
          .from('profiles')
          .select('difficulty_mode')
          .eq('user_id', user.id)
          .single()

        const difficultyMode = profileData?.difficulty_mode || 'basic'
        const tasksToPopulate = difficultyMode === 'advanced' ? advancedTasks : basicTasks

        // Get or create default category
        const { data: existingCategory } = await supabase
          .from('task_categories')
          .select('id')
          .eq('user_id', user.id)
          .eq('name', 'Worship')
          .single()

        let categoryId = existingCategory?.id

        if (!categoryId) {
          const { data: newCategory } = await supabase
            .from('task_categories')
            .insert({
              user_id: user.id,
              name: 'Worship',
              color: '#10b981',
              icon: 'mosque',
              is_default: true
            })
            .select('id')
            .single()

          categoryId = newCategory?.id
        }

        if (!categoryId) {
          throw new Error('Failed to create or find category')
        }

        // Create tasks
        const tasksData = tasksToPopulate.map(task => ({
          user_id: user.id,
          title: task.name,
          description: task.description,
          category_id: categoryId,
          priority: task.priority,
          estimated_duration: task.estimated_duration,
          status: 'pending' as const,
          is_recurring: true,
          recurring_pattern: 'daily'
        }))

        const { error: insertError } = await supabase
          .from('tasks')
          .insert(tasksData)

        if (insertError) throw insertError

        toast({
          title: "Welcome to Barakah Tasks! 🌟",
          description: `We've added ${tasksToPopulate.length} ${difficultyMode} tasks to get you started. You can customize them anytime!`,
          duration: 5000
        })

      } catch (error) {
        console.error('Error populating initial tasks:', error)
        // Don't show error toast as it might confuse new users
      }
    }

    populateInitialTasks()
  }, [user, toast])

  return null // This component doesn't render anything
}

export default TaskAutoPopulator