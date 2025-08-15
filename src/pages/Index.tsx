import { Star, Clock, Book, Target, Heart, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import PrayerTimes from "@/components/PrayerTimes"
import TaskManager from "@/components/TaskManager"
import IslamicCalendar from "@/components/IslamicCalendar"


const Index = () => {
  const features = [
    {
      icon: Clock,
      title: "Prayer Times",
      description: "Accurate prayer times with beautiful Adhan notifications"
    },
    {
      icon: Compass,
      title: "Qibla Direction",
      description: "Find the direction to Mecca from anywhere in the world"
    },
    {
      icon: Book,
      title: "Quran Reader",
      description: "Read, listen, and reflect with translations and recitations"
    },
    {
      icon: Target,
      title: "Habit Tracking",
      description: "Track Islamic practices and spiritual growth"
    },
    {
      icon: Heart,
      title: "Dua Library",
      description: "Extensive collection of supplications for every occasion"
    },
    {
      icon: Star,
      title: "Productivity",
      description: "Seamlessly blend spiritual and worldly goals"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-gray-50 to-emerald-100">
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-br from-primary to-primary-dark bg-clip-text text-transparent">
              Barakah Tasks
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A blessed productivity app that harmonizes your spiritual practices 
              with daily tasks, guided by Islamic principles
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary-dark text-white hover:from-primary-dark hover:to-primary transition-all duration-300">
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  View Demo & Features
                </Button>
              </Link>
            </div>
            <div className="mt-8 text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Star className="h-4 w-4 text-amber-500" fill="currentColor" />
              <span>Join thousands finding barakah in productivity</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Islamic Productivity Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to live a blessed and productive life, 
              all in one beautiful app
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Daily Spiritual Dashboard
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience a seamless blend of Islamic practices and modern productivity
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="lg:col-span-1">
              <PrayerTimes />
            </div>
            <div className="lg:col-span-1">
              <TaskManager />
            </div>
            <div className="lg:col-span-1">
              <IslamicCalendar />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-emerald-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Begin Your Blessed Journey Today
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Download Barakah Tasks and discover how spiritual mindfulness 
              can transform your daily productivity
            </p>
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-all duration-300">
              Download Now - Free
            </Button>
            <div className="mt-6 text-sm text-muted-foreground">
              Available on iOS and Android
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-card">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-5 w-5 text-amber-500" fill="currentColor" />
            <span className="font-semibold text-lg">Barakah Tasks</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Developed with love and devotion for the Muslim community
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Index