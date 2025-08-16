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
    
    // Force immediate UI update by updating current month/year if needed
    setCurrentMonth(date.getMonth())
    setCurrentYear(date.getFullYear())
    
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
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen(!isOpen)
    }
  }

  const handleInputClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(!isOpen)
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
    <div className={cn("space-y-2 w-full max-w-80", className)}>
      {label && (
        <Label className="text-sm font-medium text-gray-700 block">{label}</Label>
      )}
      
      <div className="flex gap-2">
        {/* Date Picker with Large Click Target */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              onClick={handleInputClick}
              onKeyDown={handleKeyDown}
              className={cn(
                "w-full min-h-[48px] justify-between text-left font-normal border-2 border-gray-200 rounded-lg px-4 py-3 hover:border-primary focus:border-primary transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-primary/20",
                !selectedDate && "text-gray-500"
              )}
              role="combobox"
              aria-expanded={isOpen}
              aria-label="Open date picker"
            >
              <span className="text-gray-900 font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                {formatDisplayDate(selectedDate)}
              </span>
              <div className="h-5 w-5 text-gray-400">
                {isOpen ? "📅" : "▼"}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0 border border-gray-200 shadow-xl rounded-xl max-w-80 bg-white" 
            align="start"
            onKeyDown={handleKeyDown}
            sideOffset={4}
          >
            <Card className="border-0 shadow-none">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPreviousMonth}
                    className="h-9 w-9 hover:bg-gray-100 text-gray-600 hover:text-primary rounded-lg"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="text-base font-semibold text-gray-900">
                    {MONTHS[currentMonth]} {currentYear}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNextMonth}
                    className="h-9 w-9 hover:bg-gray-100 text-gray-600 hover:text-primary rounded-lg"
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
                    className="w-full border border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors rounded-lg font-medium"
                  >
                    Today
                  </Button>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map(day => (
                    <div 
                      key={day} 
                      className="h-10 flex items-center justify-center text-xs font-semibold text-gray-600"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((date, index) => (
                    <button
                      key={index}
                      onClick={() => date && handleDateSelect(date)}
                      disabled={!date}
                      className={cn(
                        "h-10 w-10 flex items-center justify-center rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer",
                        date && isToday(date) && "border-2 border-primary font-bold text-primary",
                        date && isSelected(date) && "bg-primary text-white hover:bg-primary/90 shadow-md",
                        date && !isSelected(date) && !isToday(date) && "hover:bg-gray-100 text-gray-700",
                        date && !isSelected(date) && isToday(date) && "hover:bg-primary/10",
                        !date && "invisible cursor-default"
                      )}
                      type="button"
                    >
                      {date?.getDate()}
                    </button>
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
                className="pl-10 h-12 w-32 border-2 border-gray-200 focus:border-primary rounded-lg bg-white text-gray-900"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}