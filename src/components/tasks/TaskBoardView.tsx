import { Plus, GripVertical, Settings, MoreHorizontal } from 'lucide-react'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NewTaskDialog } from '@/components/NewTaskDialog'
import { EnhancedTaskCard } from './EnhancedTaskCard'
import { QuickAddTask } from './QuickAddTask'
import { TaskDetailPanel } from './TaskDetailPanel'
import { AddColumnButton } from './AddColumnButton'
import { Task } from '@/hooks/useTasks'
import { useTaskStatuses } from '@/hooks/useTaskStatuses'

interface TaskBoardViewProps {
  tasks: Task[]
  onTaskComplete: (taskId: string) => void
  onTaskDelete: (taskId: string) => void
  onTaskEdit: (task: Task) => void
  onTaskCreate: (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  loading: boolean
}

export function TaskBoardView({ tasks, onTaskComplete, onTaskDelete, onTaskEdit, onTaskCreate, loading }: TaskBoardViewProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const { statuses, loading: statusesLoading } = useTaskStatuses()

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

  const getTasksByStatus = (statusId: string) => {
    return tasks.filter(task => {
      // Handle legacy status mapping
      if (statusId === 'to_do' && task.status === 'pending') return true
      if (statusId === 'in_progress' && task.status === 'in_progress') return true
      if (statusId === 'done' && task.status === 'completed') return true
      return task.status === statusId
    })
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsPanelOpen(true)
  }

  const handlePanelClose = () => {
    setIsPanelOpen(false)
    setSelectedTask(null)
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    onTaskEdit(updatedTask)
    setSelectedTask(updatedTask)
  }

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
    <div className="space-y-4">
      {/* Board Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Task Board</h2>
          <p className="text-muted-foreground text-sm">Organize tasks with simple drag and drop</p>
        </div>
        <NewTaskDialog>
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
          
          return (
            <Card key={column.id} className={`flex-shrink-0 w-80 min-h-96 ${column.color}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    {column.customColor && (
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: column.customColor }}
                      />
                    )}
                    <span>{column.title}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {columnTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Quick Add */}
                <QuickAddTask groupId={column.id} columnStatus={column.status} />
                
                {/* Tasks */}
                {columnTasks.map(task => (
                  <EnhancedTaskCard
                    key={task.id}
                    task={task}
                    onComplete={onTaskComplete}
                    onDelete={onTaskDelete}
                    onEdit={onTaskEdit}
                    onClick={handleTaskClick}
                  />
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                      <Plus className="h-6 w-6" />
                    </div>
                    <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
        
        {/* Add Column Button */}
        <div className="flex-shrink-0 self-start">
          <AddColumnButton />
        </div>
      </div>

      {/* Board Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Plus className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Quick Board Tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Click any task card to view details and edit</li>
                <li>• Add tasks directly to specific columns</li>
                <li>• Use priority flags to organize important tasks</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

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
  )
}