import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NewTaskDialog } from '@/components/NewTaskDialog'
import { MagicTaskCard } from './MagicTaskCard'
import { QuickAddTask } from './QuickAddTask'
import { Task } from '@/hooks/useTasks'

interface TaskBoardViewProps {
  tasks: Task[]
  onTaskComplete: (taskId: string) => void
  onTaskDelete: (taskId: string) => void
  onTaskEdit: (task: Task) => void
  loading: boolean
}

export function TaskBoardView({ tasks, onTaskComplete, onTaskDelete, onTaskEdit, loading }: TaskBoardViewProps) {
  // Simple 3-column Kanban (ClickUp's winning formula)
  const columns = [
    { id: 'pending', title: 'To Do', status: 'pending', color: 'bg-blue-50 border-blue-200' },
    { id: 'in_progress', title: 'In Progress', status: 'in_progress', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'completed', title: 'Done', status: 'completed', color: 'bg-green-50 border-green-200' }
  ]

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  const handleStatusChange = (task: Task, newStatus: Task['status']) => {
    onTaskEdit({ ...task, status: newStatus })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <Card key={column.id} className="h-96">
            <CardHeader className="pb-3">
              <div className="h-6 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => {
          const columnTasks = getTasksByStatus(column.status)
          
          return (
            <Card key={column.id} className={`min-h-96 ${column.color}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{column.title}</span>
                  <Badge variant="secondary" className="text-xs">
                    {columnTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Quick Add */}
                <QuickAddTask groupId={column.id} />
                
                {/* Tasks */}
                {columnTasks.map(task => (
                  <div key={task.id} className="cursor-pointer">
                    <MagicTaskCard
                      task={task}
                      onComplete={onTaskComplete}
                      onDelete={onTaskDelete}
                      onEdit={onTaskEdit}
                    />
                  </div>
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
                <li>• Click "Add task" in any column to create tasks in that status</li>
                <li>• Edit task details to move between columns</li>
                <li>• Use priority flags to organize important tasks</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}