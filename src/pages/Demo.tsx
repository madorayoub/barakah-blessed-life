import { useState } from "react"
import { Play, Code, Smartphone, Calendar, Clock, BookOpen, TrendingUp, ArrowLeft, Check, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"

export default function Demo() {
  const [activeDemo, setActiveDemo] = useState('tasks')

  const demoSections = [
    {
      id: 'tasks',
      title: 'Barakah Tasks',
      description: 'Organize spiritual and daily tasks with Islamic templates',
      icon: Check,
      features: [
        'Pre-built Islamic task templates (Prayer reminders, Quran reading, Dhikr)',
        'Smart scheduling around prayer times',
        'Spiritual goal tracking and streaks',
        'Integration with daily productivity tasks'
      ]
    },
    {
      id: 'calendar',
      title: 'Barakah Calendar',
      description: 'Unified view of prayers, tasks, and life events',
      icon: Calendar,
      features: [
        'Automatic prayer time calculations for your location',
        'Islamic calendar dates and holidays',
        'Seamless Google Calendar & Apple Calendar sync',
        'Beautiful month, week, and day views'
      ]
    },
    {
      id: 'prayers',
      title: 'Prayer Management',
      description: 'Never miss a prayer with smart notifications',
      icon: Clock,
      features: [
        'Accurate prayer times based on calculation methods',
        'Customizable notification timing',
        'Prayer completion tracking',
        'Integration with existing calendar apps'
      ]
    },
    {
      id: 'quran',
      title: 'Quran Reading',
      description: 'Track your Quran reading journey',
      icon: BookOpen,
      features: [
        'Reading session tracking',
        'Progress visualization',
        'Bookmark favorite verses',
        'Reading goals and reminders'
      ]
    },
    {
      id: 'analytics',
      title: 'Spiritual Analytics',
      description: 'Insights into your Islamic practices',
      icon: TrendingUp,
      features: [
        'Prayer completion rates and patterns',
        'Spiritual goal achievement tracking',
        'Weekly and monthly progress reports',
        'Motivational insights and recommendations'
      ]
    }
  ]

  const testimonials = [
    {
      quote: "Finally, an app that understands my Muslim lifestyle. Prayer times sync perfectly with my work calendar.",
      author: "Ahmad K.",
      role: "Software Engineer",
      location: "London, UK",
      rating: 5
    },
    {
      quote: "The Islamic task templates save me so much time. I love how it reminds me of dhikr and Quran reading.",
      author: "Fatima S.",
      role: "Medical Student", 
      location: "Toronto, Canada",
      rating: 5
    },
    {
      quote: "Beautifully designed and incredibly useful. It's helped me be more consistent with my spiritual goals.",
      author: "Omar R.",
      role: "Business Owner",
      location: "Dubai, UAE",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">ب</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Barakah Life Demo</h1>
              </div>
            </div>
            
            <Link to="/auth/signup">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-emerald-50 to-white">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-6 bg-emerald-100 text-emerald-700 border-emerald-200">
            📱 Interactive Demo
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Explore Barakah Life Features
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            See how Barakah Life seamlessly integrates your Islamic practices with modern productivity. 
            Each feature is designed to help you excel in both your spiritual and worldly goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/signup">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('demo-sections')?.scrollIntoView({ behavior: 'smooth' })}>
              <Play className="mr-2 h-5 w-5" />
              Explore Features
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Sections */}
      <section id="demo-sections" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Islamic Productivity Suite
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Click on each feature to learn more about how it can transform your daily routine
            </p>
          </div>

          {/* Feature Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {demoSections.map((section) => (
              <Button
                key={section.id}
                variant={activeDemo === section.id ? "default" : "outline"}
                onClick={() => setActiveDemo(section.id)}
                className={`flex items-center gap-2 ${
                  activeDemo === section.id 
                    ? "bg-emerald-600 text-white" 
                    : "hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                <section.icon className="h-4 w-4" />
                {section.title}
              </Button>
            ))}
          </div>

          {/* Active Demo Content */}
          {demoSections.map((section) => (
            activeDemo === section.id && (
              <Card key={section.id} className="max-w-4xl mx-auto shadow-xl border-0">
                <CardHeader className="text-center bg-gradient-to-r from-emerald-50 to-teal-50">
                  <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <section.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">{section.title}</CardTitle>
                  <p className="text-lg text-gray-600">{section.description}</p>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Feature List */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features:</h3>
                      <ul className="space-y-3">
                        {section.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Mock Interface Preview */}
                    <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
                      <div className="text-center text-gray-500 py-8">
                        <Smartphone className="h-12 w-12 mx-auto mb-4 text-emerald-600" />
                        <p className="font-medium">Interactive Preview</p>
                        <p className="text-sm mt-2">Sign up to see the full interface</p>
                        <Link to="/auth/signup">
                          <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                            Try It Live
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Barakah Life Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple setup, powerful results for your Islamic productivity
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sign Up & Setup</h3>
              <p className="text-gray-600">
                Create your account and set your location for accurate prayer times. The setup takes less than 2 minutes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Organize Your Life</h3>
              <p className="text-gray-600">
                Add your spiritual goals, daily tasks, and sync with your existing calendars for a unified view.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Track & Improve</h3>
              <p className="text-gray-600">
                Monitor your progress, build consistent habits, and achieve your spiritual and worldly goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Loved by Muslims Worldwide
            </h2>
            <p className="text-lg text-gray-600">
              See what our community says about their experience with Barakah Life
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-lg border-0 bg-gradient-to-br from-white to-emerald-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-emerald-600">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-emerald-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join thousands of Muslims who have already integrated their spiritual and worldly goals with Barakah Life.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/auth/signup">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                Start Your Free Account
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-emerald-600 px-8 py-6 text-lg font-semibold">
              <Users className="mr-2 h-5 w-5" />
              Join the Community
            </Button>
          </div>
          
          <p className="text-sm opacity-75">
            Free forever • No credit card required • Privacy-first design
          </p>
        </div>
      </section>
    </div>
  )
}