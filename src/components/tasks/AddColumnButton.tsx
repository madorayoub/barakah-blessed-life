import { useState } from 'react'
import { Plus, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTaskStatuses } from '@/hooks/useTaskStatuses'

interface AddColumnButtonProps {
  onColumnAdded?: () => void
}

export function AddColumnButton({ onColumnAdded }: AddColumnButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [columnName, setColumnName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { createStatus } = useTaskStatuses()

  const handleAddColumn = async () => {
    if (!columnName.trim() || isLoading) return
    
    setIsLoading(true)
    try {
      await createStatus(columnName.trim())
      setColumnName('')
      setIsAdding(false)
      onColumnAdded?.()
    } catch (error) {
      console.error('Failed to add column:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setColumnName('')
    setIsAdding(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddColumn()
    }
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (!isAdding) {
    return (
      <Button
        onClick={() => setIsAdding(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 h-9 border-dashed border-2 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary"
      >
        <Plus className="h-4 w-4" />
        Add Column
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2 bg-card border-2 border-primary rounded-md p-2 shadow-sm">
      <Input
        type="text"
        placeholder="Column name..."
        value={columnName}
        onChange={(e) => setColumnName(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border-0 focus-visible:ring-0 h-7 text-sm"
        autoFocus
        disabled={isLoading}
      />
      <div className="flex gap-1">
        <Button
          onClick={handleAddColumn}
          size="icon"
          variant="ghost"
          className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
          disabled={!columnName.trim() || isLoading}
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button
          onClick={handleCancel}
          size="icon"
          variant="ghost"
          className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
          disabled={isLoading}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}