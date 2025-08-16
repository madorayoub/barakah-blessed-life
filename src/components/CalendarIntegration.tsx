import { useState } from "react"
import { Calendar, Download, ExternalLink, Settings, Check, Smartphone, Globe, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IslamicCard, IslamicCardContent, IslamicCardHeader, IslamicCardTitle } from "@/components/ui/islamic-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar"
import { useAppleCalendarSubscription } from "@/hooks/useAppleCalendarSubscription"
import { useAuth } from "@/hooks/useAuth"

const CalendarIntegration = () => {
  const [selectedCalendar, setSelectedCalendar] = useState("")
  const [syncOptions, setSyncOptions] = useState({
    includePrayers: true,
    includeTasks: true,
    days: 30,
    includeReminders: true,
    reminderMinutes: 10
  })

  const { user } = useAuth()
  const { 
    isAuthorized: isGoogleAuthorized, 
    isLoading: isGoogleLoading,
    signIn: signInGoogle,
    signOut: signOutGoogle,
    syncAll: syncGoogleAll
  } = useGoogleCalendar()
  
  const { 
    isConnected: isAppleConnected,
    subscriptionUrl,
    generateSubscriptionUrl,
    openAppleCalendar,
    isGenerating: isAppleGenerating
  } = useAppleCalendarSubscription()

  const handleGoogleSync = async () => {
    if (isGoogleAuthorized) {
      await syncGoogleAll()
    } else {
      await signInGoogle()
    }
  }

  const handleAppleConnect = async () => {
    if (isAppleConnected) {
      // Already connected, open calendar
      openAppleCalendar()
    } else {
      // Connect for the first time
      await generateSubscriptionUrl()
    }
  }

  const subscriptionUrlDisplay = subscriptionUrl || "Connect to get your subscription URL"

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
      <IslamicCardContent className="space-y-6">
        
        {/* Sync Options */}
        <div className="space-y-4">
          <label className="text-sm font-medium">Sync Options</label>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm">Prayer Times</div>
                <div className="text-xs text-muted-foreground">Include 5 daily prayers</div>
              </div>
              <Switch 
                checked={syncOptions.includePrayers}
                onCheckedChange={(checked) => setSyncOptions(prev => ({ ...prev, includePrayers: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm">Tasks & Goals</div>
                <div className="text-xs text-muted-foreground">Include personal tasks</div>
              </div>
              <Switch 
                checked={syncOptions.includeTasks}
                onCheckedChange={(checked) => setSyncOptions(prev => ({ ...prev, includeTasks: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm">Reminders</div>
                <div className="text-xs text-muted-foreground">Get notifications before events</div>
              </div>
              <Switch 
                checked={syncOptions.includeReminders}
                onCheckedChange={(checked) => setSyncOptions(prev => ({ ...prev, includeReminders: checked }))}
              />
            </div>
            
            {syncOptions.includeReminders && (
              <div className="space-y-2 ml-4">
                <div className="text-sm">Reminder Time: {syncOptions.reminderMinutes} minutes before</div>
                <Slider
                  value={[syncOptions.reminderMinutes]}
                  onValueChange={([value]) => setSyncOptions(prev => ({ ...prev, reminderMinutes: value }))}
                  max={60}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <div className="text-sm">Sync Duration: {syncOptions.days} days</div>
              <Slider
                value={[syncOptions.days]}
                onValueChange={([value]) => setSyncOptions(prev => ({ ...prev, days: value }))}
                max={90}
                min={7}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Google Calendar Integration */}
        <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <div className="text-sm font-medium text-blue-900">Google Calendar</div>
            <Badge variant={isGoogleAuthorized ? "default" : "secondary"}>
              {isGoogleAuthorized ? "Connected" : "Not Connected"}
            </Badge>
          </div>
          
          <div className="text-xs text-blue-700 mb-3">
            Real-time sync with automatic updates when you change prayer times or tasks
          </div>
          
          <Button 
            onClick={handleGoogleSync}
            disabled={isGoogleLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isGoogleLoading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                {isGoogleAuthorized ? "Syncing..." : "Connecting..."}
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 mr-2" />
                {isGoogleAuthorized ? "Sync Now" : "Connect Google Calendar"}
              </>
            )}
          </Button>
          
          {isGoogleAuthorized && (
            <Button 
              onClick={signOutGoogle}
              variant="outline"
              size="sm"
              className="w-full text-blue-600 border-blue-200"
            >
              Disconnect
            </Button>
          )}
        </div>

        {/* Apple Calendar Integration */}
        <div className="space-y-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-gray-600" />
            <div className="text-sm font-medium text-gray-900">Apple Calendar</div>
            <Badge variant={isAppleConnected ? "default" : "secondary"}>
              {isAppleConnected ? "Connected" : "Not Connected"}
            </Badge>
          </div>
          
          <div className="text-xs text-gray-700 mb-3">
            {isAppleConnected ? 'Subscription active - updates automatically' : 'One-click connection to Apple Calendar'}
          </div>
          
          <Button 
            onClick={handleAppleConnect}
            disabled={isAppleGenerating}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white"
          >
            {isAppleGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                {isAppleConnected ? "Opening..." : "Generating..."}
              </>
            ) : (
              <>
                <Smartphone className="h-4 w-4 mr-2" />
                {isAppleConnected ? "Open Calendar" : "Connect Apple Calendar"}
              </>
            )}
          </Button>
        </div>

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

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={handleGoogleSync}
            disabled={isGoogleLoading}
            variant="outline"
            size="sm"
          >
            <Globe className="h-4 w-4 mr-2" />
            Google Sync
          </Button>
          <Button 
            onClick={handleAppleConnect}
            disabled={isAppleGenerating}
            variant="outline"
            size="sm"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            {isAppleConnected ? "Apple Sync" : "Apple Connect"}
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