import { useState } from "react"
import { Calendar, Download, ExternalLink, Settings, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IslamicCard, IslamicCardContent, IslamicCardHeader, IslamicCardTitle } from "@/components/ui/islamic-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CalendarIntegration = () => {
  const [selectedCalendar, setSelectedCalendar] = useState("")
  const [isExported, setIsExported] = useState(false)

  const calendarOptions = [
    { value: "google", label: "Google Calendar", icon: "🌟" },
    { value: "apple", label: "Apple Calendar", icon: "🍎" },
    { value: "outlook", label: "Microsoft Outlook", icon: "📧" },
    { value: "ics", label: "Download ICS File", icon: "📥" }
  ]

  const handleExport = () => {
    // Simulate calendar export
    setIsExported(true)
    setTimeout(() => setIsExported(false), 3000)
  }

  const subscriptionUrl = "https://barakah-tasks.app/calendar/user123.ics"

  return (
    <IslamicCard variant="blessed" className="w-full max-w-lg">
      <IslamicCardHeader>
        <IslamicCardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Integration
        </IslamicCardTitle>
        <p className="text-sm opacity-90">
          Sync your spiritual schedule with your daily calendar
        </p>
      </IslamicCardHeader>
      <IslamicCardContent className="space-y-4">
        
        {/* Calendar Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Choose Your Calendar</label>
          <Select value={selectedCalendar} onValueChange={setSelectedCalendar}>
            <SelectTrigger className="bg-card/50 border-primary-foreground/20">
              <SelectValue placeholder="Select calendar platform" />
            </SelectTrigger>
            <SelectContent>
              {calendarOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subscription URL Display */}
        {selectedCalendar && (
          <div className="space-y-3 p-4 bg-card/30 rounded-lg border border-primary-foreground/20">
            <div className="text-sm font-medium">Your Personal Calendar Feed</div>
            <div className="flex gap-2 text-xs">
              <code className="flex-1 p-2 bg-card/50 rounded text-primary-foreground/80 break-all">
                {subscriptionUrl}
              </code>
              <Button size="sm" variant="outline" className="shrink-0 text-primary-foreground border-primary-foreground/20">
                Copy
              </Button>
            </div>
          </div>
        )}

        {/* What Gets Synced */}
        <div className="space-y-2">
          <div className="text-sm font-medium">What gets synced:</div>
          <div className="space-y-1 text-xs opacity-90">
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3" />
              <span>5 Daily Prayer Times</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3" />
              <span>Islamic Calendar Events</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3" />
              <span>Spiritual Goals & Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3" />
              <span>Quran Reading Schedule</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleExport}
            disabled={!selectedCalendar}
            className={`flex-1 transition-all duration-300 ${
              isExported 
                ? "bg-green-600 text-white" 
                : "bg-card/50 text-primary-foreground border border-primary-foreground/20 hover:bg-card/70"
            }`}
          >
            {isExported ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Synced!
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Calendar
              </>
            )}
          </Button>
          <Button size="icon" variant="outline" className="text-primary-foreground border-primary-foreground/20">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Help Link */}
        <div className="text-center">
          <Button variant="link" className="text-xs text-primary-foreground/70 hover:text-primary-foreground">
            <ExternalLink className="h-3 w-3 mr-1" />
            Setup Guide
          </Button>
        </div>
      </IslamicCardContent>
    </IslamicCard>
  )
}

export default CalendarIntegration