import { TaskViews } from '@/components/tasks/TaskViews'
import { TaskDetailSidebar } from '@/components/TaskDetailSidebar'
import { TaskCompletionReward } from '@/components/TaskCompletionReward'
import { RecurringTaskManager } from '@/components/RecurringTaskManager'
import { useTasks } from '@/contexts/TasksContext'
import { useState } from 'react'
import { AppHeader } from '@/components/AppHeader'

const Tasks = () => {
  const { tasks, updateTask, completeTask, deleteTask, createTask, loading, calculateTaskStreak } = useTasks()
  
  // DEBUG: Log task count changes to track UI updates
  console.log('📋 TASKS COMPONENT RENDER - Tasks count:', tasks.length)
  console.log('📋 First few task IDs:', tasks.slice(0, 3).map(t => t.id))
  console.log('📋 Tasks component re-rendered at:', new Date().toISOString())
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [completedTaskInfo, setCompletedTaskInfo] = useState<any>(null)

  const handleTaskClick = (task: any) => {
    setSelectedTask(task)
    setIsSidebarOpen(true)
  }

  const handleSidebarClose = () => {
    setIsSidebarOpen(false)
    setSelectedTask(null)
  }

  const handleTaskEdit = async (updatedTask: any) => {
    await updateTask(updatedTask.id, updatedTask)
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

      {/* Main Task Views - Force re-render when tasks change */}
      <TaskViews
        key={tasks.length} // Simple key to force re-render
        tasks={tasks}
        onTaskComplete={handleTaskComplete}
        onTaskDelete={deleteTask}
        onTaskEdit={handleTaskEdit}
        onTaskCreate={createTask}
        loading={loading}
      />

      {/* Task Detail Sidebar */}
      <TaskDetailSidebar
        task={selectedTask}
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        onComplete={handleTaskComplete}
        onDelete={(taskId) => {
          deleteTask(taskId)
          handleSidebarClose()
        }}
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