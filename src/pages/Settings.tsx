import { useState, useEffect } from "react"
import { ArrowLeft, MapPin, Navigation, Loader2, Bell, Volume2, User, Clock, BookOpen, Heart, Shield, Settings as SettingsIcon, Star, Info, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { AppHeader } from "@/components/AppHeader"

const Settings = () => {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [autoSaving, setAutoSaving] = useState(false)

  const [profile, setProfile] = useState({
    display_name: '',
    location_city: '',
    location_country: '',
    difficulty_mode: 'basic'
  })

  const [prayerSettings, setPrayerSettings] = useState({
    calculation_method: 'ISNA',
    madhab: 'Shafi',
    high_latitude_rule: 'MiddleOfTheNight',
    fajr_adjustment: 0,
    dhuhr_adjustment: 0,
    asr_adjustment: 0,
    maghrib_adjustment: 0,
    isha_adjustment: 0,
    notifications_enabled: true,
    notification_minutes_before: 10
  })

  // Load user data
  useEffect(() => {
    async function loadUserData() {
      if (!user) return

      try {
        // Load profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (profileData) {
          setProfile({
            display_name: profileData.display_name || '',
            location_city: profileData.location_city || '',
            location_country: profileData.location_country || '',
            difficulty_mode: profileData.difficulty_mode || 'basic'
          })
        }

        // Load prayer settings
        const { data: settingsData } = await supabase
          .from('prayer_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (settingsData) {
          setPrayerSettings({
            calculation_method: settingsData.calculation_method || 'ISNA',
            madhab: settingsData.madhab || 'Shafi',
            high_latitude_rule: settingsData.high_latitude_rule || 'MiddleOfTheNight',
            fajr_adjustment: settingsData.fajr_adjustment || 0,
            dhuhr_adjustment: settingsData.dhuhr_adjustment || 0,
            asr_adjustment: settingsData.asr_adjustment || 0,
            maghrib_adjustment: settingsData.maghrib_adjustment || 0,
            isha_adjustment: settingsData.isha_adjustment || 0,
            notifications_enabled: settingsData.notifications_enabled ?? true,
            notification_minutes_before: settingsData.notification_minutes_before || 10
          })
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load settings"
        })
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [user])

  const autoSaveSettings = async (updates: any) => {
    if (!user || autoSaving) return

    setAutoSaving(true)
    try {
      // Update profile if profile updates are included
      if (updates.profile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(updates.profile)
          .eq('user_id', user.id)

        if (profileError) throw profileError
      }

      // Update prayer settings if prayer settings are included
      if (updates.prayerSettings) {
        const { error: settingsError } = await supabase
          .from('prayer_settings')
          .upsert({
            user_id: user.id,
            ...updates.prayerSettings
          })

        if (settingsError) throw settingsError
      }

      // Show brief success indicator
      toast({
        title: "Saved ✓",
        description: "Settings updated automatically",
        duration: 2000
      })
    } catch (error) {
      console.error('Error auto-saving settings:', error)
      toast({
        variant: "destructive",
        title: "Auto-save failed",
        description: "Please try again or refresh the page"
      })
    } finally {
      setAutoSaving(false)
    }
  }

  // Auto-save functions for different setting types
  const updateProfile = (updates: any) => {
    setProfile(prev => ({ ...prev, ...updates }))
    autoSaveSettings({ profile: updates })
  }

  const updatePrayerSettings = (updates: any) => {
    setPrayerSettings(prev => ({ ...prev, ...updates }))
    autoSaveSettings({ prayerSettings: updates })
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          try {
            // Use reverse geocoding to get city name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            )
            
            if (response.ok) {
              const data = await response.json()
              const cityName = data.city || data.locality
              const countryName = data.countryName
              
              updateProfile({
                location_city: cityName,
                location_country: countryName,
                location_latitude: latitude,
                location_longitude: longitude
              })
              
              toast({
                title: "Location detected",
                description: `Found: ${cityName}, ${countryName}`,
              })
            } else {
              throw new Error("Failed to get location name")
            }
          } catch (error) {
            console.error('Reverse geocoding failed:', error)
            updateProfile({
              location_latitude: latitude,
              location_longitude: longitude
            })
            toast({
              title: "Location detected",
              description: "Location coordinates saved. Please enter city manually.",
            })
          }
        },
        (error) => {
          let errorMessage = ""
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location services."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable."
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out."
              break
            default:
              errorMessage = "An unknown error occurred while detecting location."
              break
          }
          toast({
            variant: "destructive",
            title: "Location detection failed",
            description: errorMessage
          })
        }
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title="Settings" 
        subtitle="Manage your preferences and account" 
      />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Manage your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={profile.display_name}
                    onChange={(e) => updateProfile({ display_name: e.target.value })}
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location_city">City</Label>
                  <Input
                    id="location_city"
                    value={profile.location_city}
                    onChange={(e) => updateProfile({ location_city: e.target.value })}
                    placeholder="e.g., Marrakech"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location_country">Country</Label>
                  <Input
                    id="location_country"
                    value={profile.location_country}
                    onChange={(e) => updateProfile({ location_country: e.target.value })}
                    placeholder="e.g., Morocco"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty_mode">App Experience Level</Label>
                  <Select
                    value={profile.difficulty_mode}
                    onValueChange={(value) => updateProfile({ difficulty_mode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic - 5 Daily Prayers</SelectItem>
                      <SelectItem value="advanced">Advanced - Full Islamic Practice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Auto-detect Location</p>
                  <p className="text-sm text-muted-foreground">
                    Use GPS to automatically set your location for prayer times
                  </p>
                </div>
                <Button onClick={getCurrentLocation} variant="outline">
                  <Navigation className="h-4 w-4 mr-2" />
                  Detect Location
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Prayer Time Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Prayer Time Settings
              </CardTitle>
              <CardDescription>
                Customize calculation methods and adjust prayer times
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Calculation Method</Label>
                  <Select
                    value={prayerSettings.calculation_method}
                    onValueChange={(value) => updatePrayerSettings({ calculation_method: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ISNA">ISNA (Islamic Society of North America)</SelectItem>
                      <SelectItem value="MWL">Muslim World League</SelectItem>
                      <SelectItem value="Karachi">University of Karachi</SelectItem>
                      <SelectItem value="UmmAlQura">Umm Al-Qura (Makkah)</SelectItem>
                      <SelectItem value="Egyptian">Egyptian General Survey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Madhab (Jurisprudence School)</Label>
                  <Select
                    value={prayerSettings.madhab}
                    onValueChange={(value) => updatePrayerSettings({ madhab: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Shafi">Shafi</SelectItem>
                      <SelectItem value="Hanafi">Hanafi</SelectItem>
                      <SelectItem value="Maliki">Maliki</SelectItem>
                      <SelectItem value="Hanbali">Hanbali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Prayer Time Adjustments (minutes)</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Fajr: {prayerSettings.fajr_adjustment > 0 ? '+' : ''}{prayerSettings.fajr_adjustment}min</Label>
                    <Slider
                      value={[prayerSettings.fajr_adjustment]}
                      onValueChange={([value]) => updatePrayerSettings({ fajr_adjustment: value })}
                      min={-15}
                      max={15}
                      step={1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Dhuhr: {prayerSettings.dhuhr_adjustment > 0 ? '+' : ''}{prayerSettings.dhuhr_adjustment}min</Label>
                    <Slider
                      value={[prayerSettings.dhuhr_adjustment]}
                      onValueChange={([value]) => updatePrayerSettings({ dhuhr_adjustment: value })}
                      min={-15}
                      max={15}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Asr: {prayerSettings.asr_adjustment > 0 ? '+' : ''}{prayerSettings.asr_adjustment}min</Label>
                    <Slider
                      value={[prayerSettings.asr_adjustment]}
                      onValueChange={([value]) => updatePrayerSettings({ asr_adjustment: value })}
                      min={-15}
                      max={15}
                      step={1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Maghrib: {prayerSettings.maghrib_adjustment > 0 ? '+' : ''}{prayerSettings.maghrib_adjustment}min</Label>
                    <Slider
                      value={[prayerSettings.maghrib_adjustment]}
                      onValueChange={([value]) => updatePrayerSettings({ maghrib_adjustment: value })}
                      min={-15}
                      max={15}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Isha: {prayerSettings.isha_adjustment > 0 ? '+' : ''}{prayerSettings.isha_adjustment}min</Label>
                    <Slider
                      value={[prayerSettings.isha_adjustment]}
                      onValueChange={([value]) => updatePrayerSettings({ isha_adjustment: value })}
                      min={-15}
                      max={15}
                      step={1}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Prayer Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive reminders before prayer times</p>
                </div>
                <Switch
                  id="notifications"
                  checked={prayerSettings.notifications_enabled}
                  onCheckedChange={(checked) => updatePrayerSettings({ notifications_enabled: checked })}
                />
              </div>

              {prayerSettings.notifications_enabled && (
                <div className="space-y-2">
                  <Label>Notification timing: {prayerSettings.notification_minutes_before} minutes before</Label>
                  <Slider
                    value={[prayerSettings.notification_minutes_before]}
                    onValueChange={([value]) => updatePrayerSettings({ notification_minutes_before: value })}
                    min={5}
                    max={30}
                    step={5}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Help & Support
              </CardTitle>
              <CardDescription>
                Get help and provide feedback to improve Barakah Tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/help')}
                  className="flex items-center gap-2 justify-start"
                >
                  <BookOpen className="h-4 w-4" />
                  Help & FAQ
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/app-info')}
                  className="flex items-center gap-2 justify-start"
                >
                  <Info className="h-4 w-4" />
                  App Information
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/privacy')}
                  className="flex items-center gap-2 justify-start"
                >
                  <Shield className="h-4 w-4" />
                  Privacy Policy
                </Button>
              </div>
              
              {/* Feedback Section */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-lg border border-emerald-200">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-emerald-600" />
                  Share Your Feedback
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Help us improve Barakah Tasks by sharing your thoughts, suggestions, or reporting issues.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => window.open('mailto:feedback@barakahtasks.com?subject=Barakah Tasks Feedback', '_blank')}
                  >
                    Send Feedback
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open('mailto:support@barakahtasks.com?subject=Barakah Tasks Support Request', '_blank')}
                  >
                    Get Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-destructive" />
                Account Actions
              </CardTitle>
              <CardDescription>
                Manage your account security and session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div>
                  <h4 className="font-medium">Sign Out</h4>
                  <p className="text-sm text-muted-foreground">
                    End your current session and return to login
                  </p>
                </div>
                <Button
                  onClick={signOut}
                  variant="destructive"
                  size="sm"
                  className="ml-4"
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* App Information */}
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" fill="currentColor" />
                  </div>
                  <h3 className="font-bold text-lg">Barakah Tasks</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Version 1.0.0 • Built with love for the Muslim community
                </p>
                <p className="text-xs text-muted-foreground italic">
                  "And whoever relies upon Allah - then He is sufficient for him." - Quran 65:3
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}

export default Settings