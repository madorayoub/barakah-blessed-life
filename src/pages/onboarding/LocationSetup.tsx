import { useState, useEffect } from "react"
import { MapPin, Navigation, Loader2, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

const LocationSetup = () => {
  const [location, setLocation] = useState("")
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedLocation, setDetectedLocation] = useState("")
  const [locationError, setLocationError] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { toast } = useToast()

  // Sample city data for autocomplete (in production, use a proper API)
  const cityData = [
    "Marrakech, Morocco", "Casablanca, Morocco", "Rabat, Morocco",
    "London, UK", "Manchester, UK", "Birmingham, UK",
    "New York, NY, USA", "Los Angeles, CA, USA", "Chicago, IL, USA",
    "Dubai, UAE", "Abu Dhabi, UAE", "Sharjah, UAE",
    "Istanbul, Turkey", "Ankara, Turkey", "Izmir, Turkey",
    "Cairo, Egypt", "Alexandria, Egypt", "Giza, Egypt",
    "Riyadh, Saudi Arabia", "Jeddah, Saudi Arabia", "Mecca, Saudi Arabia",
    "Medina, Saudi Arabia", "Dammam, Saudi Arabia",
    "Doha, Qatar", "Kuwait City, Kuwait", "Manama, Bahrain",
    "Muscat, Oman", "Amman, Jordan", "Damascus, Syria",
    "Beirut, Lebanon", "Baghdad, Iraq", "Tehran, Iran",
    "Karachi, Pakistan", "Lahore, Pakistan", "Islamabad, Pakistan",
    "Dhaka, Bangladesh", "Jakarta, Indonesia", "Kuala Lumpur, Malaysia"
  ]

  const handleLocationInput = (value: string) => {
    setLocation(value)
    if (value.length >= 2) {
      const filtered = cityData.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5)
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (suggestion: string) => {
    setLocation(suggestion)
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleDetectLocation = async () => {
    setIsDetecting(true)
    setLocationError("")
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser")
      setIsDetecting(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // Use reverse geocoding to get city name
          // For now, we'll use a simple approximation
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          
          if (response.ok) {
            const data = await response.json()
            const cityName = `${data.city || data.locality}, ${data.countryName}`
            setDetectedLocation(cityName)
            setLocation(cityName)
            toast({
              title: "Location detected",
              description: `Found your location: ${cityName}`,
            })
          } else {
            throw new Error("Failed to get location name")
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error)
          setDetectedLocation("Location detected (coordinates only)")
          setLocation("Location detected (coordinates only)")
          toast({
            title: "Location detected",
            description: "Location found but couldn't determine city name. Please enter manually.",
          })
        } finally {
          setIsDetecting(false)
        }
      },
      (error) => {
        let errorMessage = ""
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services and try again."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please enter your location manually."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again or enter manually."
            break
          default:
            errorMessage = "An unknown error occurred while detecting location."
            break
        }
        setLocationError(errorMessage)
        setIsDetecting(false)
        toast({
          title: "Location detection failed",
          description: errorMessage,
          variant: "destructive"
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
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
                  placeholder="e.g., Marrakech, Morocco"
                  className="pl-10"
                  value={location}
                  onChange={(e) => handleLocationInput(e.target.value)}
                  onFocus={() => location.length >= 2 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  required
                />
                
                {/* Autocomplete suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Location Error Alert */}
            {locationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{locationError}</AlertDescription>
              </Alert>
            )}
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