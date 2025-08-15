import { useState, useEffect } from "react"
import { Clock, MapPin, Settings, Volume2 } from "lucide-react"
import { IslamicCard, IslamicCardContent, IslamicCardHeader, IslamicCardTitle } from "@/components/ui/islamic-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

// Mock prayer times calculation (in real app, use Adhan library)
const calculatePrayerTimes = (calculationMethod: string) => {
  const now = new Date()
  const baseHour = 5 // Fajr base hour
  
  const methods = {
    "mwl": { name: "Muslim World League", offset: 0 },
    "karachi": { name: "University of Karachi", offset: 15 },
    "egyptian": { name: "Egyptian General Authority", offset: -10 },
    "dubai": { name: "Dubai (UAE)", offset: 5 }
  }

  return [
    { name: "Fajr", time: "05:30", completed: true, arabic: "الفجر" },
    { name: "Dhuhr", time: "12:45", completed: true, arabic: "الظهر" },
    { name: "Asr", time: "15:30", completed: false, current: true, arabic: "العصر" },
    { name: "Maghrib", time: "18:15", completed: false, arabic: "المغرب" },
    { name: "Isha", time: "19:45", completed: false, arabic: "العشاء" },
  ]
}

const AdvancedPrayerTimes = () => {
  const [calculationMethod, setCalculationMethod] = useState("mwl")
  const [location, setLocation] = useState("Current Location")
  const [prayers, setPrayers] = useState(calculatePrayerTimes("mwl"))
  const [settings, setSettings] = useState({
    adhanEnabled: true,
    reminderMinutes: 15,
    method: "mwl"
  })

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  })

  useEffect(() => {
    setPrayers(calculatePrayerTimes(calculationMethod))
  }, [calculationMethod])

  const calculationMethods = [
    { value: "mwl", label: "Muslim World League" },
    { value: "karachi", label: "University of Karachi" },
    { value: "egyptian", label: "Egyptian General Authority" },
    { value: "dubai", label: "Dubai (UAE)" }
  ]

  const nextPrayer = prayers.find(prayer => !prayer.completed)
  const completedToday = prayers.filter(prayer => prayer.completed).length

  return (
    <IslamicCard variant="prayer" className="w-full max-w-md">
      <IslamicCardHeader className="pb-4">
        <IslamicCardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            <span>Prayer Times</span>
          </div>
          <div className="text-sm font-normal">
            {completedToday}/5
          </div>
        </IslamicCardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{location}</span>
        </div>
        
        {/* Next Prayer Highlight */}
        {nextPrayer && (
          <div className="mt-3 p-3 gradient-gold rounded-lg text-accent-foreground">
            <div className="text-xs font-medium">Next Prayer</div>
            <div className="flex items-center justify-between">
              <span className="font-display text-lg">{nextPrayer.name}</span>
              <span className="font-mono text-lg font-bold">{nextPrayer.time}</span>
            </div>
          </div>
        )}
      </IslamicCardHeader>
      
      <IslamicCardContent className="space-y-4">
        {/* Prayer List */}
        <div className="space-y-2">
          {prayers.map((prayer) => (
            <div
              key={prayer.name}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                prayer.current
                  ? "gradient-gold text-accent-foreground shadow-blessed animate-prayer-pulse"
                  : prayer.completed
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    prayer.completed
                      ? "bg-primary"
                      : prayer.current
                      ? "bg-accent-foreground animate-pulse"
                      : "bg-muted-foreground"
                  }`}
                />
                <div>
                  <div className="font-display font-medium">{prayer.name}</div>
                  <div className="text-xs opacity-70">{prayer.arabic}</div>
                </div>
              </div>
              <span className="font-mono text-sm font-semibold">{prayer.time}</span>
            </div>
          ))}
        </div>

        {/* Settings Section */}
        <div className="pt-2 border-t space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Calculation Method</span>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <Select value={calculationMethod} onValueChange={setCalculationMethod}>
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {calculationMethods.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={settings.adhanEnabled ? "default" : "outline"}
              className="flex-1 text-xs"
              onClick={() => setSettings({...settings, adhanEnabled: !settings.adhanEnabled})}
            >
              <Volume2 className="h-3 w-3 mr-1" />
              Adhan {settings.adhanEnabled ? "On" : "Off"}
            </Button>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Current time: {currentTime}
        </div>
      </IslamicCardContent>
    </IslamicCard>
  )
}

export default AdvancedPrayerTimes