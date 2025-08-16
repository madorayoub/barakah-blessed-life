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
  
  // DEBUG: Track task rendering in board view
  console.log('🏛️ TASKBOARDVIEW RENDER - Tasks received:', tasks.length)
  console.log('🏛️ TASKBOARDVIEW RENDER - Task IDs received:', tasks.map(t => t.id))
  console.log('🏛️ TASKBOARDVIEW RENDER - Task statuses:', tasks.map(t => `${t.id.slice(0,8)}:${t.status}`))
  console.log('🏛️ TaskBoardView component re-rendered at:', new Date().toISOString())
  
  // DEBUG: Log current column configuration
  console.log('🎯 COLUMNS CONFIGURED:', statuses.length > 0 ? 'Custom Statuses' : 'Default Columns')
  
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
  
  // 🎯 DEBUG: Log column configuration
  console.log('🎯 COLUMNS SETUP:', columns.map(c => `${c.title}(${c.status})`))
  console.log('🎯 STATUSES FROM HOOK:', statuses.length, statuses.map(s => s.name))

  const getTasksByStatus = (statusId: string) => {
    const filteredTasks = tasks.filter(task => {
      // 🎯 DEBUG: Log task filtering logic
      console.log(`🎯 FILTER DEBUG - Checking task ${task.id}:`)
      console.log(`  - Task status: "${task.status}"`)
      console.log(`  - Looking for column: "${statusId}"`)
      
      // Handle legacy status mapping
      if (statusId === 'to_do' && task.status === 'pending') {
        console.log(`  ✅ MATCH: to_do ← pending`)
        return true
      }
      if (statusId === 'in_progress' && task.status === 'in_progress') {
        console.log(`  ✅ MATCH: in_progress ← in_progress`)
        return true
      }
      if (statusId === 'done' && task.status === 'completed') {
        console.log(`  ✅ MATCH: done ← completed`)
        return true
      }
      
      // Direct status match
      const directMatch = task.status === statusId
      if (directMatch) {
        console.log(`  ✅ DIRECT MATCH: ${statusId} ← ${task.status}`)
      } else {
        console.log(`  ❌ NO MATCH: ${statusId} ≠ ${task.status}`)
      }
      
      return directMatch
    })
    
    // DEBUG: Log task filtering results
    console.log(`🎯 COLUMN ${statusId}: ${filteredTasks.length} tasks filtered from ${tasks.length} total`)
    console.log(`🎯 FILTERED TASK IDs:`, filteredTasks.map(t => t.id))
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
    if (!task) {
      console.log(`🎯 DRAG ERROR: Task ${taskId} not found`)
      return
    }
    
    console.log(`🎯 DRAG DROP: Task ${taskId} from "${task.status}" to "${newStatus}"`)
    
    if (task.status === newStatus) {
      console.log(`🎯 DRAG SKIP: Same status, no update needed`)
      return
    }

    // Map column status to database status
    const statusMapping: Record<string, Task['status']> = {
      'pending': 'pending',
      'to_do': 'pending', 
      'in_progress': 'in_progress',
      'completed': 'completed',
      'done': 'completed'
    }
    
    const mappedStatus = statusMapping[newStatus] || newStatus as Task['status']
    console.log(`🎯 DRAG STATUS MAPPING: "${newStatus}" → "${mappedStatus}"`)
    
    await updateTask(taskId, { status: mappedStatus })
    console.log(`🎯 DRAG COMPLETE: Task ${taskId} updated to "${mappedStatus}"`)
  }, [tasks, updateTask])

  // Handle column-specific task creation
  const handleCreateTaskInColumn = useCallback((status: string) => {
    console.log(`🎯 CREATE BUTTON CLICKED - Column Status: "${status}"`)
    
    return (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      console.log(`🎯 HANDLER CALLED - Original Status: "${status}"`)
      
      // Map column status to database status
      const statusMapping: Record<string, Task['status']> = {
        'pending': 'pending',
        'to_do': 'pending',
        'in_progress': 'in_progress', 
        'completed': 'completed',
        'done': 'completed'
      }
      
      const mappedStatus = statusMapping[status] || 'pending'
      console.log(`🎯 STATUS MAPPING: "${status}" → "${mappedStatus}"`)
      
      const finalTaskData = {
        ...taskData,
        status: mappedStatus
      }
      
      console.log(`🎯 FINAL TASK DATA:`, finalTaskData)
      onTaskCreate(finalTaskData)
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