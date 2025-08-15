import { Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    <Card className="w-full max-w-md bg-gradient-to-br from-emerald-50 to-emerald-100">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-500" />
          Prayer Times
        </CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>Current Location</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {prayers.map((prayer) => (
          <div
            key={prayer.name}
            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              prayer.current
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
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
                    ? "bg-amber-600 animate-pulse"
                    : "bg-muted-foreground"
                }`}
              />
              <span className="font-medium">{prayer.name}</span>
            </div>
            <span className="font-mono text-sm font-semibold">{prayer.time}</span>
          </div>
        ))}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Current time: {currentTime}
        </div>
        </CardContent>
    </Card>
  )
}

export default PrayerTimes