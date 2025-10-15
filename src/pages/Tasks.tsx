import { TaskViews } from '@/components/tasks/TaskViews'
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel'
import { TaskCompletionReward } from '@/components/TaskCompletionReward'
import { RecurringTaskManager } from '@/components/RecurringTaskManager'
import { useTasks } from '@/contexts/TasksContext'
import { useState } from 'react'
import { AppHeader } from '@/components/AppHeader'
import type { Task } from '@/contexts/TasksContext'

const Tasks = () => {
  const { tasks, updateTask, completeTask, deleteTask, createTask, loading, calculateTaskStreak } = useTasks()

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [completedTaskInfo, setCompletedTaskInfo] = useState<any>(null)

  const handleSidebarClose = () => {
    setIsPanelOpen(false)
    setSelectedTask(null)
  }

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task)
    setIsPanelOpen(true)
  }

  const handleTaskEdit = async (updatedTask: Task) => {
    return updateTask(updatedTask.id, updatedTask)
  }

  const handleTaskComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    await completeTask(taskId)
    
    if (task) {
      const streak = calculateTaskStreak()
      const isIslamicTask = task.title.toLowerCase().includes('prayer') || 
                          task.title.toLowerCase().includes('dhikr') ||
                          task.title.toLowerCase().includes('quran')
      
      setCompletedTaskInfo({
        taskTitle: task.title,
        streak,
        isIslamicTask
      })
      setShowReward(true)
    }
  }

  const handleTaskSuggested = (taskTitle: string) => {
    // Optional: focus on the suggested task or show a notification
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title="Barakah Tasks" 
        subtitle="Organize your spiritual and daily tasks" 
      />
      
      <RecurringTaskManager />
      
      {/* Smart Suggestions temporarily disabled due to infinite loop */}

      {/* Main Task Views */}
      <TaskViews
        tasks={tasks}
        onTaskComplete={handleTaskComplete}
        onTaskDelete={deleteTask}
        onTaskEdit={handleTaskEdit}
        onTaskCreate={createTask}
        loading={loading}
        onTaskSelect={handleTaskSelect}
      />

      {/* Task Detail Panel */}
      <TaskDetailPanel
        task={selectedTask}
        isOpen={isPanelOpen}
        onClose={handleSidebarClose}
        onUpdate={async (task) => {
          if (!task) return
          const saved = await updateTask(task.id, task)
          if (saved) {
            setSelectedTask(saved)
          }
          return saved
        }}
        onDelete={(taskId) => {
          deleteTask(taskId)
          handleSidebarClose()
        }}
        onCreate={createTask}
      />

      {/* Completion Reward Animation */}
      <TaskCompletionReward
        taskTitle={completedTaskInfo?.taskTitle || ''}
        isVisible={showReward}
        onComplete={() => setShowReward(false)}
        streak={completedTaskInfo?.streak || 0}
        isIslamicTask={completedTaskInfo?.isIslamicTask || false}
      />
    </div>
  )
}

export default Tasks