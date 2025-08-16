import { ArrowLeft, Shield, Eye, Lock, Database, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'

export default function Privacy() {
  const navigate = useNavigate()

  const lastUpdated = "January 16, 2025"

  const principles = [
    {
      icon: Heart,
      title: "Faith First",
      description: "Your spiritual data is sacred. We treat it with the respect it deserves."
    },
    {
      icon: Eye,
      title: "Minimal Collection",
      description: "We only collect data essential for app functionality. No unnecessary tracking."
    },
    {
      icon: Lock,
      title: "Strong Security",
      description: "Your data is encrypted and protected with industry-standard security measures."
    },
    {
      icon: Shield,
      title: "No Selling",
      description: "We never sell, rent, or share your personal data with third parties for profit."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Settings
            </Button>
            <div className="h-4 w-px bg-border" />
            <div>
              <h1 className="text-2xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">How we protect your spiritual journey</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          
          {/* Last Updated */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              Last Updated: {lastUpdated}
            </Badge>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              v1.0.0
            </Badge>
          </div>

          {/* Introduction */}
          <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-emerald-600" />
                Our Commitment to Your Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Barakah Tasks is built with Islamic values at its core. We understand that your 
                spiritual journey is deeply personal, and we are committed to protecting your 
                privacy with the same care we would want for our own families.
              </p>
            </CardContent>
          </Card>

          {/* Core Principles */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Our Privacy Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {principles.map((principle, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center">
                        <principle.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{principle.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{principle.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* What We Collect */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Information We Collect
                </CardTitle>
                <CardDescription>
                  We only collect data necessary to provide you with accurate prayer times and productivity features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Account Information</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Email address (for account creation and authentication)</li>
                    <li>• Display name (optional, for personalization)</li>
                    <li>• Prayer calculation preferences (madhab, calculation method)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Location Data</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• City and country (for accurate prayer time calculations)</li>
                    <li>• Approximate coordinates (only when you explicitly grant permission)</li>
                    <li>• Note: We never track your real-time location or movements</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Spiritual Progress Data</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Prayer completion records</li>
                    <li>• Task creation and completion data</li>
                    <li>• Spiritual goals and progress tracking</li>
                    <li>• This data is stored securely and never shared</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* How We Use Data */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                    <div>
                      <p className="font-medium">Prayer Time Accuracy</p>
                      <p className="text-sm text-muted-foreground">Calculate precise prayer times for your location using your preferred calculation method</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                    <div>
                      <p className="font-medium">Progress Tracking</p>
                      <p className="text-sm text-muted-foreground">Show your spiritual progress, prayer streaks, and task completion analytics</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                    <div>
                      <p className="font-medium">Personalization</p>
                      <p className="text-sm text-muted-foreground">Customize the app experience based on your preferences and spiritual goals</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-muted-foreground">Send prayer reminders and task notifications (only if you enable them)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Data Security */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Data Security & Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Your data is stored securely using Supabase (a trusted, SOC 2 compliant platform) 
                  with industry-standard encryption both in transit and at rest.
                </p>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Security Measures:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• End-to-end encryption for all data transmission</li>
                    <li>• Secure authentication with industry-standard protocols</li>
                    <li>• Regular security audits and updates</li>
                    <li>• Limited access controls - only you can see your data</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Third Parties */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We use minimal third-party services, all chosen for their reliability and privacy standards:
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <div>
                      <p className="font-medium">Supabase</p>
                      <p className="text-sm text-muted-foreground">Database and authentication</p>
                    </div>
                    <Badge variant="outline">Essential</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <div>
                      <p className="font-medium">Browser Notifications</p>
                      <p className="text-sm text-muted-foreground">Prayer time reminders (optional)</p>
                    </div>
                    <Badge variant="outline">Optional</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Your Rights */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Your Rights & Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">You have complete control over your data:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Access & Export</h4>
                    <p className="text-sm text-muted-foreground">View and export all your data through the Settings page</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Modify & Delete</h4>
                    <p className="text-sm text-muted-foreground">Update or delete your account and data at any time</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Notification Control</h4>
                    <p className="text-sm text-muted-foreground">Enable or disable notifications through browser settings</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Data Portability</h4>
                    <p className="text-sm text-muted-foreground">Export your spiritual progress data in standard formats</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Contact */}
          <section>
            <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
              <CardHeader>
                <CardTitle>Questions About Privacy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy or how we handle your data, 
                  please don't hesitate to reach out through the feedback option in Settings.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  "And Allah is ever, over all things, an Observer." - Quran 33:52
                </p>
              </CardContent>
            </Card>
          </section>

        </div>
      </main>
    </div>
  )
}