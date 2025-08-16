import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

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

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function ModernDatePicker({ 
  value, 
  onChange, 
  placeholder = "Select date", 
  label,
  showTime = false,
  timeValue,
  onTimeChange,
  className 
}: ModernDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value + 'T00:00:00') : null
  )

  useEffect(() => {
    if (value) {
      const date = new Date(value + 'T00:00:00')
      setSelectedDate(date)
      setCurrentMonth(date.getMonth())
      setCurrentYear(date.getFullYear())
    }
  }, [value])

  const generateCalendarDays = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    const dateString = date.toISOString().split('T')[0]
    onChange(dateString)
    if (!showTime) {
      setIsOpen(false)
    }
  }

  const handleToday = () => {
    const today = new Date()
    handleDateSelect(today)
  }

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
    // Add more keyboard navigation later if needed
    // Arrow keys, Enter for selection, etc.
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const getSmartDateLabel = (date: Date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow" 
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
    
    // Show weekday if within current week
    const daysDiff = Math.abs(date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    if (daysDiff < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' })
    }
    
    // Show full date for distant dates
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return placeholder
    return getSmartDateLabel(date)
  }

  const calendarDays = generateCalendarDays(currentMonth, currentYear)

  return (
    <div className={cn("space-y-2 max-w-80", className)}>
      {label && (
        <Label className="text-sm font-medium text-foreground">{label}</Label>
      )}
      
      <div className="flex gap-2">
        {/* Date Picker */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-10 border-2 border-border hover:border-primary transition-colors max-w-64",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              {formatDisplayDate(selectedDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0 bg-white shadow-xl border-2 border-border max-w-80" 
            align="start"
            onKeyDown={handleKeyDown}
          >
            <Card>
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPreviousMonth}
                    className="h-8 w-8 hover:bg-primary/10 text-primary"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="text-sm font-semibold text-foreground">
                    {MONTHS[currentMonth]} {currentYear}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNextMonth}
                    className="h-8 w-8 hover:bg-primary/10 text-primary"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Today Button */}
                <div className="mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToday}
                    className="w-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    Today
                  </Button>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map(day => (
                    <div 
                      key={day} 
                      className="h-10 flex items-center justify-center text-xs font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((date, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="icon"
                      onClick={() => date && handleDateSelect(date)}
                      disabled={!date}
                      className={cn(
                        "h-11 w-11 p-0 font-normal text-sm transition-all duration-200",
                        date && isToday(date) && "ring-2 ring-primary ring-offset-2",
                        date && isSelected(date) && "bg-primary text-white hover:bg-primary/90",
                        date && !isSelected(date) && "hover:bg-primary/10 hover:text-primary",
                        !date && "invisible"
                      )}
                    >
                      {date?.getDate()}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>

        {/* Time Picker (if enabled) */}
        {showTime && (
          <div className="flex-shrink-0">
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
              <Input
                type="time"
                value={timeValue || ''}
                onChange={(e) => onTimeChange?.(e.target.value)}
                className="pl-10 h-10 w-32 border-2 border-border focus:border-primary"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}