import { ArrowLeft, Star, Heart, Users, BookOpen, Calendar, Target, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'

export default function About() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Calendar,
      title: "Accurate Prayer Times",
      description: "Location-based prayer calculations with multiple methods and madhab support"
    },
    {
      icon: Target,
      title: "Spiritual Goal Tracking",
      description: "Track Quran reading, dhikr, and Islamic habits alongside daily tasks"
    },
    {
      icon: BookOpen,
      title: "Islamic Task Templates",
      description: "Pre-built templates for Sunnah practices, charity reminders, and Islamic learning"
    },
    {
      icon: Globe,
      title: "Calendar Integration",
      description: "Sync prayer times and spiritual goals with Google Calendar and Apple Calendar"
    }
  ]

  const values = [
    {
      icon: Heart,
      title: "Faith-Centered Design",
      description: "Every feature designed to strengthen your connection with Allah and Islamic values"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by Muslims, for Muslims, with continuous feedback from the global Ummah"
    },
    {
      icon: Star,
      title: "Privacy First",
      description: "Your spiritual journey is private. No data selling, minimal tracking, maximum respect"
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
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="h-4 w-px bg-border" />
            <div>
              <h1 className="text-2xl font-bold">About Barakah Tasks</h1>
              <p className="text-muted-foreground">Your Islamic productivity companion</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-12">
          
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-lg">
              <Star className="h-10 w-10 text-white" fill="currentColor" />
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Harmonizing Faith and 
                <span className="text-emerald-600"> Daily Life</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Barakah Tasks is the Islamic productivity app that seamlessly integrates 
                prayer times, Quran reading, spiritual goals, and daily tasks into one 
                unified experience.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                🕌 Prayer Tracking
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                📖 Quran Reading
              </Badge>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                📅 Calendar Sync
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                📊 Progress Analytics
              </Badge>
            </div>
          </section>

          {/* Mission Statement */}
          <section className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              To help Muslims worldwide maintain consistent spiritual practices while managing 
              their daily responsibilities. We believe that technology should serve faith, 
              not distract from it.
            </p>
            <div className="mt-6 text-emerald-700 font-medium">
              "And whoever relies upon Allah - then He is sufficient for him. 
              Indeed, Allah will accomplish His purpose." - Quran 65:3
            </div>
          </section>

          {/* Core Features */}
          <section>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Core Features</h3>
              <p className="text-muted-foreground">
                Everything you need for a balanced spiritual and productive life
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center">
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Our Values */}
          <section>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Our Values</h3>
              <p className="text-muted-foreground">
                The Islamic principles that guide everything we build
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Version Info */}
          <section className="bg-muted/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Barakah Tasks v1.0.0</h3>
                <p className="text-sm text-muted-foreground">
                  Built with love for the Muslim community worldwide
                </p>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Latest Version
              </Badge>
            </div>
          </section>

          {/* Contact */}
          <section className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Questions or Feedback?</h3>
            <p className="text-muted-foreground">
              We'd love to hear from you and help improve your spiritual journey
            </p>
            <Button 
              onClick={() => navigate('/settings')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Contact Us via Settings
            </Button>
          </section>

        </div>
      </main>
    </div>
  )
}