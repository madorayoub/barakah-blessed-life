import { Clock, MapPin } from "lucide-react"
import { IslamicCard, IslamicCardContent, IslamicCardHeader, IslamicCardTitle } from "@/components/ui/islamic-card"

const PrayerTimes = () => {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  })

  const prayers = [
    { name: "Fajr", time: "05:30", completed: true },
    { name: "Dhuhr", time: "12:45", completed: true },
    { name: "Asr", time: "15:30", completed: false, current: true },
    { name: "Maghrib", time: "18:15", completed: false },
    { name: "Isha", time: "19:45", completed: false },
  ]

  return (
    <IslamicCard variant="prayer" className="w-full max-w-md">
      <IslamicCardHeader className="pb-4">
        <IslamicCardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" />
          Prayer Times
        </IslamicCardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>Current Location</span>
        </div>
      </IslamicCardHeader>
      <IslamicCardContent className="space-y-3">
        {prayers.map((prayer) => (
          <div
            key={prayer.name}
            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              prayer.current
                ? "gradient-gold text-accent-foreground shadow-blessed"
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
              <span className="font-display font-medium">{prayer.name}</span>
            </div>
            <span className="font-mono text-sm font-semibold">{prayer.time}</span>
          </div>
        ))}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Current time: {currentTime}
        </div>
      </IslamicCardContent>
    </IslamicCard>
  )
}

export default PrayerTimes