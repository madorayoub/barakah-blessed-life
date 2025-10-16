import { Star, Clock, Book, Target, Heart, Compass, Calendar, TrendingUp, Play, ArrowRight, Check, Users, BookOpen, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"

const Index = () => {
  const features = [
    {
      icon: Clock,
      title: "Smart Prayer Integration",
      description: "Never miss a prayer with accurate times that sync seamlessly with your existing calendar apps"
    },
    {
      icon: BookOpen,
      title: "Islamic Task Management",
      description: "Organize daily tasks alongside spiritual goals like Quran reading, dhikr, and Islamic studies"
    },
    {
      icon: Calendar,
      title: "Unified Life Calendar",
      description: "See your prayers, work meetings, and spiritual practices in one beautifully organized view"
    },
    {
      icon: TrendingUp,
      title: "Spiritual Growth Tracking",
      description: "Monitor your Islamic practices and build consistent habits with detailed progress insights"
    }
  ]

  const benefits = [
    "Automated prayer time calculations for any location",
    "Seamless Google Calendar & Apple Calendar integration", 
    "Islamic holiday and important date tracking",
    "Customizable spiritual goal setting and tracking",
    "Beautiful, distraction-free interface designed for focus",
    "Offline support for prayers and Quran reading"
  ]

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-slate-950 dark:to-gray-900 text-foreground transition-colors"
    >
      
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-border dark:border-gray-800 dark:bg-gray-950/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">ب</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight dark:text-white">Barakah Life</h1>
                <p className="text-sm text-emerald-600 font-medium dark:text-emerald-300">Islamic Productivity</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/demo"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors dark:text-gray-300 dark:hover:text-white"
              >
                Demo
              </Link>
              <Link
                to="/pricing"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors dark:text-gray-300 dark:hover:text-white"
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors dark:text-gray-300 dark:hover:text-white"
              >
                About
              </Link>
              <Link to="/auth/login">
                <Button variant="ghost" className="font-medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/signup">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-6 bg-emerald-100 text-emerald-700 border-emerald-200 text-sm font-medium px-4 py-2 dark:border-emerald-900/60 dark:bg-emerald-900/40 dark:text-emerald-200">
            ✨ Transform Your Spiritual Productivity
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight dark:text-white">
            Integrate Your
            <span className="text-emerald-600 dark:text-emerald-400"> Islamic Life</span>
            <br />
            With Modern Productivity
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed dark:text-gray-300">
            Barakah Life seamlessly blends your prayers, spiritual goals, and daily tasks into one beautifully organized system. 
            Stay connected to your faith while achieving your worldly goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/auth/signup">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg font-semibold shadow-xl">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg font-semibold border-2 dark:border-emerald-500 dark:text-emerald-200 dark:hover:bg-emerald-500/10"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              Privacy-first design
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-600" />
              Works offline
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-600" />
              Trusted by Muslims worldwide
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">
              Everything You Need for Islamic Productivity
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              Thoughtfully designed features that respect your faith while boosting your productivity
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-border/60 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 dark:border-gray-800">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 dark:bg-emerald-900/50">
                    <feature.icon className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-emerald-50 dark:bg-emerald-950/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">
              Why Choose Barakah Life?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Built specifically for Muslims who want to excel in both dunya and akhirah
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-4">
                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <p className="text-gray-700 font-medium dark:text-gray-200">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-900 text-white dark:bg-gray-950">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Start Your Islamic Productivity Journey Today
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto dark:text-gray-200">
            Join thousands of Muslims who have transformed their daily routine with Barakah Life. 
            It's free to start, and your spiritual data stays private.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/signup">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg font-semibold">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg font-semibold dark:hover:bg-white/10 dark:hover:text-white"
              >
                Explore Features
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-400 mt-8 dark:text-gray-300">
            "And it is He who created the heavens and earth in truth. And the day He says, 'Be,' and it is, His word is the truth." - Quran 6:73
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12 px-6 dark:bg-gray-950 dark:border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">ب</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Barakah Life</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Islamic Productivity</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <Link to="/privacy" className="hover:text-gray-900 transition-colors dark:hover:text-gray-100">
                Privacy Policy
              </Link>
              <Link to="/about" className="hover:text-gray-900 transition-colors dark:hover:text-gray-100">
                About
              </Link>
              <Link to="/help" className="hover:text-gray-900 transition-colors dark:hover:text-gray-100">
                Support
              </Link>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <p>© 2024 Barakah Life. Built with love for the Muslim community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index
