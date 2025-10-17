import { useEffect, useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { MapPin, Clock, Settings, Bell, CheckCircle2, ArrowRight, ArrowLeft, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import { calculatePrayerTimes, formatPrayerTime } from '@/lib/prayerTimes'

// Onboarding component - manages initial app setup flow

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: LucideIcon
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

const highLatitudeRuleOptions = [
  {
    value: 'MiddleOfTheNight',
    label: 'Middle of the Night',
    description: 'Splits the night in half for Fajr and Isha adjustments.'
  },
  {
    value: 'SeventhOfTheNight',
    label: '1/7 of the Night',
    description: 'Uses one seventh of night length to balance timings.'
  },
  {
    value: 'TwilightAngle',
    label: 'Angle-based',
    description: 'Keeps the calculation angles consistent year-round.'
  }
]

interface OnboardingProps {
  onComplete: () => void
}

function getDefaultMethodForCountry(countryCodeOrName?: string | null): string {
  if (!countryCodeOrName) {
    return 'MuslimWorldLeague'
  }

  const normalized = countryCodeOrName.trim().toUpperCase()

  if (['US', 'USA', 'UNITED STATES', 'UNITED STATES OF AMERICA'].includes(normalized)) {
    return 'ISNA'
  }

  if (['CA', 'CANADA'].includes(normalized)) {
    return 'ISNA'
  }

  if (['SA', 'SAUDI ARABIA', 'SAUDI-ARABIA', 'KINGDOM OF SAUDI ARABIA'].includes(normalized)) {
    return 'UmmAlQura'
  }

  return 'MuslimWorldLeague'
}

const DEFAULT_CALCULATION_METHOD = getDefaultMethodForCountry(undefined)

export function Onboarding({ onComplete }: OnboardingProps) {
  const { user } = useAuth()
  const { requestPermission } = useNotifications()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    location_city: '',
    location_country: '',
    country_code: '',
    calculation_method: DEFAULT_CALCULATION_METHOD,
    madhab: 'Shafi',
    high_latitude_rule: 'MiddleOfTheNight',
    difficulty_mode: 'basic',
    coordinates: { latitude: 0, longitude: 0 }
  })
  const [methodManuallySelected, setMethodManuallySelected] = useState(false)
  const [highLatitudeManuallySelected, setHighLatitudeManuallySelected] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [detectedLocationMessage, setDetectedLocationMessage] = useState<string | null>(null)
  const [useDetectedCoordinatesConfirmed, setUseDetectedCoordinatesConfirmed] = useState(false)

  const calculationMethodOptions = useMemo(
    () => [
      { value: 'ISNA', label: 'ISNA (North America)' },
      { value: 'MuslimWorldLeague', label: 'Muslim World League' },
      { value: 'Karachi', label: 'University of Karachi' },
      { value: 'UmmAlQura', label: 'Umm Al-Qura (Makkah)' },
      { value: 'Egyptian', label: 'Egyptian General Survey' },
      { value: 'Tehran', label: 'Tehran' },
      { value: 'Kuwait', label: 'Kuwait' },
      { value: 'Qatar', label: 'Qatar' },
      { value: 'Singapore', label: 'Singapore' }
    ],
    []
  )

  const recommendedMethod = useMemo(() => {
    const countryHint = formData.country_code || formData.location_country || undefined
    return getDefaultMethodForCountry(countryHint)
  }, [formData.country_code, formData.location_country])

  const recommendedMethodLabel = useMemo(() => {
    return calculationMethodOptions.find(option => option.value === recommendedMethod)?.label
  }, [calculationMethodOptions, recommendedMethod])

  const currentMethodLabel = useMemo(() => {
    return calculationMethodOptions.find(option => option.value === formData.calculation_method)?.label || formData.calculation_method
  }, [calculationMethodOptions, formData.calculation_method])

  const detectedCoordinateLabel = useMemo(() => {
    const { latitude, longitude } = formData.coordinates
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return ''
    if (latitude === 0 && longitude === 0) return ''
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
  }, [formData.coordinates.latitude, formData.coordinates.longitude])

  useEffect(() => {
    if (
      currentStep === 2 &&
      !methodManuallySelected &&
      (!formData.calculation_method || formData.calculation_method === DEFAULT_CALCULATION_METHOD) &&
      recommendedMethod &&
      formData.calculation_method !== recommendedMethod
    ) {
      setFormData(prev => ({
        ...prev,
        calculation_method: recommendedMethod
      }))
    }
  }, [currentStep, formData.calculation_method, methodManuallySelected, recommendedMethod])

  useEffect(() => {
    if (Math.abs(formData.coordinates.latitude) >= 48) {
      setAdvancedOpen(true)
    }
  }, [formData.coordinates.latitude])

  useEffect(() => {
    const latitude = Math.abs(formData.coordinates.latitude)
    if (!latitude) return

    const recommendedRule = latitude >= 48 ? 'TwilightAngle' : 'MiddleOfTheNight'

    if (!highLatitudeManuallySelected && formData.high_latitude_rule !== recommendedRule) {
      setFormData(prev => ({
        ...prev,
        high_latitude_rule: recommendedRule
      }))
    }
  }, [
    formData.coordinates.latitude,
    formData.high_latitude_rule,
    highLatitudeManuallySelected
  ])

  const prayerPreview = useMemo(() => {
    try {
      if (!formData.coordinates || (formData.coordinates.latitude === 0 && formData.coordinates.longitude === 0)) {
        return null
      }

      return calculatePrayerTimes(
        formData.coordinates.latitude,
        formData.coordinates.longitude,
        new Date(),
        {
          calculation_method: formData.calculation_method,
          madhab: formData.madhab,
          high_latitude_rule: formData.high_latitude_rule
        }
      )
    } catch (error) {
      console.error('Error generating prayer preview:', error)
      return null
    }
  }, [
    formData.calculation_method,
    formData.coordinates.latitude,
    formData.coordinates.longitude,
    formData.high_latitude_rule,
    formData.madhab
  ])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          setUseDetectedCoordinatesConfirmed(false)
          setDetectedLocationMessage(
            `Detected coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (resolving city...)`
          )

          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            )

            if (!response.ok) {
              throw new Error('Reverse geocode failed')
            }

            const data = await response.json()
            const city = data.city || data.locality || ''
            const country = data.countryName || ''
            const recommended = getDefaultMethodForCountry(data.countryCode || country)

            const locationDisplay = [city, country].filter(Boolean).join(', ')

            setFormData(prev => ({
              ...prev,
              location_city: city,
              location_country: country,
              country_code: data.countryCode || '',
              calculation_method: !methodManuallySelected ? recommended : prev.calculation_method,
              coordinates: {
                latitude,
                longitude
              }
            }))
            setUseDetectedCoordinatesConfirmed(false)
            setDetectedLocationMessage(
              locationDisplay
                ? `Detected: ${locationDisplay}`
                : `Detected coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            )

            toast({
              title: "Location detected",
              description: `${city ? `${city}, ` : ''}${country}`
            })
          } catch (error) {
            console.error('Error reverse geocoding location:', error)
            setFormData(prev => ({
              ...prev,
              coordinates: {
                latitude,
                longitude
              }
            }))
            setUseDetectedCoordinatesConfirmed(false)
            setDetectedLocationMessage(
              `Detected coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (enter your city manually or confirm below)`
            )
            toast({
              title: "Location detected",
              description: "Coordinates saved. Please enter your city manually."
            })
          }
        },
        (error) => {
          console.error('Error getting location:', error)
          setDetectedLocationMessage(null)
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
    console.log('Starting onboarding completion...')
    console.log('User:', user)
    console.log('Form data:', formData)
    
    setLoading(true)
    try {
      if (user) {
        // Try to update profile if user exists
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: user.id,
            location_city: formData.location_city,
            location_country: formData.location_country,
            location_latitude: formData.coordinates.latitude,
            location_longitude: formData.coordinates.longitude,
            difficulty_mode: formData.difficulty_mode
          })

        if (profileError) {
          console.error('Profile update error:', profileError)
          // Don't throw - continue anyway
        }

        // Try to create/update prayer settings
        const { error: settingsError } = await supabase
          .from('prayer_settings')
          .upsert({
            user_id: user.id,
            calculation_method: formData.calculation_method,
            madhab: formData.madhab,
            high_latitude_rule: formData.high_latitude_rule,
            notifications_enabled: true,
            notification_minutes_before: 10
          })

        if (settingsError) {
          console.error('Settings update error:', settingsError)
          // Don't throw - continue anyway
        }
      }

      // Mark onboarding as complete regardless of database operations
      localStorage.setItem('onboarding-completed', 'true')
      
      console.log('Onboarding marked as complete')

      toast({
        title: "Setup complete!",
        description: "Your Islamic productivity journey starts now"
      })

      console.log('Calling onComplete callback...')
      onComplete()
    } catch (error) {
      console.error('Error completing onboarding:', error)
      
      // Even if there's an error, complete the onboarding
      localStorage.setItem('onboarding-completed', 'true')
      
      toast({
        title: "Setup complete!",
        description: "Welcome to Barakah Tasks! (Settings will sync later)"
      })
      
      onComplete()
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

  const hasManualLocation = !!formData.location_city && !!formData.location_country
  const hasDetectedCoordinates = formData.coordinates.latitude !== 0 || formData.coordinates.longitude !== 0

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
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
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
                    onChange={(e) => {
                      setUseDetectedCoordinatesConfirmed(false)
                      setDetectedLocationMessage(prev => {
                        if (prev?.includes('using detected coordinates')) {
                          return detectedCoordinateLabel
                            ? `Detected coordinates: ${detectedCoordinateLabel}`
                            : prev.replace(' (using detected coordinates)', '')
                        }
                        return prev
                      })
                      setFormData(prev => ({ ...prev, location_city: e.target.value }))
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Country</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg"
                    placeholder="Your country"
                    value={formData.location_country}
                    onChange={(e) => {
                      setUseDetectedCoordinatesConfirmed(false)
                      setDetectedLocationMessage(prev => {
                        if (prev?.includes('using detected coordinates')) {
                          return detectedCoordinateLabel
                            ? `Detected coordinates: ${detectedCoordinateLabel}`
                            : prev.replace(' (using detected coordinates)', '')
                        }
                        return prev
                      })
                      setFormData(prev => ({ ...prev, location_country: e.target.value, country_code: '' }))
                    }}
                  />
                </div>
              </div>

              <div className="text-center">
                <Button onClick={getCurrentLocation} variant="outline" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Auto-detect my location
                </Button>
                {detectedLocationMessage && (
                  <div className="mt-3 rounded-md border border-dashed border-emerald-200 bg-emerald-50/40 p-3 text-sm text-emerald-900">
                    <p>{detectedLocationMessage}</p>
                    {hasDetectedCoordinates && detectedCoordinateLabel && !hasManualLocation && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Button
                          size="sm"
                          variant={useDetectedCoordinatesConfirmed ? 'default' : 'outline'}
                          onClick={() => {
                            if (!detectedCoordinateLabel) return
                            setUseDetectedCoordinatesConfirmed(true)
                            setDetectedLocationMessage(
                              `Detected coordinates: ${detectedCoordinateLabel} (using detected coordinates)`
                            )
                            toast({
                              title: "Coordinates selected",
                              description: "We'll use the detected coordinates for prayer times."
                            })
                          }}
                        >
                          Use detected coordinates
                        </Button>
                        {useDetectedCoordinatesConfirmed && (
                          <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                            Confirmed
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Calculation Step */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Calculation Method</p>
                  <p className="text-xs text-muted-foreground">
                    Start with the recommended standard for your location. You can adjust it anytime.
                  </p>
                  {recommendedMethodLabel && (
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Recommended for {formData.location_country || formData.country_code || 'your region'}: {recommendedMethodLabel}
                      </Badge>
                      <button
                        type="button"
                        className="text-sm font-medium text-emerald-700 underline"
                        onClick={() => setAdvancedOpen(true)}
                      >
                        Change
                      </button>
                    </div>
                  )}
                  <div className="text-base font-semibold text-emerald-900">{currentMethodLabel}</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Madhab (Asr Calculation)</label>
                <RadioGroup
                  value={formData.madhab}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, madhab: value }))}
                  className="grid gap-3 md:grid-cols-2"
                >
                  <div className={`flex items-start gap-3 rounded-lg border p-3 ${formData.madhab === 'Shafi' ? 'border-emerald-500 bg-emerald-50' : 'border-border'}`}>
                    <RadioGroupItem id="madhab-shafi" value="Shafi" className="mt-1" />
                    <label htmlFor="madhab-shafi" className="text-sm font-medium leading-none">
                      Shafi (standard Asr)
                    </label>
                  </div>
                  <div className={`flex items-start gap-3 rounded-lg border p-3 ${formData.madhab === 'Hanafi' ? 'border-emerald-500 bg-emerald-50' : 'border-border'}`}>
                    <RadioGroupItem id="madhab-hanafi" value="Hanafi" className="mt-1" />
                    <label htmlFor="madhab-hanafi" className="text-sm font-medium leading-none">
                      Hanafi (later Asr)
                    </label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  Madhab only affects the Asr time.{' '}
                  <a
                    href="https://batoulapps.github.io/2014/09/15/calculating-prayer-times.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Learn more
                  </a>
                </p>
              </div>

              <Accordion
                type="single"
                collapsible
                value={advancedOpen ? 'advanced' : undefined}
                onValueChange={(value) => setAdvancedOpen(value === 'advanced')}
              >
                <AccordionItem value="advanced">
                  <AccordionTrigger>Advanced high-latitude settings</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Change calculation method</label>
                      <Select
                        value={formData.calculation_method}
                        onValueChange={(value) => {
                          setMethodManuallySelected(true)
                          setFormData(prev => ({ ...prev, calculation_method: value }))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a method" />
                        </SelectTrigger>
                        <SelectContent>
                          {calculationMethodOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">High Latitude Rule</label>
                      <TooltipProvider delayDuration={150}>
                        <RadioGroup
                          value={formData.high_latitude_rule}
                          onValueChange={(value) => {
                            setHighLatitudeManuallySelected(true)
                            setFormData(prev => ({ ...prev, high_latitude_rule: value }))
                          }}
                          className="space-y-2"
                        >
                          {highLatitudeRuleOptions.map(option => (
                            <Tooltip key={option.value}>
                              <TooltipTrigger asChild>
                                <div
                                  className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer ${
                                    formData.high_latitude_rule === option.value
                                      ? 'border-emerald-500 bg-emerald-50'
                                      : 'border-border'
                                  }`}
                                >
                                  <RadioGroupItem value={option.value} className="mt-1" />
                                  <div>
                                    <p className="text-sm font-medium leading-none">{option.label}</p>
                                    <p className="text-xs text-muted-foreground">{option.description}</p>
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>{option.description}</TooltipContent>
                            </Tooltip>
                          ))}
                        </RadioGroup>
                      </TooltipProvider>
                    </div>

                    <a
                      href="https://praytimes.org/calculation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground underline"
                    >
                      Learn more about high latitude rules
                    </a>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <p className="text-xs text-muted-foreground">You can change these later in Settings.</p>

              <div className="space-y-2">
                <div className="text-sm font-medium">Today's prayer times</div>
                {prayerPreview ? (
                  <div className="rounded-lg border p-3 text-sm">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {prayerPreview.prayers.map(prayer => (
                        <div key={prayer.name} className="flex items-center justify-between">
                          <span>{prayer.displayName}</span>
                          <span className="font-medium">{formatPrayerTime(prayer.time)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Set your location to preview today's Fajr through Isha times.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Difficulty Step */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.difficulty_mode === 'basic' ? 'border-primary bg-primary/10' : 'border-border'
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
                  <p className="text-sm text-muted-foreground">
                    Focus on the 5 daily prayers. Perfect for beginners.
                  </p>
                </div>

                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.difficulty_mode === 'advanced' ? 'border-primary bg-primary/10' : 'border-border'
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
                  <p className="text-sm text-muted-foreground">
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
              <p className="text-xs text-muted-foreground">
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
                disabled={currentStep === 1 && !(hasManualLocation || (hasDetectedCoordinates && useDetectedCoordinatesConfirmed))}
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