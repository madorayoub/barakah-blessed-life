// @deprecated Legacy onboarding page. Use src/components/Onboarding.tsx instead.
import { useState } from "react"
import { Clock } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PrayerMethod = () => {
  const [selectedMethod, setSelectedMethod] = useState("")

  const methods = [
    { value: "mwl", name: "Muslim World League", description: "Most widely used" },
    { value: "isna", name: "Islamic Society of North America", description: "For North America" },
    { value: "egypt", name: "Egyptian General Authority", description: "Egyptian method" },
    { value: "karachi", name: "University of Karachi", description: "For Pakistan/India" },
    { value: "tehran", name: "Institute of Geophysics, Tehran", description: "For Iran" },
    { value: "jafari", name: "Shia Ithna Ashari", description: "Shia method" }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Prayer method selected:", selectedMethod)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-6">
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mb-8">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
        </div>

        <div className="text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold">Prayer Calculation Method</h1>
          <p className="text-muted-foreground mt-2">
            Choose the calculation method used in your region
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="method">Calculation Method</Label>
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select a method" />
              </SelectTrigger>
              <SelectContent>
                {methods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-xs text-muted-foreground">{method.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMethod && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Preview Times (Today)</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Fajr</span>
                  <span>5:30 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Dhuhr</span>
                  <span>12:45 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Asr</span>
                  <span>3:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Maghrib</span>
                  <span>6:15 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Isha</span>
                  <span>7:45 PM</span>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!selectedMethod}>
            Continue
          </Button>
        </form>

        <div className="text-center">
          <Link to="/onboarding/location-setup" className="text-sm text-muted-foreground hover:underline">
            ← Back to location
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PrayerMethod