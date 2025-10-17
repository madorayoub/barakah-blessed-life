import { Calendar, Clock } from 'lucide-react'
import { Label } from '@/components/ui/label'

interface ModernDatePickerProps {
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
}: ModernDatePickerProps) {
  
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

  const displayValue = value ? formatDisplayValue(value) : ""

  return (
    <div className={`w-full max-w-sm ${className}`}>
      {label && (
        <Label className="text-sm font-semibold text-foreground mb-3 block">
          {label}
        </Label>
      )}
      
      <div className="space-y-3">
        {/* Beautiful Date Input - Asana Style */}
        <div className="relative group">
          <input
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-12 px-4 pr-12 bg-muted border border-border rounded-lg text-sm font-medium text-foreground placeholder:text-muted-foreground cursor-pointer transition-all duration-200 hover:bg-muted/80 hover:border-primary/40 focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
          <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-hover:text-foreground transition-colors" />
          
          {/* Smart Label Display */}
          {value && displayValue && (
            <div className="absolute left-4 -bottom-6 text-xs font-medium text-primary bg-card px-2 py-1 rounded-md shadow-sm border border-primary/20">
              ✨ {displayValue}
            </div>
          )}
        </div>

        {/* Beautiful Time Input - Asana Style */}
        {showTime && (
          <div className="relative group">
            <input
              type="time"
              value={timeValue || ""}
              onChange={(e) => onTimeChange?.(e.target.value)}
              className="w-full h-12 px-4 pr-12 bg-muted border border-border rounded-lg text-sm font-medium text-foreground cursor-pointer transition-all duration-200 hover:bg-muted/80 hover:border-primary/40 focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
            <Clock className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-hover:text-foreground transition-colors" />
            
            {/* Time Display Helper */}
            {timeValue && (
              <div className="absolute right-14 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                {new Date(`2000-01-01T${timeValue}`).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}