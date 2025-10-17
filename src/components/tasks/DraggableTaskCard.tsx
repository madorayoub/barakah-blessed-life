import { useDrag } from 'react-dnd'
import { GripVertical } from 'lucide-react'
import EnhancedTaskCard from './EnhancedTaskCard'
import { Task } from '@/contexts/TasksContext'

interface DraggableTaskCardProps {
  task: Task
  onComplete: (taskId: string) => void
  onDelete: (taskId: string) => void
  onEdit: (task: Task) => void
  onClick: (task: Task) => void
}

export function DraggableTaskCard({
  task,
  onComplete,
  onDelete,
  onEdit,
  onClick
}: DraggableTaskCardProps) {
  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: 'task',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div 
      ref={dragPreview}
      className={`relative ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {/* Drag Handle */}
      <div
        ref={drag}
        className="absolute left-1 top-1/2 transform -translate-y-1/2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
      >
        <GripVertical className="h-3 w-3 text-muted-foreground" />
      </div>
      
      {/* Enhanced Task Card */}
      <div className="group">
        <EnhancedTaskCard
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
          onEdit={onEdit}
          onClick={onClick}
        />
      </div>
    </div>
  )
}