import { Plus, GripVertical, Settings, MoreHorizontal } from 'lucide-react'
import { useState, useCallback } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NewTaskDialog } from '@/components/NewTaskDialog'
import EnhancedTaskCard from './EnhancedTaskCard'
import { TaskDetailPanel } from './TaskDetailPanel'
import { AddColumnButton } from './AddColumnButton'
import { BoardTips } from './BoardTips'
import { Task, useTasks } from '@/contexts/TasksContext'
import { useTaskStatuses } from '@/hooks/useTaskStatuses'
import { DroppableColumn } from './DroppableColumn'

interface TaskBoardViewProps {
  tasks: Task[]
  onTaskComplete: (taskId: string) => void
  onTaskDelete: (taskId: string) => void
  onTaskEdit: (task: Task) => void
  onTaskCreate: (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  loading: boolean
}

export function TaskBoardView({ tasks, onTaskComplete, onTaskDelete, onTaskEdit, onTaskCreate, loading }: TaskBoardViewProps) {
  const { updateTask } = useTasks()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [expandedColumns, setExpandedColumns] = useState<Record<string, boolean>>({})
  const { statuses, loading: statusesLoading } = useTaskStatuses()
  
  const INITIAL_TASK_LIMIT = 10

  // Map custom statuses to columns, with fallback to default columns
  const columns = statuses.length > 0 ? statuses.map(status => ({
    id: status.name.toLowerCase().replace(/\s+/g, '_'),
    title: status.name,
    status: status.name.toLowerCase().replace(/\s+/g, '_'),
    color: `bg-gray-50/50 border-gray-200`,
    customColor: status.color
  })) : [
    { id: 'pending', title: 'To Do', status: 'pending', color: 'bg-blue-50/50 border-blue-200' },
    { id: 'in_progress', title: 'In Progress', status: 'in_progress', color: 'bg-yellow-50/50 border-yellow-200' },
    { id: 'completed', title: 'Done', status: 'completed', color: 'bg-green-50/50 border-green-200' }
  ]
  
  // Create status mapping for filtering
  const statusMapping: Record<string, string[]> = {
    'pending': ['pending'],
    'to_do': ['pending'], 
    'in_progress': ['in_progress'],
    'completed': ['completed'],
    'done': ['completed'],
    'tests': ['pending', 'in_progress', 'completed'] // Show all tasks in tests column
  }

  const getTasksByStatus = (statusId: string) => {
    const allowedStatuses = statusMapping[statusId] || [statusId]
    const filteredTasks = tasks.filter(task => allowedStatuses.includes(task.status))
    return filteredTasks
  }

  // Use useCallback for event handlers to prevent unnecessary re-renders
  const handleTaskClick = useCallback((task: Task) => {
    console.log('TaskBoardView - task clicked:', task.id)
    setSelectedTask(task)
    setIsPanelOpen(true)
  }, [])

  const handlePanelClose = useCallback(() => {
    setIsPanelOpen(false)
    setSelectedTask(null)
  }, [])

  const handleTaskUpdate = useCallback((updatedTask: Task) => {
    console.log('TaskBoardView - task updated:', updatedTask.id)
    onTaskEdit(updatedTask)
    setSelectedTask(updatedTask)
  }, [onTaskEdit])

  const toggleColumnExpansion = useCallback((columnId: string) => {
    setExpandedColumns(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }))
  }, [])

  // Handle task drag and drop
  const handleTaskDrop = useCallback(async (taskId: string, newStatus: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    
    // Map column status to database status
    const dbStatusMapping: Record<string, Task['status']> = {
      'pending': 'pending',
      'to_do': 'pending', 
      'in_progress': 'in_progress',
      'completed': 'completed',
      'done': 'completed'
    }
    
    const mappedStatus = dbStatusMapping[newStatus] || newStatus as Task['status']
    if (task.status === mappedStatus) return

    await updateTask(taskId, { status: mappedStatus })
  }, [tasks, updateTask])

  // Handle column-specific task creation
  const handleCreateTaskInColumn = useCallback((status: string) => {
    return (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      // Map column status to database status
      const dbStatusMapping: Record<string, Task['status']> = {
        'pending': 'pending',
        'to_do': 'pending',
        'in_progress': 'in_progress', 
        'completed': 'completed',
        'done': 'completed'
      }
      
      const mappedStatus = dbStatusMapping[status] || 'pending'
      
      onTaskCreate({
        ...taskData,
        status: mappedStatus
      })
    }
  }, [onTaskCreate])

  if (loading || statusesLoading) {
    return (
      <div className="flex gap-6 overflow-x-auto">
        {[1,2,3].map(i => (
          <Card key={i} className="flex-shrink-0 w-80 h-96">
            <CardHeader className="pb-3">
              <div className="h-6 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1,2,3].map(j => (
                  <div key={j} className="h-16 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        <div className="flex-shrink-0">
          <div className="w-32 h-10 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        {/* Board Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Task Board</h2>
            <p className="text-muted-foreground text-sm">Organize tasks with simple drag and drop</p>
          </div>
          <NewTaskDialog onTaskCreate={onTaskCreate}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </NewTaskDialog>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-6 overflow-x-auto pb-6">
          {columns.map(column => {
            const columnTasks = getTasksByStatus(column.status)
          const isExpanded = expandedColumns[column.id] || false
          const visibleTasks = isExpanded ? columnTasks : columnTasks.slice(0, INITIAL_TASK_LIMIT)
          const hasMoreTasks = columnTasks.length > INITIAL_TASK_LIMIT
            
            return (
              <DroppableColumn
                key={column.id}
                column={column}
                tasks={visibleTasks}
                isExpanded={isExpanded}
                hasMoreTasks={hasMoreTasks}
                onTaskDrop={handleTaskDrop}
                onTaskClick={handleTaskClick}
                onTaskComplete={onTaskComplete}
                onTaskDelete={onTaskDelete}
                onTaskEdit={onTaskEdit}
                onCreateTask={handleCreateTaskInColumn(column.status)}
                onToggleExpansion={() => toggleColumnExpansion(column.id)}
                totalTasks={columnTasks.length}
                remainingTasks={columnTasks.length - INITIAL_TASK_LIMIT}
              />
            )
        })}
        
        {/* Add Column Button */}
        <div className="flex-shrink-0 self-start">
          <AddColumnButton />
        </div>
      </div>

      {/* Board Tips */}
      <BoardTips />

      {/* Task Detail Panel */}
      <TaskDetailPanel
        task={selectedTask}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        onUpdate={handleTaskUpdate}
        onDelete={onTaskDelete}
        onCreate={onTaskCreate}
      />
      </div>
    </DndProvider>
  )
}