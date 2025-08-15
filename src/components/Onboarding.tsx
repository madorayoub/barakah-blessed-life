import { useState } from 'react'
import { MapPin, Clock, Settings, Bell, CheckCircle2, ArrowRight, ArrowLeft, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'

// Onboarding component - manages initial app setup flow

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
}

const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Barakah Tasks',
    description: 'Your Islamic productivity companion for prayers, tasks, and spiritual growth',
    icon: Star
  },
  {
    id: 'location',
    title: 'Set Your Location',
    description: 'We need your location to calculate accurate prayer times',
    icon: MapPin
  },
  {
    id: 'calculation',
    title: 'Prayer Calculation',
    description: 'Choose your preferred calculation method and madhab',
    icon: Clock
  },
  {
    id: 'difficulty',
    title: 'Spiritual Journey Level',
    description: 'Select your commitment level to customize your experience',
    icon: Settings
  },
  {
    id: 'notifications',
    title: 'Enable Notifications',
    description: 'Get reminders for prayer times and important tasks',
    icon: Bell
  },
  {
    id: 'complete',
    title: 'All Set!',
    description: 'Your Islamic productivity journey begins now',
    icon: CheckCircle2
  }
]

interface OnboardingProps {
  onComplete: () => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const { user } = useAuth()
  const { requestPermission } = useNotifications()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    location_city: '',
    location_country: '',
    calculation_method: 'ISNA',
    madhab: 'Shafi',
    difficulty_mode: 'basic',
    coordinates: { latitude: 0, longitude: 0 }
  })
  const [loading, setLoading] = useState(false)

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }))
          toast({
            title: "Location detected",
            description: "Your location has been automatically detected"
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          toast({
            variant: "destructive",
            title: "Location access denied",
            description: "Please enter your city and country manually"
          })
        }
      )
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          location_city: formData.location_city,
          location_country: formData.location_country,
          location_latitude: formData.coordinates.latitude,
          location_longitude: formData.coordinates.longitude,
          difficulty_mode: formData.difficulty_mode
        })
        .eq('user_id', user.id)

      if (profileError) throw profileError

      // Create/update prayer settings
      const { error: settingsError } = await supabase
        .from('prayer_settings')
        .upsert({
          user_id: user.id,
          calculation_method: formData.calculation_method,
          madhab: formData.madhab,
          notifications_enabled: true,
          notification_minutes_before: 10
        })

      if (settingsError) throw settingsError

      // Mark onboarding as complete
      localStorage.setItem('onboarding-completed', 'true')

      toast({
        title: "Setup complete!",
        description: "Your Islamic productivity journey starts now"
      })

      onComplete()
    } catch (error) {
      console.error('Error completing onboarding:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings. Please try again."
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationSetup = async () => {
    const granted = await requestPermission()
    if (granted) {
      nextStep()
    } else {
      // Still proceed even if notifications are denied
      nextStep()
    }
  }

  const currentStepData = steps[currentStep]
  const IconComponent = currentStepData.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-center mb-4">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
          <CardDescription className="text-base">
            {currentStepData.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Welcome Step */}
          {currentStep === 0 && (
            <div className="text-center space-y-4">
              <div className="bg-emerald-50 p-6 rounded-lg">
                <h3 className="font-semibold text-emerald-900 mb-2">What makes Barakah Tasks unique?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center">
                      <Clock className="h-3 w-3 text-emerald-700" />
                    </div>
                    <span>Accurate prayer times</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3 text-emerald-700" />
                    </div>
                    <span>Islamic task templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center">
                      <Settings className="h-3 w-3 text-emerald-700" />
                    </div>
                    <span>Spiritual progress tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center">
                      <Bell className="h-3 w-3 text-emerald-700" />
                    </div>
                    <span>Calendar integration</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Location Step */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg"
                    placeholder="Your city"
                    value={formData.location_city}
                    onChange={(e) => setFormData(prev => ({ ...prev, location_city: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Country</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg"
                    placeholder="Your country"
                    value={formData.location_country}
                    onChange={(e) => setFormData(prev => ({ ...prev, location_country: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="text-center">
                <Button onClick={getCurrentLocation} variant="outline" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Auto-detect my location
                </Button>
              </div>
            </div>
          )}

          {/* Calculation Step */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Calculation Method</label>
                  <Select
                    value={formData.calculation_method}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, calculation_method: value }))}
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
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Madhab (Asr Calculation)</label>
                  <Select
                    value={formData.madhab}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, madhab: value }))}
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
            </div>
          )}

          {/* Difficulty Step */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.difficulty_mode === 'basic' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, difficulty_mode: 'basic' }))}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Basic Mode</h3>
                    {formData.difficulty_mode === 'basic' && (
                      <Badge className="ml-auto">Selected</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Focus on the 5 daily prayers. Perfect for beginners.
                  </p>
                </div>
                
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.difficulty_mode === 'advanced' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, difficulty_mode: 'advanced' }))}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-amber-600" />
                    <h3 className="font-medium">Advanced Mode</h3>
                    {formData.difficulty_mode === 'advanced' && (
                      <Badge className="ml-auto">Selected</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Include Sunnah prayers, Quran reading, dhikr, and more.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Step */}
          {currentStep === 4 && (
            <div className="text-center space-y-4">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Stay Connected to Your Prayers</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Enable notifications to receive gentle reminders for prayer times and important tasks.
                </p>
                <Button onClick={handleNotificationSetup} className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Enable Notifications
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                You can always change notification settings later in the Settings page.
              </p>
            </div>
          )}

          {/* Complete Step */}
          {currentStep === 5 && (
            <div className="text-center space-y-4">
              <div className="bg-emerald-50 p-6 rounded-lg">
                <h3 className="font-semibold text-emerald-900 mb-2">🎉 Welcome to Your Spiritual Journey!</h3>
                <p className="text-sm text-emerald-700 mb-4">
                  Your Islamic productivity companion is ready. Start with prayer tracking and gradually build your spiritual habits.
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-emerald-800">Next Steps</div>
                    <div className="text-emerald-600">
                      • Check your prayer times<br/>
                      • Add your first task<br/>
                      • Explore Islamic templates
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-emerald-800">Tips</div>
                    <div className="text-emerald-600">
                      • Mark prayers complete<br/>
                      • Set realistic goals<br/>
                      • Review progress weekly
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              onClick={prevStep}
              variant="outline"
              disabled={currentStep === 0}
              className={currentStep === 0 ? 'invisible' : ''}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={currentStep === 4 ? handleNotificationSetup : nextStep}
                disabled={
                  (currentStep === 1 && !formData.location_city) ||
                  (currentStep === 1 && !formData.location_country && formData.coordinates.latitude === 0)
                }
              >
                {currentStep === 4 ? 'Continue' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? 'Setting up...' : 'Complete Setup'}
                <CheckCircle2 className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}