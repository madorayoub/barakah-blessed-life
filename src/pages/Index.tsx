import { Star, Clock, Book, Target, Heart, Compass, Calendar, TrendingUp, Play, ArrowRight, Check, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"

const Index = () => {
  const features = [
    {
      icon: Clock,
      title: "Never Miss a Prayer",
      description: "Accurate prayer times calculated for your location and synced to your external calendars"
    },
    {
      icon: TrendingUp,
      title: "Spiritual Growth Tracking",
      description: "Track Quran reading, dhikr, and religious goals alongside your daily productivity tasks"
    },
    {
      icon: Calendar,
      title: "Seamless Calendar Integration",
      description: "Your spiritual practices appear alongside work meetings and personal events in Google Calendar and Apple Calendar"
    }
  ]

  const testimonials = [
    {
      quote: "Finally, my prayer times appear right next to my work meetings. I never miss Dhuhr anymore!",
      author: "Ahmad K.",
      role: "Software Engineer",
      location: "London, UK"
    },
    {
      quote: "The spiritual growth tracking keeps me motivated. I can see my Quran reading progress alongside my fitness goals.",
      author: "Fatima S.",
      role: "Medical Student", 
      location: "Toronto, Canada"
    },
    {
      quote: "Having Islamic calendar events in my Google Calendar helps me prepare for Ramadan and Eid properly.",
      author: "Omar R.",
      role: "Business Owner",
      location: "Dubai, UAE"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-gray-50 to-emerald-100 min-h-screen flex items-center">
        {/* Subtle Islamic Geometric Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25px 25px, hsl(158, 64%, 52%) 2px, transparent 0),
              radial-gradient(circle at 75px 75px, hsl(158, 64%, 52%) 1px, transparent 0)
            `,
            backgroundSize: '100px 100px'
          }} />
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-emerald-900 leading-tight">
              Harmonize Your Spiritual 
              <br />
              <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                and Daily Life
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The Islamic productivity app that integrates prayer times, Quran reading, and spiritual goals 
              with your existing <strong>Google Calendar</strong> and <strong>Apple Calendar</strong>
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/auth/signup">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-4 h-auto shadow-lg hover:shadow-xl transition-all duration-300">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Start Your Spiritual Journey
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="ghost" className="text-emerald-700 border-emerald-300 hover:bg-emerald-50 text-lg px-8 py-4 h-auto transition-all duration-300">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicator */}
            <div className="flex items-center justify-center gap-3 text-sm text-emerald-700">
              <Users className="h-4 w-4" />
              <span className="font-medium">Trusted by Muslims worldwide</span>
              <div className="flex -space-x-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-4 w-4 text-amber-500" fill="currentColor" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-emerald-700 bg-emerald-100">
              Core Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Everything You Need for 
              <span className="text-emerald-600"> Spiritual Success</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Seamlessly blend Islamic practices with modern productivity tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-gray-50 to-emerald-50">
                <CardContent className="p-0">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-lg">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-emerald-700 bg-emerald-100">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Trusted by Muslims Worldwide
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how Barakah Tasks is transforming spiritual practice around the globe
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-4 w-4 text-amber-500" fill="currentColor" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-xs text-emerald-600">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="secondary" className="mb-4 text-emerald-700 bg-emerald-100">
                  Calendar Integration
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  Your Spiritual Life, 
                  <span className="text-emerald-600"> Perfectly Organized</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  No more switching between apps. See your prayer times, Islamic events, 
                  and spiritual goals right alongside your work meetings and personal commitments.
                </p>
                
                <div className="space-y-4">
                  {[
                    "Prayer times automatically appear in Google Calendar",
                    "Islamic calendar events (Ramadan, Eid) sync seamlessly", 
                    "Spiritual goals tracked alongside productivity metrics",
                    "Never miss important Islamic dates again"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                  <CardHeader className="p-0 mb-6">
                    <CardTitle className="flex items-center gap-2 text-emerald-800">
                      <Calendar className="h-5 w-5" />
                      Today's Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 space-y-3">
                    {[
                      { time: "5:30 AM", event: "Fajr Prayer", type: "prayer" },
                      { time: "9:00 AM", event: "Team Meeting", type: "work" },
                      { time: "12:45 PM", event: "Dhuhr Prayer", type: "prayer" },
                      { time: "2:00 PM", event: "Client Call", type: "work" },
                      { time: "3:30 PM", event: "Asr Prayer", type: "prayer" },
                      { time: "6:15 PM", event: "Maghrib Prayer", type: "prayer" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-white/70">
                        <div className="text-sm font-mono text-gray-600 w-20">{item.time}</div>
                        <div className={`w-2 h-2 rounded-full ${item.type === 'prayer' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        <div className="text-sm font-medium text-gray-800">{item.event}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Begin Your Spiritual Journey Today
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
              Join thousands of Muslims who have found the perfect balance between 
              spiritual devotion and daily productivity
            </p>
            
            <Link to="/auth/signup">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-gray-100 text-lg px-10 py-4 h-auto font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
                Create Free Account
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            
            <p className="text-sm mt-4 opacity-75">
              Setup takes less than 2 minutes • Free forever
            </p>
            
            <div className="flex items-center justify-center gap-6 mt-8 text-sm opacity-75">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Works with all calendars</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Privacy focused</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center">
                <Star className="h-5 w-5 text-white" fill="currentColor" />
              </div>
              <span className="font-bold text-lg text-gray-900">Barakah Tasks</span>
            </div>
            <p className="text-sm text-gray-600">
              Developed with love and devotion for the Muslim community
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index