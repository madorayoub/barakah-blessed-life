import { useDrop } from 'react-dnd'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NewTaskDialog } from '@/components/NewTaskDialog'
import { DraggableTaskCard } from './DraggableTaskCard'
import { Task } from '@/contexts/TasksContext'

interface Column {
  id: string
  title: string
  status: string
  color: string
  customColor?: string
}

interface DroppableColumnProps {
  column: Column
  tasks: Task[]
  isExpanded: boolean
  hasMoreTasks: boolean
  totalTasks: number
  remainingTasks: number
  onTaskDrop: (taskId: string, newStatus: string) => void
  onTaskClick: (task: Task) => void
  onTaskComplete: (taskId: string) => void
  onTaskDelete: (taskId: string) => void
  onTaskEdit: (task: Task) => void
  onCreateTask: (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  onToggleExpansion: () => void
  columnStatus: string // Add column status for proper dialog initialization
}

export function DroppableColumn({
  column,
  tasks,
  isExpanded,
  hasMoreTasks,
  totalTasks,
  remainingTasks,
  onTaskDrop,
  onTaskClick,
  onTaskComplete,
  onTaskDelete,
  onTaskEdit,
  onCreateTask,
  onToggleExpansion,
  columnStatus
}: DroppableColumnProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'task',
    drop: (item: { id: string }) => {
      onTaskDrop(item.id, column.status)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const isActive = isOver && canDrop

  return (
    <Card 
      ref={drop}
      className={`flex-shrink-0 w-80 min-h-96 transition-all duration-200 ${
        column.color
      } ${
        isActive ? 'ring-2 ring-primary bg-primary/5' : ''
      }`}
    >
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
            {totalTasks}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Column-Specific Create Task Button */}
        <NewTaskDialog 
          onTaskCreate={onCreateTask}
          initialStatus={
            columnStatus === 'pending' || columnStatus === 'to_do' ? 'pending' :
            columnStatus === 'in_progress' ? 'in_progress' : 
            columnStatus === 'completed' || columnStatus === 'done' ? 'completed' : 'pending'
          }
        >
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground h-8 mb-1 border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add task to {column.title}
          </Button>
        </NewTaskDialog>
        
        {/* Draggable Tasks */}
        {tasks.map(task => (
          <DraggableTaskCard
            key={`${task.id}-${task.updated_at}-${task.status}`}
            task={task}
            onComplete={onTaskComplete}
            onDelete={onTaskDelete}
            onEdit={onTaskEdit}
            onClick={onTaskClick}
          />
        ))}
        
        {/* Show More Button */}
        {hasMoreTasks && !isExpanded && (
          <Button
            variant="ghost"
            onClick={onToggleExpansion}
            className="w-full py-3 mt-2 text-sm text-muted-foreground hover:text-foreground border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5 rounded-lg transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Show More ({remainingTasks} more tasks)
          </Button>
        )}
        
        {/* Show Less Button */}
        {hasMoreTasks && isExpanded && (
          <Button
            variant="ghost"
            onClick={onToggleExpansion}
            className="w-full py-2 mt-2 text-sm text-muted-foreground hover:text-foreground border border-border hover:bg-muted rounded-lg"
          >
            Show Less
          </Button>
        )}
        
        {/* Empty State */}
        {totalTasks === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <NewTaskDialog 
              onTaskCreate={onCreateTask}
              initialStatus={
                columnStatus === 'pending' || columnStatus === 'to_do' ? 'pending' :
                columnStatus === 'in_progress' ? 'in_progress' : 
                columnStatus === 'completed' || columnStatus === 'done' ? 'completed' : 'pending'
              }
            >
              <Button 
                variant="ghost" 
                size="lg"
                className="w-full h-20 border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5 flex-col gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Add first task</span>
              </Button>
            </NewTaskDialog>
          </div>
        )}

        {/* Drop indicator */}
        {isActive && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
            <div className="text-primary font-medium">Drop task here</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}