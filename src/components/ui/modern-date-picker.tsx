import { Calendar, Clock } from 'lucide-react'
import { Label } from '@/components/ui/label'

interface SimpleDatePickerProps {
  value?: string
  onChange: (date: string) => void
  placeholder?: string
  label?: string
  showTime?: boolean
  timeValue?: string
  onTimeChange?: (time: string) => void
  className?: string
}

export function ModernDatePicker({
  value,
  onChange,
  placeholder = "Select date",
  label,
  showTime = false,
  timeValue = "",
  onTimeChange,
  className
}: SimpleDatePickerProps) {
  
  // Smart date formatting for display
  const formatDisplayValue = (dateStr: string) => {
    if (!dateStr) return ""
    
    const date = new Date(dateStr + 'T00:00:00')
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow"
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
    
    const daysDiff = Math.abs(date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    if (daysDiff < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' })
    }
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const displayValue = value ? formatDisplayValue(value) : placeholder

  return (
    <div className={`w-full max-w-xs ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {label}
        </Label>
      )}
      
      <div className="space-y-3">
        {/* Date Input - Native and Simple */}
        <div className="relative">
          <input
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-10 px-3 pr-10 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none bg-white text-gray-900 cursor-pointer hover:border-gray-300"
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          
          {/* Display smart label below input */}
          {value && (
            <div className="text-xs text-gray-500 mt-1 pl-1">
              {displayValue}
            </div>
          )}
        </div>

        {/* Time Input - Native and Simple */}
        {showTime && (
          <div className="relative">
            <input
              type="time"
              value={timeValue || ""}
              onChange={(e) => onTimeChange?.(e.target.value)}
              className="w-full h-10 px-3 pr-10 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none bg-white text-gray-900 cursor-pointer hover:border-gray-300"
            />
            <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  )
}