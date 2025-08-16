import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Save, Check } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface TaskNotesProps {
  taskId: string
  initialNotes?: string
  onNotesUpdate?: (notes: string) => void
}

export function TaskNotes({ taskId, initialNotes = '', onNotesUpdate }: TaskNotesProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const { user } = useAuth()

  // Auto-save functionality
  useEffect(() => {
    if (!user || notes === initialNotes) return

    const autoSaveTimeout = setTimeout(async () => {
      setIsSaving(true)
      try {
        const { error } = await supabase
          .from('tasks')
          .update({ description: notes, updated_at: new Date().toISOString() })
          .eq('id', taskId)
          .eq('user_id', user.id)

        if (!error) {
          setLastSaved(new Date())
          onNotesUpdate?.(notes)
        }
      } catch (error) {
        console.error('Error saving notes:', error)
      } finally {
        setIsSaving(false)
      }
    }, 1000) // Auto-save after 1 second of no typing

    return () => clearTimeout(autoSaveTimeout)
  }, [notes, taskId, user, initialNotes, onNotesUpdate])

  const formatLastSaved = () => {
    if (!lastSaved) return ''
    return `Saved at ${lastSaved.toLocaleTimeString()}`
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Task Notes</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isSaving ? (
              <>
                <Save className="h-3 w-3 animate-pulse" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <Check className="h-3 w-3 text-green-600" />
                <span>{formatLastSaved()}</span>
              </>
            ) : (
              <span>Type to add notes</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Add detailed notes, thoughts, or instructions for this task..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[120px] resize-none border-muted"
          disabled={!user}
        />
        {notes.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            {notes.length} characters
          </div>
        )}
      </CardContent>
    </Card>
  )
}