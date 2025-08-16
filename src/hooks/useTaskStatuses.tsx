import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'

export interface TaskStatus {
  id: string
  user_id: string
  name: string
  color: string
  position: number
  is_default: boolean
  created_at: string
  updated_at: string
}

export function useTaskStatuses() {
  const { user } = useAuth()
  const [statuses, setStatuses] = useState<TaskStatus[]>([])
  const [loading, setLoading] = useState(true)

  // Load user's custom statuses
  useEffect(() => {
    async function loadStatuses() {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('task_statuses')
          .select('*')
          .eq('user_id', user.id)
          .order('position')

        if (error) {
          console.error('Error loading statuses:', error)
          return
        }

        setStatuses(data || [])
      } catch (error) {
        console.error('Error loading statuses:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStatuses()
  }, [user])

  const createStatus = async (name: string, color: string = '#6b7280') => {
    if (!user) return

    try {
      const maxPosition = Math.max(...statuses.map(s => s.position), 0)
      
      const { data, error } = await supabase
        .from('task_statuses')
        .insert({
          user_id: user.id,
          name,
          color,
          position: maxPosition + 1,
          is_default: false
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating status:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create column"
        })
        return
      }

      setStatuses(prev => [...prev, data as TaskStatus].sort((a, b) => a.position - b.position))
      toast({
        title: "Column created",
        description: `"${name}" column has been added`
      })

      return data as TaskStatus
    } catch (error) {
      console.error('Error creating status:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create column"
      })
    }
  }

  const updateStatus = async (statusId: string, updates: Partial<TaskStatus>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('task_statuses')
        .update(updates)
        .eq('id', statusId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating status:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update column"
        })
        return
      }

      setStatuses(prev => prev.map(status => 
        status.id === statusId 
          ? { ...status, ...(data as TaskStatus) } 
          : status
      ))
      return data as TaskStatus
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update column"
      })
    }
  }

  const deleteStatus = async (statusId: string) => {
    if (!user) return

    try {
      const statusToDelete = statuses.find(s => s.id === statusId)
      if (statusToDelete?.is_default) {
        toast({
          variant: "destructive",
          title: "Cannot delete",
          description: "Default columns cannot be deleted"
        })
        return
      }

      const { error } = await supabase
        .from('task_statuses')
        .delete()
        .eq('id', statusId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting status:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete column"
        })
        return
      }

      setStatuses(prev => prev.filter(status => status.id !== statusId))
      toast({
        title: "Column deleted",
        description: "Column has been removed"
      })
    } catch (error) {
      console.error('Error deleting status:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete column"
      })
    }
  }

  // Map statuses to legacy format for backward compatibility
  const getStatusOptions = () => {
    return statuses.map(status => ({
      value: status.name.toLowerCase().replace(/\s+/g, '_'),
      label: status.name,
      color: status.color
    }))
  }

  // Get status value for task status field
  const getStatusValue = (statusName: string) => {
    const status = statuses.find(s => s.name === statusName)
    return status ? status.name.toLowerCase().replace(/\s+/g, '_') : 'pending'
  }

  // Get status label from value
  const getStatusLabel = (statusValue: string) => {
    const status = statuses.find(s => 
      s.name.toLowerCase().replace(/\s+/g, '_') === statusValue
    )
    return status ? status.name : statusValue
  }

  return {
    statuses,
    loading,
    createStatus,
    updateStatus,
    deleteStatus,
    getStatusOptions,
    getStatusValue,
    getStatusLabel
  }
}