import { useState } from "react"
import { Bell, Volume2, Smartphone } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const Preferences = () => {
  const [preferences, setPreferences] = useState({
    notifications: true,
    adhan: true,
    reminderMinutes: "15",
    weeklyGoals: true,
    calendarSync: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Preferences set:", preferences)
    // Redirect to dashboard after completion
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-6">
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mb-8">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <div className="w-3 h-3 rounded-full bg-primary"></div>
        </div>

        <div className="text-center">
          <Bell className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold">Notification Preferences</h1>
          <p className="text-muted-foreground mt-2">
            Customize how you'd like to be reminded
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {/* Prayer Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Prayer Notifications</Label>
                <div className="text-sm text-muted-foreground">
                  Get notified when it's prayer time
                </div>
              </div>
              <Switch
                checked={preferences.notifications}
                onCheckedChange={(checked) => 
                  setPreferences({...preferences, notifications: checked})
                }
              />
            </div>

            {/* Adhan Sound */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Adhan Sound</Label>
                <div className="text-sm text-muted-foreground">
                  Play Adhan for prayer notifications
                </div>
              </div>
              <Switch
                checked={preferences.adhan}
                onCheckedChange={(checked) => 
                  setPreferences({...preferences, adhan: checked})
                }
                disabled={!preferences.notifications}
              />
            </div>

            {/* Reminder Time */}
            {preferences.notifications && (
              <div className="space-y-2">
                <Label>Reminder Time</Label>
                <Select 
                  value={preferences.reminderMinutes}
                  onValueChange={(value) => 
                    setPreferences({...preferences, reminderMinutes: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes before</SelectItem>
                    <SelectItem value="10">10 minutes before</SelectItem>
                    <SelectItem value="15">15 minutes before</SelectItem>
                    <SelectItem value="30">30 minutes before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Weekly Goals */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Weekly Goals</Label>
                <div className="text-sm text-muted-foreground">
                  Set Quran reading and dhikr goals
                </div>
              </div>
              <Switch
                checked={preferences.weeklyGoals}
                onCheckedChange={(checked) => 
                  setPreferences({...preferences, weeklyGoals: checked})
                }
              />
            </div>

            {/* Calendar Sync */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Calendar Integration</Label>
                <div className="text-sm text-muted-foreground">
                  Sync with your external calendars
                </div>
              </div>
              <Switch
                checked={preferences.calendarSync}
                onCheckedChange={(checked) => 
                  setPreferences({...preferences, calendarSync: checked})
                }
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Complete Setup
          </Button>
        </form>

        <div className="text-center">
          <Link to="/onboarding/prayer-method" className="text-sm text-muted-foreground hover:underline">
            ← Back to prayer method
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Preferences