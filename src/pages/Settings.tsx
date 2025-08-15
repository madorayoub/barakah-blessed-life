import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, MapPin, Clock, Bell, User, Compass, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import { CalendarExport } from '@/components/CalendarExport'

interface UserProfile {
  display_name?: string
  location_city?: string
  location_country?: string
  location_latitude?: number
  location_longitude?: number
  difficulty_mode?: string
}

interface PrayerSettings {
  calculation_method: string
  madhab: string
  high_latitude_rule: string
  fajr_adjustment: number
  dhuhr_adjustment: number
  asr_adjustment: number
  maghrib_adjustment: number
  isha_adjustment: number
  notifications_enabled: boolean
  notification_minutes_before: number
}

const Settings = () => {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<UserProfile>({})
  const [prayerSettings, setPrayerSettings] = useState<PrayerSettings>({
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
          setProfile(profileData)
        }

        // Load prayer settings
        const { data: settingsData } = await supabase
          .from('prayer_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (settingsData) {
          setPrayerSettings({
            calculation_method: settingsData.calculation_method,
            madhab: settingsData.madhab,
            high_latitude_rule: settingsData.high_latitude_rule,
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

  const saveSettings = async () => {
    if (!user) return

    setSaving(true)
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: profile.display_name,
          location_city: profile.location_city,
          location_country: profile.location_country,
          difficulty_mode: profile.difficulty_mode
        })
        .eq('user_id', user.id)

      if (profileError) throw profileError

      // Update prayer settings
      const { error: settingsError } = await supabase
        .from('prayer_settings')
        .upsert({
          user_id: user.id,
          ...prayerSettings
        })

      if (settingsError) throw settingsError

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully"
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings"
      })
    } finally {
      setSaving(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          // Update profile with coordinates
          setProfile(prev => ({
            ...prev,
            location_latitude: latitude,
            location_longitude: longitude
          }))

          // Try to get city/country from coordinates (simplified)
          toast({
            title: "Location updated",
            description: "Your location has been detected and saved"
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          toast({
            variant: "destructive",
            title: "Location access denied", 
            description: "Please enable location access for accurate prayer times"
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
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <SettingsIcon className="h-6 w-6" />
                Settings
              </h1>
              <p className="text-muted-foreground">Customize your Islamic productivity experience</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveSettings} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button onClick={signOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={profile.display_name || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <Separator />

              {/* Difficulty Mode */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Difficulty Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your spiritual commitment level
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      profile.difficulty_mode === 'basic' ? 'border-primary bg-primary/5' : 'border-muted'
                    }`}
                    onClick={() => setProfile(prev => ({ ...prev, difficulty_mode: 'basic' }))}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Moon className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium">Basic Mode</h3>
                      {profile.difficulty_mode === 'basic' && (
                        <Badge variant="default" className="ml-auto">Selected</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Focus on the 5 daily prayers only. Perfect for beginners or busy schedules.
                    </p>
                  </div>
                  
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      profile.difficulty_mode === 'advanced' ? 'border-primary bg-primary/5' : 'border-muted'
                    }`}
                    onClick={() => setProfile(prev => ({ ...prev, difficulty_mode: 'advanced' }))}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sun className="h-5 w-5 text-amber-600" />
                      <h3 className="font-medium">Advanced Mode</h3>
                      {profile.difficulty_mode === 'advanced' && (
                        <Badge variant="default" className="ml-auto">Selected</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Include Sunnah prayers, Quran reading goals, dhikr, and additional Islamic practices.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Settings
              </CardTitle>
              <CardDescription>
                Set your location for accurate prayer times
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.location_city || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, location_city: e.target.value }))}
                    placeholder="Your city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={profile.location_country || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, location_country: e.target.value }))}
                    placeholder="Your country"
                  />
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
                  <Compass className="h-4 w-4 mr-2" />
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
              {/* Calculation Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calculation_method">Calculation Method</Label>
                  <Select
                    value={prayerSettings.calculation_method}
                    onValueChange={(value) => setPrayerSettings(prev => ({ ...prev, calculation_method: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ISNA">ISNA (North America)</SelectItem>
                      <SelectItem value="MuslimWorldLeague">Muslim World League</SelectItem>
                      <SelectItem value="Karachi">University of Karachi</SelectItem>
                      <SelectItem value="UmmAlQura">Umm Al-Qura (Makkah)</SelectItem>
                      <SelectItem value="Egyptian">Egyptian General Survey</SelectItem>
                      <SelectItem value="Tehran">Institute of Geophysics Tehran</SelectItem>
                      <SelectItem value="Kuwait">Kuwait</SelectItem>
                      <SelectItem value="Qatar">Qatar</SelectItem>
                      <SelectItem value="Singapore">Singapore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="madhab">Madhab (Asr Calculation)</Label>
                  <Select
                    value={prayerSettings.madhab}
                    onValueChange={(value) => setPrayerSettings(prev => ({ ...prev, madhab: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Shafi">Shafi (Standard)</SelectItem>
                      <SelectItem value="Hanafi">Hanafi (Later Asr)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Manual Adjustments */}
              <div>
                <h4 className="font-medium mb-4">Manual Time Adjustments (minutes)</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((prayer) => (
                    <div key={prayer} className="space-y-2">
                      <Label htmlFor={`${prayer}_adjustment`} className="capitalize">
                        {prayer}
                      </Label>
                      <Input
                        id={`${prayer}_adjustment`}
                        type="number"
                        min="-30"
                        max="30"
                        value={prayerSettings[`${prayer}_adjustment` as keyof PrayerSettings] as number}
                        onChange={(e) => setPrayerSettings(prev => ({ 
                          ...prev, 
                          [`${prayer}_adjustment`]: parseInt(e.target.value) || 0 
                        }))}
                        className="text-center"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Adjust prayer times to match your local mosque. Use positive values to add minutes, negative to subtract.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure prayer time and task reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications_enabled" className="text-base font-medium">
                    Enable Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders for prayer times and tasks
                  </p>
                </div>
                <Switch
                  id="notifications_enabled"
                  checked={prayerSettings.notifications_enabled}
                  onCheckedChange={(checked) => setPrayerSettings(prev => ({ ...prev, notifications_enabled: checked }))}
                />
              </div>

              {prayerSettings.notifications_enabled && (
                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                  <Label htmlFor="notification_minutes_before">
                    Remind me before prayer time (minutes)
                  </Label>
                  <Select
                    value={prayerSettings.notification_minutes_before.toString()}
                    onValueChange={(value) => setPrayerSettings(prev => ({ 
                      ...prev, 
                      notification_minutes_before: parseInt(value) 
                    }))}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="20">20 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Calendar Integration */}
          <CalendarExport />

        </div>
      </main>
    </div>
  )
}

export default Settings