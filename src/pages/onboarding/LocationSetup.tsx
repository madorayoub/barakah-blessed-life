import { useState } from "react"
import { MapPin, Navigation, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const LocationSetup = () => {
  const [location, setLocation] = useState("")
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedLocation, setDetectedLocation] = useState("")

  const handleDetectLocation = async () => {
    setIsDetecting(true)
    // Simulate location detection
    setTimeout(() => {
      setDetectedLocation("New York, NY, USA")
      setLocation("New York, NY, USA")
      setIsDetecting(false)
    }, 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Location set to:", location)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-6">
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mb-8">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold">Set Your Location</h1>
          <p className="text-muted-foreground mt-2">
            We need your location to calculate accurate prayer times
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="w-full"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Detecting location...
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Use my current location
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">City, Country</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., London, UK"
                  className="pl-10"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={!location}>
            Continue
          </Button>
        </form>

        <div className="text-center">
          <Link to="/auth/signup" className="text-sm text-muted-foreground hover:underline">
            ← Back to signup
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LocationSetup